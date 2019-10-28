import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)},
  { path: 'upser-note', loadChildren: './pages/upser-note/upser-note.module#UpserNotePageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'geolocation', loadChildren: './pages/geolocation/geolocation.module#GeolocationPageModule' },
  // {
  //   path: 'upsert-note/:id',
  //   resolve: {
  //     special: ResolverService
  //   },
  //   loadChildren: './pages/upser-note/upser-note.module#UpserNotePageModule',
  //  },
  //  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  //  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
