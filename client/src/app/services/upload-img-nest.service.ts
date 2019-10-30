import { Photo } from './../models/photo.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgNestService {

  constructor(private httpClient: HttpClient) { }

  uploadFile(files: any, id: number): Observable<any> {
    const data = new FormData();
    data.append('file', files);
    return this.httpClient.post<any[]>(`http://10.10.1.133:3000/note/upload/${id}`, data);
  }

  getPhoto(): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>('http://10.10.1.133:3000/note/getPhotos');
  }

  getPhotoById(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://10.10.1.133:3000/note/getPhotos/${id}`);
  }

  deletePhoto(id: string, namePhoto: any): Observable<any> {
    return this.httpClient.post<any>(`http://10.10.1.133:3000/note/deletePhotos/${id}`, {
      namePhoto
    });
  }

  deleteNotePhotos(id: number): Observable<void> {
    return this.httpClient.delete<void>(`http://10.10.1.133:3000/note/deletePhotos/${id}`);
  }

  addNameForDeletePhoto(namePhoto: any[]): Observable<any[]> {
    const lol = this.httpClient.post<any[]>('http://10.10.1.133:3000/note', namePhoto);
    console.log(lol);
    return lol;
  }
}
