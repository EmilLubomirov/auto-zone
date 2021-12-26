import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { getCookie } from './cookie';
import { MyToken } from './my-token';

const authCookieName = "x-auth-token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = getCookie(authCookieName);

    if (!token){
        return false;
    }

    return !this.jwtHelper.isTokenExpired(token);
  }

  public isAdmin(): boolean {
    const token = getCookie(authCookieName);
    
    if (!token){
        return false;
    }

    return this.isAuthenticated() && decode<MyToken>(token).isAdmin;
  }
}
