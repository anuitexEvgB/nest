import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file/ngx';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {

  @Input() note: Note;
  sliderConfig: {};
  checked: false;

  constructor(
    public modalController: ModalController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private geolocation: Geolocation,
    private webView: WebView
    ) {
    this.sliderConfig = {
      width: 200,
      height: 200,
      cssMode: true,
      nested: true,
      roundLengths: true,
      centeredSlides: true,
      spaceBetween: 20,
      slidesPerView: 1.5,
    };
   }

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
    };
    await this.camera.getPicture(options).then((imageData) => {
      const filename = imageData.substring(imageData.lastIndexOf('/') + 1);
      const path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      this.file.readAsDataURL(path, filename).then((base64data) => {
        this.note.image.push(base64data);
      });
    });
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    };
    await this.camera.getPicture(options).then((imageData) => {
      this.filePath.resolveNativePath(imageData)
      .then((filePath) => {
        const a = this.webView.convertFileSrc(filePath);
        console.log(a);
        this.note.image.push(a);
      })
      .catch(err => console.log(err, 'upload library camera'));
    });
  }
}
