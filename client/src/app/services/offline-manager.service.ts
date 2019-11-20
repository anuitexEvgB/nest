import { Injectable } from '@angular/core';

// Services
import { DatabaseService } from 'src/app/services/sqlLite.service';
import { NestMongoService } from 'src/app/services/note.service';

// Models
import { Photo } from 'src/app/models';



@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  photoSend: Photo[] = [];
  constructor(
    private databaseService: DatabaseService,
    private noteService: NestMongoService,
  ) { }

  public async checkForEvents() {
    await this.databaseService.getRowsForDelete().then(noti => {
      noti.forEach(nota => {
        this.noteService.deleteNoteId(nota.id).subscribe(() => {
          this.databaseService.deleteRowDelete(nota.id);
        });
      });
    });
    await this.databaseService.getRowsForUpdate().then(notesUp => {
      notesUp.forEach(noteUp => {
        this.noteService.updateNote(noteUp).subscribe(() => {
          this.databaseService.deleteRowUpdate(noteUp.id);
        });
      });
    });
    return await this.databaseService.getRows().then(notes => {
      notes.forEach(async note => {
        if (note.id === null || note.id === 0) {
          delete note.id;
          this.noteService.postNotes(note, []).subscribe(res => {
            this.databaseService.updateId(res);
          });
        }
      });
    });
  }
}
