import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadImgNestService } from './../../services/upload-img-nest.service';


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
    private filePath: FilePath,
    private webView: WebView,
    private uploadImgNestService: UploadImgNestService,
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
  uploadFile(files: FileList) {
    console.log(files);
    this.uploadImgNestService.uploadFile(files).subscribe();
  }

  async addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
    };
    await this.camera.getPicture(options).then((imageData) => {
      this.filePath.resolveNativePath(imageData)
      .then((filePath) => {
        const webTransfor = this.webView.convertFileSrc(filePath);
        this.note.image.push(webTransfor);
      })
      .catch(err => console.log(err, 'upload library camera'));
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
        const webTransfor = this.webView.convertFileSrc(filePath);
        this.note.image.push(webTransfor);
      })
      .catch(err => console.log(err, 'upload library camera'));
    });
  }

  navigateToGeo() {
  }
}
