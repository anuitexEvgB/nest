import { Component, OnInit } from '@angular/core';
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
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {

  map: GoogleMap;
  address: string;

  locationCoords: any;
  timetest: any;

  constructor(
    private toastCtrl: ToastController,
    private platform: Platform,

  ) {}

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });
    this.goToMyLocation();
  }

  goToMyLocation(){
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null , 2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

      //add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'AAAAAAAAAAAAAAAA',
        snippet: 'YOUR THERE',
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
            console.log("Click MAP",data);
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




















  // checkGPSPermission() {
  //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
  //     result => {
  //       if (result.hasPermission) {

  //         this.askToTurnOnGPS();
  //       } else {

  //         this.requestGPSPermission();
  //       }
  //     },
  //     err => {
  //       console.log('lol', err);
  //       alert(err);
  //     }
  //   );
  // }

  // requestGPSPermission() {
  //   this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  //     if (canRequest) {
  //       console.log('4');
  //     } else {
  //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
  //         .then(
  //           () => {
  //             this.askToTurnOnGPS();
  //           },
  //           error => {
  //             alert('requestPermission Error requesting location permissions ' + error)
  //           }
  //         );
  //     }
  //   });
  // }

  // askToTurnOnGPS() {
  //   this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
  //     () => {
  //       this.getLocationCoordinates()
  //     },
  //     error => alert('Error requesting location permissions ' + JSON.stringify(error))
  //   );
  // }

  // getLocationCoordinates() {
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     this.locationCoords.latitude = resp.coords.latitude;
  //     this.locationCoords.longitude = resp.coords.longitude;
  //     this.locationCoords.accuracy = resp.coords.accuracy;
  //     this.locationCoords.timestamp = resp.timestamp;
  //   }).catch((error) => {
  //     alert('Error getting location' + error);
  //   });
  // }
}
