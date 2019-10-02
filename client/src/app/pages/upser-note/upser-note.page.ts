import { NestMongoService } from './../../services/nest-mongo.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';

@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {

  @Input() note: Note;

  constructor(public modalController: ModalController, private nestMongoService: NestMongoService) { }

  checked: false;
  ngOnInit() {

    if (!this.note) {
      this.note = {
        title: '',
        text: '',
        completed: false,
      };
    }
  }
  close() {
    this.modalController.dismiss();
  }

  onSubmit() {
    this.modalController.dismiss(this.note);
  }

  toggleChange(event) {
    console.log(event.detail.checked, 'toglech');
    this.note.completed = event.detail.checked;
    this.checked = event.detail.checked;
  }
}
