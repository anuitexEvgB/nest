// Vendors
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Storage } from '@ionic/storage';
import {ToastController, Platform } from '@ionic/angular';
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
import { Note } from 'src/app/models';

// Service
import { UploadImgNestService, NestMongoService } from 'src/app/services';

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
  public photos = [];
  private map: GoogleMap;
  private editMode: boolean = !!this.route.snapshot.queryParams.edit;
  private api = enviroment.environment.api;

  constructor(
    private storage: Storage,
    private route: ActivatedRoute,
    private noteService: NestMongoService,
    public modalController: ModalController,
    public camera: Camera,
    public uploadImgNestService: UploadImgNestService,
    public photoViewer: PhotoViewer,
    public toastCtrl: ToastController,
    public platform: Platform,
    public router: Router,
  ) {
    this.uploadPhoto();
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
  }

  public async close() {
    this.router.navigate(['home']);
    const undef = this.note.photos;
    await undef.forEach((del: { noteId: string; _id: string; photo: any; }) => {
      if (del.noteId === 'undefined') {
        this.uploadImgNestService.deletePhoto(del._id, del.photo).subscribe();
      }
    });
  }

  public toggleChange(event: { detail: { checked: false; }; }) {
    this.note.completed = event.detail.checked;
    this.checked = event.detail.checked;
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
      });
      const nextMarker = this.map.addMarkerSync({
        title: 'Ты тут',
        icon: 'blue',
        animation: GoogleMapsAnimation.BOUNCE,
        position: this.note.latLng,
      });
      nextMarker.showInfoWindow();
    }
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((params: any[]) => {
      this.map.clear();

      const geo: LatLng = params[0];
      console.log(geo);
      this.note.latLng.lat = geo.lat;
      this.note.latLng.lng = geo.lng;
      this.map.addMarkerSync({
        position: this.note.latLng,
        target: this.note.latLng,
        title: 'Ты тут',
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
        title: 'Here',
        position: this.note.latLng,
        animation: GoogleMapsAnimation.BOUNCE,
      });
      marker.showInfoWindow();
    });
  }

  public showPhoto(img: string) {
    this.photoViewer.show(img, 'Photo');
  }

  uploadPhoto() {
    // I ETO
    this.uploadImgNestService.getPhoto()
      .subscribe(res => {
        res.forEach(element => {
          if (element.noteId === this.note.id) {
            const path = `${this.api}/uploads/${element.photo}`;
            this.photos.unshift(path);
          }
        });
      });
  }

  public deleteFile(photo: string) {
    //PEREDELAT' const a = this.photos.splice(index, 1);
    // i otpravit'
    const index = this.photos.indexOf(photo);
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
      console.log(blob);
      this.uploadImgNestService.uploadFile(blob, this.note.id).subscribe(res => {
        const path = 'http://10.10.1.133:3000/uploads/' + res.result.photo;
        this.photos.unshift(path);
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
        this.photos.unshift(path);
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
    if (this.editMode) {
      this.noteService.updateNote(this.note).subscribe((res) => {

      });
    } else {
      this.noteService.postNotes(this.note).subscribe(res => {
        this.noteService.noteSubject.next(res);
      });
    }
    this.router.navigate(['home']);
  }
}
