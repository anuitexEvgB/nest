import { AuthService } from './../../services/auth.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { NestMongoService } from 'src/app/services/note.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notes: Note[];
  ha: any[];

  constructor(
    public modalController: ModalController,
    private noteService: NestMongoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
    ) {
      this.noteService.noteSubject.subscribe((res) => {
        this.notes.push(res);
      });
    }

  ngOnInit() {
    this.getAll();
  }

  doRefresh(event) {
    this.getAll();
    event.target.complete();
  }

  getAll() {
    this.noteService.getNotes()
    .subscribe(response => {
      this.notes = response;
    });
  }

  async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('login');
  }

  add() {
    this.router.navigate(['upser-note']);
  }

  async edit(note: Note) {
    this.noteService.selectedNote = note;
    let navigationExtras: NavigationExtras = {
      queryParams: {
       edit: true,
      }
    };
    await this.router.navigate(['upser-note'], navigationExtras);
  }

  delete(note: Note) {
    const index = this.notes.indexOf(note);
    if (index > -1) {
      this.notes.splice(index, 1);
      this.noteService.deleteNoteId(note.id).subscribe();
      return;
    }
  }

  autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }
}
