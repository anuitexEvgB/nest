import { UpserNotePage } from './../upser-note/upser-note.page';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { NestMongoService } from 'src/app/services/nest-mongo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notes: Note[];
  constructor(public modalController: ModalController, private nestMongoService: NestMongoService) {}

  ngOnInit() {
    this.getAll();
  }

  doRefresh(event) {
    this.getAll();
    event.target.complete();
  }

  add() {
    this.presentModal();
  }

  getAll() {
    this.nestMongoService.getNotes()
    .subscribe(response => {
      this.notes = response;
    });
  }

  async edit(note: Note) {
    await this.presentModal(note);
  }

  delete(note: Note) {
    const index = this.notes.indexOf(note);
    if (index > -1) {
      this.notes.splice(index, 1); 
      this.nestMongoService.deleteNoteId(note.id).subscribe();
      return;
    }
  }

   async presentModal(note?: Note) {
    const modalObj =  {
      component: UpserNotePage
    };

    if (note) {
      // tslint:disable-next-line: no-string-literal
      modalObj['componentProps'] = {note};
    }
    const modal = await this.modalController.create(modalObj);
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      let foundEdit = false;
      for (let index = 0; index < this.notes.length; index++) {
        if (this.notes[index] === data) {
          this.notes[index] = data;
          this.nestMongoService.postNotes(data).subscribe();
          this.nestMongoService.deleteNoteId(data.id).subscribe();
          foundEdit = true;
          break;
        }
      }
      if (!foundEdit) {
        this.nestMongoService.postNotes(data).subscribe(t => {
          this.notes.push(t);
        });
      }
    }
  }

  autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }
}
