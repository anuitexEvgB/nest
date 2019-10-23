import { AuthService } from './../services/auth.service';
import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import {
  Router
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class InterceptorProvider implements HttpInterceptor {

  // token: '';

  constructor(
    private  storage: Storage,
    public http: HttpClient,
    private router: Router,
    public toastController: ToastController,
    private authService: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = localStorage.getItem('ACCESS_TOKEN');
    // const token = this.storage.get('ACCESS_TOKEN').then(val => {
    //   debugger;
    //   const aye = JSON.parse(val);
    //   // console.log(aye);
    //   // this.token = aye;
    //   // console.log(this.token);
    //   return request = request.clone({
    //     setHeaders: {
    //       'Authorization': 'Bearer ' + `${aye}`,
    //     }
    //   });

    // });
    // request = request.clone({
    //   setHeaders: {
    //     'Authorization': 'Bearer ' + `${this.token}`,
    //   }
    // });
    // this.token = '';

    return from(this.authService.getToken()).pipe(mergeMap((token) => {
      console.log(token);
      const changedReq = request.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });

      return next.handle(changedReq);
  }));
}
    // if (!request.headers.has('Content-Type')) {
    //   request = request.clone({
    //     setHeaders: {
    //       'content-type': 'application/json',
    //     }
    //   });
    // }

    // request = request.clone({
    //   headers: request.headers.set('Accept', 'application/json')
    // });

    // return next.handle(request);
  }

