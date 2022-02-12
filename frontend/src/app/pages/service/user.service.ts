import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private signUpUrl = 'http://localhost:9999/api/user/register';
    private signInUrl = 'http://localhost:9999/api/user/login';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    signUp(username: string, password: string, rePassword: string): Observable<any> {
        const body = {
            username,
            password,
            rePassword
        }

        return this.http.post<any>(this.signUpUrl, body, { observe: "response" })
            .pipe(
                catchError(this.handleError<any>('signUp', []))
            );
    }

    signIn(username: string, password: string, isGoogle?: boolean): Observable<any> {
        const body = !isGoogle ? {
            username,
            password
        } : {
            username,
            password,
            isGoogle: true
        }

        return this.http.post<any>(this.signInUrl, body, { observe: 'response' })
            .pipe(
                catchError(this.handleError<any>('signIn', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return throwError(error);
        };
    }
}
