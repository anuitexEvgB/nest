import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private googlePlus: GooglePlus,
    ) { }

  ngOnInit() {
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
      const gplus = await this.googlePlus.login({
        'webClientId': '160010738906-m7r2ltrlf0cugjb033f76n39hhs2aj9r.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
      debugger;

      return await this.authService.loginGoogle(gplus);
    } catch(err) {
      console.log(err);
    }
  }

}
