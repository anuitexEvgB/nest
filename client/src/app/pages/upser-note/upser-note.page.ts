import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadImgNestService } from './../../services/upload-img-nest.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {
  @Input() note: Note;
  checked: false;
  photos = [];


  constructor(
    public modalController: ModalController,
    private camera: Camera,
    private uploadImgNestService: UploadImgNestService,
    private photoViewer: PhotoViewer,
  ) {
    this.uploadPhoto();
  }

  ngOnInit() {
    if (!this.note) {
      this.note = {
        title: '',
        text: '',
        photos: [],
        completed: false,
      };
    }
  }

  showPhoto(img: string) {
    this.photoViewer.show(img, 'Photo');
  }

  uploadPhoto() {
    this.uploadImgNestService.getPhoto()
      .subscribe(res => {
        res.forEach(element => {
          if (element.noteId === this.note.id) {
            const path = 'http://10.10.1.133:3000/uploads/' + element.photo;
            this.photos.unshift(path);
            this.note.photos.push(element);
          }
        });
      });
  }

  close() {
    this.modalController.dismiss();
  }

  onSubmit() {
    this.modalController.dismiss(this.note);
  }

  toggleChange(event: { detail: { checked: false; }; }) {
    this.note.completed = event.detail.checked;
    this.checked = event.detail.checked;
  }

  deleteFile(photo: string) {
    console.log(photo);
    const index = this.photos.indexOf(photo);
    console.log(index);
    if (index > -1) {
      this.photos.splice(index, 1);
    }
    this.uploadImgNestService.getPhoto()
    .subscribe(res => {
      res.forEach(el => {
        if (photo.indexOf(el.photo) > -1) {
          this.uploadImgNestService.deletePhoto(el._id, el.photo).subscribe();
      }
      });
    });
  }

  async addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    };

    await this.camera.getPicture(options).then(img => {
      const blob = this.getBlob(img, 'image/jpeg');
      console.log(blob);
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe(res => {
        const path = 'http://10.10.1.133:3000/uploads/' + res.result.photo;
        this.photos.unshift(path);
        this.note.photos.push(res.result);
      });
    });
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
    };
    await this.camera.getPicture(options).then((img) => {
      const blob = this.getBlob(img, 'image/jpeg');
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe((res) => {
        const path = 'http://10.10.1.133:3000/uploads/' + res.result.photo;
        this.photos.unshift(path);
        this.note.photos.push(res.result);
      });
    });
  }

  private getBlob(b64Data: string, contentType: string, sliceSize: number= 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
}
