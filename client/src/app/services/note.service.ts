import { Note } from '../models/note.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NestMongoService {

  constructor(private http: HttpClient) { }

  public selectedNote: Note;
  public postNote: Note;
  public noteSubject = new Subject<Note>();

  API_URL = 'http://10.10.1.133:3000/note';

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.API_URL);
  }

  getNotesById(id: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.API_URL}/${id}`);
  }

  postNotes(data: Note): Observable<Note> {
    const result =  this.http.post<Note>(this.API_URL, data);
    return result;
  }

  deleteNoteId(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  updateNote(data: Note): Observable<Note> {
    return this.http.put<Note>(`${this.API_URL}/${data.id}`, data);
  }
}
