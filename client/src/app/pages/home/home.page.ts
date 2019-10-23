import { UploadImgNestService } from './../../services/upload-img-nest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UpserNotePage } from './../upser-note/upser-note.page';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { NestMongoService } from 'src/app/services/nest-mongo.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notes: Note[];

  constructor(
    public modalController: ModalController,
    private nestMongoService: NestMongoService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadImgNestService: UploadImgNestService,
    private  storage: Storage
    ) {}

  ngOnInit() {
    this.getAll();
  }

  doRefresh(event) {
    this.getAll();
    event.target.complete();
  }

  getAll() {
    this.nestMongoService.getNotes()
    .subscribe(response => {
      this.notes = response;
    });
  }

  test() {
    let a = this.storage.get('ACCESS_TOKEN');
    console.log(a);
    this.storage.remove('ACCESS_TOKEN');
    let b = this.storage.get('ACCESS_TOKEN');
    console.log(b);
  }

  logout() {
    let a = this.storage.get('ACCESS_TOKEN');
    console.log(a);
    this.storage.remove('ACCESS_TOKEN');
    let b = this.storage.get('ACCESS_TOKEN');
    console.log(b);
    this.router.navigateByUrl('login');
  }
  // add() {
  //   this.router.navigate(['upser-note']);
  // }

  add() {
    this.presentModal();
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
      component: UpserNotePage,
      showBackdrop: false,
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
          this.nestMongoService.updateNote(data).subscribe(res => console.log(res + 'edit'));
          foundEdit = true;
          break;
        }
      }
      if (!foundEdit) {
        this.nestMongoService.postNotes(data).subscribe(t => {
          console.log(t);
          this.notes.push(t);
        });
      }
    }
  }

  navigateToGeo() {
    this.router.navigate(['geolocation']);
  }

  autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }
}
