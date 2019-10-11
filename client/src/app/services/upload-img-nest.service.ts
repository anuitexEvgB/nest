import { Photo } from './../models/photo.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgNestService {

  constructor(private httpClient: HttpClient) { }

  uploadFile(files: any[], id: number): Observable<any> {
    console.log(files);
    const data = new FormData();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      data.append('file', files[i], files[i].name);
    }
    return this.httpClient.post<any[]>(`http://10.10.1.133:3000/note/upload/${id}`, data);
  }

  getPhoto(): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>('http://10.10.1.133:3000/note/getPhotos');
  }

  getPhotoById(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://10.10.1.133:3000/note/getPhotos/${id}`);
  }

  deletePhoto(id: number, namePhoto): Observable<any> {
    console.log(namePhoto);
    return this.httpClient.delete<any>(`http://10.10.1.133:3000/note/getPhotos/${id}`, namePhoto);
  }

  addNameForDeletePhoto(namePhoto: any[]): Observable<any[]> {
    console.log(namePhoto);
    const lol = this.httpClient.post<any[]>('http://10.10.1.133:3000/note', namePhoto);
    console.log(lol);
    return lol;
  }

}
