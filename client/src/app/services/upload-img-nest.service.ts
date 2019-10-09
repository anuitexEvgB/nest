import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImgNestService {

  constructor(private httpClient: HttpClient) { }

  uploadFile(files: any) {
    const data = new FormData();
    data.append('ol', files[0], files[0].name);
    return this.httpClient.post(`http://10.10.1.133:3000/note/upload`, data );
  }
}
