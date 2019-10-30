import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GoogleFB } from 'src/app/models/googleFB.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoggedIn: boolean;
  userData: GoogleFB;
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private googlePlus: GooglePlus,
    public loadingCtrl: LoadingController,
    private fb: Facebook,
    ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required])
    });
  }

  login() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(res => {
        if (res.status === 200) {
          this.form.reset();
          this.router.navigate(['home']);
        } else if (res.status === 404) {
          alert('Wrong email or password');
        }
      });
    }
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
      const userData = {
        name: gplus.displayName,
        email: gplus.email,
      };
      this.authService.customReg(userData).subscribe(_ => {
        this.router.navigate(['home']);
      });
      loading.dismiss();
    } catch (err) {
      console.log(err);
      this.loadingCtrl.dismiss();
    }
  }


  async fbLogin() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
      });
    this.presentLoading(loading);
    const permissions = ['public_profile', 'email'];
    await this.fb.login(permissions)
    .then(_ => {
      this.fb.api('/me?fields=name,email', permissions)
      .then(user => {
        this.userData = {
          name: user.name,
          email: user.email
        };
        this.authService.customReg(this.userData).subscribe(_ => {
          this.router.navigate(['home']);
        });
        loading.dismiss();
      });
    }).catch(err => {
      console.log(err);
      loading.dismiss();
    });
}
  async presentLoading(loading: HTMLIonLoadingElement) {
    return await loading.present();
  }
}

