import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/models/note.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadImgNestService } from './../../services/upload-img-nest.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {
  ToastController,
  Platform
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions,
  LatLng
} from '@ionic-native/google-maps';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from '@ionic-native/native-geocoder/ngx';


@Component({
  selector: 'app-upser-note',
  templateUrl: './upser-note.page.html',
  styleUrls: ['./upser-note.page.scss'],
})
export class UpserNotePage implements OnInit {
  @Input() note: Note;
  checked: false;
  photos = [];

  map: GoogleMap;
  address = {
    countryName: '',
    administrativeArea: '',
    subAdministrativeArea: '',
    thoroughfare: '',
    subLocality: '',
    subThoroughfare: '',
  };


  constructor(
    public modalController: ModalController,
    public camera: Camera,
    public uploadImgNestService: UploadImgNestService,
    public photoViewer: PhotoViewer,
    public toastCtrl: ToastController,
    public platform: Platform,
    public nativeGeocoder: NativeGeocoder,
    public router: Router
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
        latLng: {
          lat: 0,
          lng: 0,
        }
      };
    }
    this.platform.ready();
    this.loadMap();
    this.geoCoder(this.note.latLng.lat, this.note.latLng.lng);
  }

  // GEOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
  ionViewWillLeave() {
    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
  }

  loadMap() {

    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: this.note.latLng.lat,
          lng: this.note.latLng.lng
        },
        zoom: 18,
        tilt: 30,
        duration: 5000,
      }
});
    const mark: Marker = this.map.addMarkerSync({
      title: 'Ты тут',
      icon: 'blue',
      animation: GoogleMapsAnimation.BOUNCE,
      position: {
        lat: this.note.latLng.lat,
        lng: this.note.latLng.lng
      }
    });
    mark.on(GoogleMapsEvent.MAP_READY).subscribe();
    this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((params: any[]) => {
      this.map.clear();

      let geo: LatLng = params[0];
      console.log(geo);
      this.note.latLng.lat = geo.lat;
      this.note.latLng.lng = geo.lng;
      this.geoCoder(this.note.latLng.lat, this.note.latLng.lng);
      console.log(this.note.latLng.lat, this.note.latLng.lng);
      this.map.addMarkerSync({
        position: this.note.latLng,
        title: 'Ты тут',
        animation: GoogleMapsAnimation.BOUNCE,
      });
    });
    if (this.note.latLng.lat === 0 && this.note.latLng.lng === 0) {
      this.goToMyLocation();
    }
  }

  goToMyLocation() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.geoCoder(location.latLng.lat, location.latLng.lng);
      this.note.latLng.lat = location.latLng.lat;
      this.note.latLng.lng = location.latLng.lng;
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

      //add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'Ты тут',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      //show the infoWindow
      marker.showInfoWindow();

      //If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
        (data) => {
            console.log("Click MAP", data);
        }
      );
    })
    .catch(err => {
      //this.loading.dismiss();
      this.showToast(err.error_message);
    });
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  geoCoder(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 2,
    };
    this.nativeGeocoder.reverseGeocode(lat, long, options)
    .then((res: NativeGeocoderResult[]) => {
      console.log(res);
      this.address = {
        countryName: `${res[0].countryName}`,
        administrativeArea: `${res[0].administrativeArea}`,
        subAdministrativeArea: `${res[0].subAdministrativeArea}`,
        thoroughfare: `${res[0].thoroughfare}`,
        subLocality: `${res[0].subLocality}`,
        subThoroughfare: `${res[0].subThoroughfare}`,
      };
      console.log(this.address);
    })
    .catch(err => {
      console.log(err);
    });
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

  async close() {
    // this.ionViewWillLeave();
    await this.modalController.dismiss();
    const undef = this.note.photos;
    await undef.forEach((del: { noteId: string; _id: string; photo: any; }) => {
      console.log(del.noteId);
      if (del.noteId === 'undefined') {
        this.uploadImgNestService.deletePhoto(del._id, del.photo).subscribe();
      }
    });
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
