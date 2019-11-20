import { UpserNotePage } from './../upser-note/upser-note.page';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
<<<<<<< Updated upstream
=======
import { Backlight } from '@ionic-native/backlight/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { BaiduPush } from '@ionic-native/baidu-push/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';

>>>>>>> Stashed changes
import { Note } from 'src/app/models/note.model';
import { NestMongoService } from 'src/app/services/nest-mongo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
<<<<<<< Updated upstream
  notes: Note[];
  constructor(public modalController: ModalController, private nestMongoService: NestMongoService) {}
=======

  public notes: Note[] = [];
  public brightnessModel = 0.40;

  constructor(
    public modalController: ModalController,
    public databaseService: DatabaseService,
    public alertController: AlertController,
    public toastController: ToastController,

    private noteService: NestMongoService,
    private router: Router,
    private authService: AuthService,
    private networkService: NetworkService,
    private backlight: Backlight,
    private callNumber: CallNumber,
    private vibration: Vibration,
    private youtube: YoutubeVideoPlayer,
    private baiduPush: BaiduPush,
    private tts: TextToSpeech,
    private brightness: Brightness,
  ) {
    this.brightness.setBrightness(this.brightnessModel);
    const subscription = this.noteService.noteSubject.pipe(switchMap((res) => {
      this.notes.push(res);
      return this.networkService.status;
    }));

    subscription.subscribe((res) => {
      console.log(res);
      if (res === 1) {
        this.databaseService.getRows().then(response => {
          this.notes = response;
        });
      }
    });
  }
>>>>>>> Stashed changes

  ngOnInit() {
    this.getAll();
  }

<<<<<<< Updated upstream
  doRefresh(event) {
    this.getAll();
=======
  public refreshSQL() {
    this.networkService.status.subscribe(res => {
      if (res === 1) {
        this.databaseService.getRows().then(response => {
          this.notes = response;
        });
      }
    });
  }

  adjustBrightness() {
    this.brightness.setBrightness(this.brightnessModel);
  }

  async test() {
    const toast = await this.toastController.create({
      header: 'Вийди звідси, розбійник',
      animated: true,
      mode: 'md',
      color: 'danger',
      showCloseButton: true,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
    this.vibration.vibrate(1000);
  }

  async test2() {
    const alert = await this.alertController.create({
      header: 'Call',
      inputs: [
        {
          name: 'Number',
          type: 'number',
          min: 9,
          max: 9,
          value: '+380',
          placeholder: 'write your number',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Call',
          handler: a => {
            this.callNumber.callNumber(a.number, true)
            .then(res => console.log(res))
            .catch(e => console.log(e));
          }
        }
      ]
    });
    await alert.present();
  }

  test3() {
    this.youtube.openVideo('W5adeFNRk6Y');
  }

  test4() {
    this.tts.speak('Fuck you Gleb, Powel naxui')
    .then(() => console.log('wokred'))
    .catch(e => console.log(e));
  }

  public doRefresh(event: { target: { complete: () => void; }; }) {
    this.getAll();
    this.refreshSQL();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
      this.notes.splice(index, 1);
      if (status === 1) {
        if (note.id) {
          const del = {
            id: note.id,
            userId: note.userId
          };
          this.databaseService.insertRowDelete(del);
        }
        this.databaseService.deleteRowOff(note.LiteId);
        note.PhotoId.forEach(id => {
          this.databaseService.deletePhotoOff(id);
        });
      }
      if (status === 0) {
        this.databaseService.deleteRowOnl(note.id);
        note.PhotoId.forEach(id => {
          this.databaseService.deletePhotoOff(id);
>>>>>>> Stashed changes
        });
      }
    }
  }

  autoClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }
<<<<<<< Updated upstream
=======

  private getAll() {
    this.noteService.getNotes()
      .subscribe(response => {
        this.notes = response;
      });
  }

  // getRowsPhotos() {
  //   this.databaseService.getRowsPhotos();
  // }

  // dropDBPhotos() {
  //   this.databaseService.dropDBPhotos();
  // }

  // getRows() {
  //   this.databaseService.getRows();
  // }

  // dropDB() {
  //   this.databaseService.dropDB();
  // }

  // getRowsForUpdate() {
  //   this.databaseService.getRowsForUpdate();
  // }

  // dropDBUpdate() {
  //   this.databaseService.dropDBUpdate();
  // }

  // getRowsForDelete() {
  //   this.databaseService.getRowsForDelete();
  // }

  // dropDBDel() {
  //   this.databaseService.dropDBDel();
  // }
>>>>>>> Stashed changes
}
