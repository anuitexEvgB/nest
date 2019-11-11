import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';

import { Note } from 'src/app/models/note.model';
import { AuthService, NestMongoService, DatabaseService, NetworkService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public notes: Note[] = [];

  constructor(
    public modalController: ModalController,
    public databaseService: DatabaseService,

    private noteService: NestMongoService,
    private router: Router,
    private authService: AuthService,
    private networkService: NetworkService,
  ) {
    this.noteService.noteSubject.subscribe((res) => {
      this.notes.push(res);
      this.refreshSQL();
    });
  }

  ngOnInit() {
    this.refreshSQL();
    this.getAll();
  }

  public refreshSQL() {
    this.networkService.status.subscribe(res => {
      if (res === 1) {
        this.databaseService.getRows().then(response => {
          this.notes = response;
        });
      }
    });
  }

  public doRefresh(event: { target: { complete: () => void; }; }) {
    this.getAll();
    this.refreshSQL();
    console.log(this.notes);
    event.target.complete();
  }

  public async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/auth/login');
  }

  public add() {
    this.router.navigate(['/pages/upsert']);
  }

  public edit(note: Note) {
    this.noteService.selectedNote = note;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit: true,
      }
    };
    this.router.navigate(['/pages/upsert'], navigationExtras);
  }

  public delete(note: Note) {
    let status = this.networkService.getCurrentNetworkStatus();
    const index = this.notes.indexOf(note);
    if (index > -1) {
      this.notes.splice(index, 1);
      if (status === 1) {
        if (note.id) {
          const del = {
            id: note.id,
            userId: note.userId
          }
          this.databaseService.insertRowDelete(del);
        }
        this.databaseService.deleteRowOff(note.LiteId);
      }
      if (status === 0) {
        this.databaseService.deleteRowOnl(note.id);
      }
      this.noteService.deleteNoteId(note.id).subscribe();
      return;
    }
  }

  public autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  private getAll() {
    this.noteService.getNotes()
      .subscribe(response => {
        this.notes = response;
      });
  }
}
