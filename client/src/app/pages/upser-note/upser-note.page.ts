import { File } from '@ionic-native/file/ngx';
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
  checked: false;
  photos = [];


  constructor(
    public modalController: ModalController,
    private camera: Camera,
    private filePath: FilePath,
    private webView: WebView,
    private uploadImgNestService: UploadImgNestService,
    private file: File,
  ) {
    this.uploadPhoto();
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

  uploadPhoto() {
    this.uploadImgNestService.getPhoto()
      .subscribe(res => {
        res.forEach(element => {
          if (element.noteId === this.note.id) {
            const path = 'http://10.10.1.133:3000/uploads/' + element.photo;
            this.photos.push(path);
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

  toggleChange(event) {
    console.log(event.detail.checked, 'toglech');
    this.note.completed = event.detail.checked;
    this.checked = event.detail.checked;
  }
  uploadFile(files: FileList[]) {
    this.uploadImgNestService.uploadFile(files, this.note.id).subscribe(res => {
      const path = 'http://10.10.1.133:3000/uploads/' + res.photo;
      this.photos.push(path);
    });
  }

  deleteFile(photo) {
    const index = this.photos.indexOf(photo);
    if (index > -1) {
      this.photos.splice(index, 1);
    }
    this.uploadImgNestService.getPhoto()
    .subscribe(res => {
      res.forEach(el => {
        if (photo.indexOf(el.photo) > -1) {
          this.uploadImgNestService.deletePhoto(el.id, el.photo).subscribe();
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
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
    };
    const capturedTempImage = await this.camera.getPicture(options);
    console.log(capturedTempImage);
    const savedImageFile = await this.savePicture(capturedTempImage);
    console.log(savedImageFile);
    this.note.image.unshift({
      filepath: savedImageFile,
      webviewPath: this.webView.convertFileSrc(savedImageFile)
    });
  }
  async savePicture(cameraImage) {
    const tempFilename = cameraImage.substr(cameraImage.lastIndexOf('/') + 1);
    const tempBaseFilesystemPath = cameraImage.substr(0, cameraImage.lastIndexOf('/') + 1);
    const newBaseFilesystemPath = this.file.dataDirectory;
    await this.file.copyFile(tempBaseFilesystemPath, tempFilename, newBaseFilesystemPath, tempFilename);
    console.log(tempFilename);
    console.log(tempBaseFilesystemPath);
    console.log(newBaseFilesystemPath);
    return newBaseFilesystemPath + tempFilename;
  }

  // const tempImage = await this.camera.getPicture(options);
  // console.log(tempImage);
  // const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
  // console.log(tempFilename);
  // const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
  // console.log(tempBaseFilesystemPath);
  // const newBaseFilesystemPath = this.file.dataDirectory;
  // console.log(newBaseFilesystemPath);
  // await this.file.copyFile(tempBaseFilesystemPath, tempFilename,
  //   newBaseFilesystemPath, tempFilename);
  // const storedPhoto = newBaseFilesystemPath + tempFilename;
  // console.log(storedPhoto);
  // const displayImage = this.webView.convertFileSrc(storedPhoto);
  // console.log(displayImage);

  // await this.camera.getPicture(options).then((imageData) => {
  //   this.filePath.resolveNativePath(imageData)
  //   .then((filePath) => {
  //     console.log(filePath);
  //     const webTransfor = this.webView.convertFileSrc(filePath);
  //     console.log(webTransfor);
  //     this.note.image.push(webTransfor);
  //   })
  //   .catch(err => console.log(err, 'upload library camera'));
  // });

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
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
