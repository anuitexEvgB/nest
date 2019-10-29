import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GoogleFB } from 'src/app/models/googleFB.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  providerFb: firebase.auth.FacebookAuthProvider;

  user: Observable<firebase.User>;
  isLoggedIn: boolean;
  userData: GoogleFB;

  constructor(
    private authService: AuthService,
    private router: Router,
    private googlePlus: GooglePlus,
    private afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    private fb: Facebook,
    private storage: Storage,
    ) {
      // this.providerFb = new firebase.auth.FacebookAuthProvider();
      fb.getLoginStatus()
  .then(res => {
    console.log(res.status);
    if (res.status === 'connect') {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  })
  .catch(e => console.log(e));
    }

  ngOnInit() {
    this.user = this.afAuth.authState;
    console.log(this.user);
  }

  login(form) {
    this.authService.login(form.value).subscribe(res => {
      if (res.status === 200) {
        this.router.navigateByUrl('home');
      } else if (res.status === 404) {
        alert('Wrong email or password');
      }
    });
  }

  async nativeGoogleLogin(): Promise<any> {
    try {
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      this.presentLoading(loading);
      const gplus = await this.googlePlus.login({
        'webClientId': '160010738906-m7r2ltrlf0cugjb033f76n39hhs2aj9r.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });
      const a = await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplus.idToken));
      console.log(a);
      loading.dismiss();
      return a;
    } catch (err) {
      console.log(err);
      this.loadingCtrl.dismiss();
    }
  }

  async test() {
    this.authService.getUsers().subscribe(a => {
      console.log(a);
      const result = a.filter(y => y.customId === '2598124270465072');
      console.log(result);

    });
  }

  async fbLogin() {

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
      });
    this.presentLoading(loading);
    const permissions = ['public_profile', 'email'];
    await this.fb.login(permissions)
    .then(res => {
      console.log(res);
      let userId = res.authResponse.userID;
      this.fb.api('/me?fields=name,email', permissions)
      .then(user => {
        console.log(user);
        this.userData = {
          customId: user.id,
          name: user.name,
          email: user.email
        };
        debugger;
        const check = this.authService.getUsers().subscribe(users => {
          console.log('work');
          const result = users.filter(resp => resp.customId === this.userData.customId);
          console.log(result);
          if (result.length > 0) {
            console.log('tyt ROUT ');
          } else {
            this.authService.customReg(this.userData).subscribe();
          }
          // users.forEach(resp => {
          //   console.log(this.userData);
          //   if (this.userData.customId === resp.customId) {
          //     console.log('route home');
          //   } else if (this.userData.customId !== resp.customId) {
          //     console.log('post');
          //     this.authService.customReg(this.userData).subscribe();
          //   }
          // });
        });
        console.log(check);
        loading.dismiss();
        // user.picture = 'https://graph.facebook.com/' + userId + '/picture?type=large';
        // this.storage.set('facebook_user', {
        //   name: user.name,
        //   email: user.email,
        //   picture: user.picture
        // })
        // .then(() => {
        //   this.router.navigate(['home']);
        //   loading.dismiss();
        // }).catch(err => {
        //   console.log(err);
        //   loading.dismiss();
        // });
      });
    }).catch(err => {
      console.log(err);
      loading.dismiss();
    });











  //   this.fb.login(['public_profile', 'email'])
  //     .then(res => {
  //       console.log(res);
  //       if (res.status === 'connected') {
  //         this.isLoggedIn = true;
  //         this.getUserDetail(res.authResponse.userID);
  //       } else {
  //         this.isLoggedIn = false;
  //       }
  //     })
  //     .catch(e => console.log('Error logging into Facebook', e));
  // }
  // presentLoading(loading: HTMLIonLoadingElement) {
  //   throw new Error("Method not implemented.");
  // }

  // getUserDetail(userid: any) {
  //   this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
  //     .then(res => {
  //       console.log(res);
  //       this.user = res;
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  // logout() {
  //   this.fb.logout()
  //     .then( res => this.isLoggedIn = false)
  //     .catch(e => console.log('Error logout from Facebook', e));
  // }

}
  async presentLoading(loading: HTMLIonLoadingElement) {
    return await loading.present();
  }
}

