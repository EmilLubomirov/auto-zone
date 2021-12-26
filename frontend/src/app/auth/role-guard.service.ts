import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
import { getCookie } from './cookie';
import { MyToken } from './my-token';

@Injectable({
    providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

    constructor(public auth: AuthService, public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const isAdmin = route.data.isAdmin;
        const token = getCookie('x-auth-token');
        const tokenPayload = decode<MyToken>(token);

        if (
            !this.auth.isAuthenticated() ||
            tokenPayload.isAdmin !== isAdmin
        ) {
            this.router.navigate(['sign-in']);
            return false;
        }
        return true;
    }
}
