import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { RegisterPage } from 'src/app/auth/register/register.page';
import { LoginPage } from 'src/app/auth/login/login.page';

const routes: Routes = [
    { path: 'register', loadChildren: '/src/app/auth/register/register.module#RegisterPageModule' },
    { path: 'login', loadChildren: '/src/app/auth/login/login.module#LoginPageModule' },
  ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [RegisterPage, LoginPage],
  declarations: [RegisterPage, LoginPage],
})
export class AuthModule {}
