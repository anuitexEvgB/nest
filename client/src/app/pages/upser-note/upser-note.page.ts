import { File } from '@ionic-native/file/ngx';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {

  note: Note;
  sliderConfig: {};

  constructor(public modalController: ModalController, private camera: Camera, private file: File) {
    this.sliderConfig = {
      slidesPerView: 1.6,
      spaceBetween: 10,
      centeredSlides: true,
    };
   }

  checked: false;
  ngOnInit() {

    if (!this.note) {
      this.note = {
        title: '',
        text: '',
        image: [],
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

  async addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
    }
    this.camera.getPicture().then((imageData) => {
      const filename = imageData.substring(imageData.lastIndexOf('/') + 1);
      const path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      this.file.readAsDataURL(path, filename).then((base64data) => {
        this.note.image.push(base64data);
      });
    });
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      targetWidth: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      targetWidth: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
}
