import { CustomResponse } from './../models/custom-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';
import { UserResponse } from './../models/user-response.model';
import { User } from './../models/user.model';
import { GoogleFB } from '../models/googleFB.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private  storage: Storage) { }

  AUTH_SERVER_ADDRESS = 'http://10.10.1.133:3000/users';

  getUsers(email): Observable<any> {
    return this.http.get(`${this.AUTH_SERVER_ADDRESS}/email`, email);
  }

  register(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.AUTH_SERVER_ADDRESS}/register`, user);
  }

  customReg(user: GoogleFB): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.AUTH_SERVER_ADDRESS}/customReg`, user).pipe(
      tap(async (res: CustomResponse) => {
        if (res) {
          console.log(res);
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.access_token));
          await this.storage.set('USER_ID', res.user_id);
        }
      })
    );
  }

  login(user: User): Observable<UserResponse> {
    return this.http.post(`${this.AUTH_SERVER_ADDRESS}/login`, user).pipe(
      tap(async (res: UserResponse) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.access_token));
          await this.storage.set('USER_ID', res.user_id);
        }
      })
    );
  }

  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('USER_ID');
  }

  public async getToken() {
    return await this.storage.get('ACCESS_TOKEN').then(a => {
      return JSON.parse(a);
    });
  }

  loginGoogle(user: any): Observable<any> {
    return this.http.post(`${this.AUTH_SERVER_ADDRESS}/google`, user);
  }

}
