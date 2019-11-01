import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Photo } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadImgNestService {
  private api = environment.api;

  constructor(
    private httpClient: HttpClient,
    ) { }

  public uploadFile(files: any, id: number): Observable<any> {
    const data = new FormData();
    data.append('file', files);
    return this.httpClient.post<any[]>(`${this.api}/note/upload/${id}`, data);
  }

  public getPhoto(id: number): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>(`${this.api}/note/getPhotos/${id}`);
  }

  public deletePhoto(id: string, namePhoto: any): Observable<any> {
    return this.httpClient.post<any>(`${this.api}/note/deletePhotos/${id}`, {
      namePhoto
    });
  }
}
