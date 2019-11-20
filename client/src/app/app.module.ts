import { FormsModule } from '@angular/forms';
import { UpserNotePage } from './pages/upser-note/upser-note.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
<<<<<<< Updated upstream
=======
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Backlight } from '@ionic-native/backlight/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Instagram } from '@ionic-native/instagram/ngx';
import { BaiduPush } from '@ionic-native/baidu-push/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';

// Component
import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

// Provider
import { InterceptorProvider } from 'src/app/prodivers/interceptor';
>>>>>>> Stashed changes

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NestMongoService } from './services/nest-mongo.service';

@NgModule({
  declarations: [AppComponent, UpserNotePage],
  entryComponents: [UpserNotePage],
  imports: [FormsModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    NestMongoService,
    StatusBar,
    SplashScreen,
<<<<<<< Updated upstream
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
=======
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    Camera,
    File,
    FilePath,
    WebView,
    Geolocation,
    LocationAccuracy,
    AndroidPermissions,
    PhotoViewer,
    GooglePlus,
    Facebook,
    Network,
    Dialogs,
    SQLite,
    Base64ToGallery,
    Vibration,
    Backlight,
    CallNumber,
    YoutubeVideoPlayer,
    Instagram,
    BaiduPush,
    TextToSpeech,
    Brightness,
>>>>>>> Stashed changes
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
