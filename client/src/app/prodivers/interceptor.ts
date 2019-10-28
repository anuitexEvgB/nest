import { AuthService } from './../services/auth.service';
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
@Injectable({
  providedIn: 'root'
})
export class InterceptorProvider implements HttpInterceptor {

  // token: '';

  constructor(
    public http: HttpClient,
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

