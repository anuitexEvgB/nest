import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.minLength(4), Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required])
    });
  }

  register() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe(res => {
        if (res === null) {
          alert('Этот email уже используется');
        } else {
          this.form.reset();
          this.router.navigate(['login']);
        }
      });
    }
  }

}
