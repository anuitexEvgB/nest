import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

import { UserResponse, User, GoogleFB, CustomResponse } from 'src/app/models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.api;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    ) { }


  public register(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.api}/users/register`, user);
  }

  // rename to social login
  public socialLogin(user: GoogleFB): Observable<CustomResponse> {
    return this.http.post<CustomResponse>(`${this.api}/users/socialLogin`, user).pipe(
      tap(async (res: CustomResponse) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.access_token));
          await this.storage.set('USER_ID', res.user_id);
        }
      })
    );
  }

  public login(user: User): Observable<UserResponse> {
    return this.http.post(`${this.api}/users/login`, user).pipe(
      tap(async (res: UserResponse) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.access_token));
          await this.storage.set('USER_ID', res.user_id);
        }
      })
    );
  }

  public async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('USER_ID');
    this.storage.get('USER_ID').then(a => console.log(a));
  }

  public async getToken() {
    return await this.storage.get('ACCESS_TOKEN').then(token => {
      return JSON.parse(token);
    });
  }

  public async getUserId() {
    return await this.storage.get('USER_ID').then(user => {
      return user;
    });
  }
}
