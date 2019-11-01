import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';

import { Note } from 'src/app/models/note.model';
import { AuthService, NestMongoService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public notes: Note[];

  constructor(
    public modalController: ModalController,
    private noteService: NestMongoService,
    private router: Router,
    private authService: AuthService,
    ) {
      this.noteService.noteSubject.subscribe((res) => {
        this.notes.push(res);
      });
    }

  ngOnInit() {
    this.getAll();
  }

  private getAll() {
    this.noteService.getNotes()
    .subscribe(response => {
      this.notes = response;
    });
  }

  public doRefresh(event: { target: { complete: () => void; }; }) {
    this.getAll();
    event.target.complete();
  }

  public async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('login');
  }

  public add() {
    this.router.navigate(['upser-note']);
  }

  public edit(note: Note) {
    this.noteService.selectedNote = note;
    const navigationExtras: NavigationExtras = {
      queryParams: {
       edit: true,
      }
    };
    this.router.navigate(['upser-note'], navigationExtras);
  }

  public delete(note: Note) {
    const index = this.notes.indexOf(note);
    if (index > -1) {
      this.notes.splice(index, 1);
      this.noteService.deleteNoteId(note.id).subscribe();
      return;
    }
  }

  public autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }
}
