// Vendors
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Storage } from '@ionic/storage';
import { Platform, ActionSheetController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions,
  LatLng
} from '@ionic-native/google-maps';

// Models
import { Note, PhotoEn } from 'src/app/models';

// Service
import { UploadImgNestService, NestMongoService, DatabaseService, NetworkService } from 'src/app/services';

// Enviroment
import * as enviroment from 'src/environments/environment';

@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {
  public note: Note;
  public checked = false;
  public photos: PhotoEn[] = [];
  private map: GoogleMap;
  private editMode: boolean = !!this.route.snapshot.queryParams.edit;
  private api = enviroment.environment.api;

  constructor(
    public camera: Camera,
    public uploadImgNestService: UploadImgNestService,
    public photoViewer: PhotoViewer,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    public router: Router,
    private storage: Storage,
    private route: ActivatedRoute,
    private noteService: NestMongoService,
    private databaseService: DatabaseService,
    private networkService: NetworkService,
  ) {
  }

  ngOnInit() {
    if (this.editMode) {
      this.note = this.noteService.selectedNote;
    } else {
      this.note = {
        title: '',
        text: '',
        photos: [],
        completed: false,
        latLng: {
          lat: 0,
          lng: 0,
        },
        userId: '',
      };
    }

    this.storage.get('USER_ID').then(id => {
      this.note.userId = id;
    });
    this.platform.ready();
    this.loadMap();
    this.uploadPhoto();
  }

  public blockPhoto() {
    const a = this.networkService.getCurrentNetworkStatus();
    if (a === 1) {
      return true;
    }
    if (a === 0) {
      return false;
    }
  }

  public async close() {
    this.router.navigate(['home']);
    const undef = this.note.photos;
    await undef.forEach((del: { noteId: string; id: string; photo: any; }) => {
      if (del.noteId === 'undefined') {
        this.uploadImgNestService.deletePhoto(del.id, del.photo).subscribe();
      }
    });
  }

  public toggleChange(event: { detail: { checked: false; }; }) {
    this.note.completed = event.detail.checked;
    this.checked = event.detail.checked;
  }

  public showPhoto(img: string) {
    this.photoViewer.show(img, 'Photo');
  }

  public uploadPhoto() {
    this.uploadImgNestService.getPhoto(this.note.id)
      .subscribe(res => {
        res.forEach(element => {
          if (element.noteId === this.note.id) {
            const path = `${this.api}/uploads/${element.photo}`;
            this.photos.unshift({
              id: element._id,
              photo: path,
              namePhoto: element.photo
            });
          }
        });
      });
  }

  public deleteFile(photo: PhotoEn) {
    const index = this.photos.indexOf(photo);
    if (index > -1) {
      const del = this.photos.splice(index, 1);
      this.uploadImgNestService.deletePhoto(del[0].id, del[0].namePhoto).subscribe();
    }
  }

  public async presentPhotoSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'PHOTO',
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.addPhoto();
        }
      },
      {
        text: 'Library',
        role: 'openLibrary',
        icon: 'image',
        handler: () => {
          this.openLibrary();
        }
      }]
    });
    await actionSheet.present();
  }

  public async addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    };

    this.camera.getPicture(options).then(img => {
      const blob = this.getBlob(img, 'image/jpeg');
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe(res => {
        const path = `${this.api}/uploads/${res.result.photo}`;
        this.photos.unshift({
          id: res.result.id,
          photo: path,
          namePhoto: res.result.photo,
        });
        this.note.photos.push(res.result);
      });
    });
  }

  public async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
    };
    this.camera.getPicture(options).then((img) => {
      const blob = this.getBlob(img, 'image/jpeg');
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe((res) => {
        const path = 'http://10.10.1.133:3000/uploads/' + res.result.photo;
        this.photos.unshift({
          id: res.result.id,
          photo: path,
          namePhoto: res.result.photo
        });
        this.note.photos.push(res.result);
      });
    });
  }

  private getBlob(b64Data: string, contentType: string, sliceSize: number = 512) {
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
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public onSubmit() {
    let stat = this.networkService.getCurrentNetworkStatus();
    if (this.editMode) {
      this.noteService.updateNote(this.note).subscribe();
      if (stat === 0) {
        console.log(this.note);
        this.databaseService.updateDataOnl(Object.assign({}, this.note));
      }
      if (stat === 1) {
        this.databaseService.updateDataOff(Object.assign({}, this.note));
      }
    } else {
      this.noteService.postNotes(this.note).subscribe(res => {
        this.noteService.noteSubject.next(res);
        this.databaseService.insertRow(Object.assign({}, res));
      });
      if (stat === 1) {
        this.databaseService.insertRow(Object.assign({}, this.note));
        this.noteService.noteSubject.next(this.note);
      }
    }
    this.router.navigate(['home']);
  }

  private loadMap() {
    const options: GoogleMapOptions = {
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: true,
        mapToolbar: true,
        zoom: true,
      }
    };
    this.map = GoogleMaps.create('map_canvas', options);
    if (this.note.latLng.lat === 0 && this.note.latLng.lng === 0) {
      this.goToMyLocation();
    } else {
      this.map.animateCamera({
        target: this.note.latLng,
        zoom: 17,
        duration: 1000,
      });
      const nextMarker = this.map.addMarkerSync({
        title: 'Your marker',
        icon: 'blue',
        animation: GoogleMapsAnimation.BOUNCE,
        position: this.note.latLng,
      });
      nextMarker.showInfoWindow();
    }
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((params: any[]) => {
      this.map.clear();

      const geo: LatLng = params[0];
      this.note.latLng.lat = geo.lat;
      this.note.latLng.lng = geo.lng;
      this.map.addMarkerSync({
        position: this.note.latLng,
        target: this.note.latLng,
        title: 'Your marker',
        animation: GoogleMapsAnimation.BOUNCE,
      });
    });
  }

  private async goToMyLocation() {
    await this.map.getMyLocation().then((location: MyLocation) => {
      this.note.latLng = location.latLng;
      this.map.animateCamera({
        target: this.note.latLng,
        zoom: 17
      });
      const marker = this.map.addMarkerSync({
        title: 'Your marker',
        position: this.note.latLng,
        animation: GoogleMapsAnimation.BOUNCE,
      });
      marker.showInfoWindow();
    });
  }
}
