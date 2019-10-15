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
    console.log(files);
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
          debugger;
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
      debugger;
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe(lol => console.log(lol));
      debugger;
      // this.filePath.resolveNativePath(img).then(filp => {
      //   console.log(filp);
      //   const webTr = this.webView.convertFileSrc(filp);
      //   this.uploadImgNestService.uploadFile(webTr, this.note.id).subscribe(a => {console.log(a)});
      //   console.log(webTr);
      // });
      // const files: File[] = [];
      // console.log(img);
      // let blob = this.getBlob(img, '.jpg');
      // console.log(blob);
      // debugger
      // const file = new File([blob], 'image.jpg');
    });

    
    // await this.camera.getPicture(options).then((img) => {
    //   window.resolveLocalFileSystemURI(img, (file => {
    //     this.uploadImgNestService.uploadFile(file, this.note.id).subscribe();
    //   }));
    // });
    // console.log(capturedTempImage);
    // const savedImageFile = await this.savePicture(capturedTempImage);
    // console.log(savedImageFile);
    // console.log(this.webView.convertFileSrc(savedImageFile));
    // this.note.image.unshift({
    //   filepath: savedImageFile,
    //   webviewPath: this.webView.convertFileSrc(savedImageFile)
    // });
  }
  // async savePicture(cameraImage) {
  //   const tempFilename = cameraImage.substr(cameraImage.lastIndexOf('/') + 1);
  //   const tempBaseFilesystemPath = cameraImage.substr(0, cameraImage.lastIndexOf('/') + 1);
  //   const newBaseFilesystemPath = this.file.dataDirectory;
  //   await this.file.copyFile(tempBaseFilesystemPath, tempFilename, newBaseFilesystemPath, tempFilename);
  //   console.log(tempFilename);
  //   console.log(tempBaseFilesystemPath);
  //   console.log(newBaseFilesystemPath);
  //   return newBaseFilesystemPath + tempFilename;
  // }

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
          console.log(webTransfor);
        })
        .catch(err => console.log(err, 'upload library camera'));
    });
  }

  private getBlob(b64Data:string, contentType:string, sliceSize:number= 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
}
