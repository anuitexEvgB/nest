import { Note } from './../models/note.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NestMongoService {

  constructor(private httpClient: HttpClient) { }

  getNotes(): Observable<Note[]> {
    return this.httpClient.get<Note[]>('http://localhost:3000/note');
  }

  getNotesById(id: number): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`http://localhost:3000/note/${id}`);
  }

  postNotes(data: Note): Observable<Note> {
    const result =  this.httpClient.post<Note>('http://localhost:3000/note', data);
    return result;
  }

  deleteNoteId(id: number): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/note/${id}`);
  }
}
