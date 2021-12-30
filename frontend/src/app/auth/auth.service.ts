import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../pages/models/user';
import { getCookie } from './cookie';
import { MyToken } from './my-token';

const authCookieName = "x-auth-token";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public jwtHelper: JwtHelperService, private http: HttpClient) { }

    public isAuthenticated(): boolean {
        const token = getCookie(authCookieName);

        if (!token) {
            return false;
        }

        return !this.jwtHelper.isTokenExpired(token);
    }

    public isAdmin(): boolean {
        const token = getCookie(authCookieName);

        if (!token) {
            return false;
        }

        return this.isAuthenticated() && decode<MyToken>(token).isAdmin;
    }

    getUserId(): string {
        const token = getCookie(authCookieName);

        if (!token || !this.isAuthenticated()) {
            return '';
        }

        return decode<MyToken>(token).id;
    }

    getLoggedInUser(): Observable<User> {

        const authToken = getCookie(authCookieName) || "";

        if (!authToken) {
            return of();
        }

        const headers = { 'Content-Type': 'application/json', "authorization": authToken };
        return this.http.post<any>('http://localhost:9999/api/user/verifyLogin', { headers })
            .pipe(
                catchError(this.handleError<any>('getLoggedInUser', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
