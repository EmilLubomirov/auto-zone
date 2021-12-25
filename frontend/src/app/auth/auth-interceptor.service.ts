import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from "rxjs/operators";
import { throwError } from 'rxjs';
import { getCookie } from './cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private router: Router){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token: string = getCookie("x-auth-token");
        req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });// This clones HttpRequest and Authorization header with Bearer token added
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
     
        return next.handle(req)
            .pipe(
               catchError((error: HttpErrorResponse) => {
                    // Catching Error Stage
                    if (error && error.status === 401) {
                        console.log("ERROR 401 UNAUTHORIZED") // in case of an error response the error message is displayed
                        this.router.navigate(['sign-in']);
                    }
                    const err = error.error || error.statusText;
                    return throwError(error); // any further errors are returned to frontend                    
               })
            );
      }  
}
