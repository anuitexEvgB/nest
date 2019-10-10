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
    const data = new FormData();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      data.append('file', files[i], files[i].name);
    }
    console.log(data);
    return this.httpClient.post<any[]>(`http://10.10.1.133:3000/note/upload/${id}`, data);
  }

  getPhoto(): Observable<Photo[]> {
    return this.httpClient.get<Photo[]>('http://10.10.1.133:3000/note/getPhotos');
  }

}
