import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { getCookie } from './cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = getCookie("x-auth-token")
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
