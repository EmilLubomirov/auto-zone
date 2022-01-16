import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { StateService } from 'src/app/pages/service/state.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    userId!: string;
    isLoggedIn!: boolean;
    isAdmin!: boolean;

    constructor(private authService: AuthService, private stateService: StateService,
                private router: Router) { }

    ngOnInit(): void {
        this.stateService.currentUserState$
            .subscribe(() => {
                this.updateUserState();
            });
    }

    handleLogout(): void {
        document.cookie = "x-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        sessionStorage.removeItem('scrollY');
        sessionStorage.removeItem('tags');
        this.router.navigate(['sign-in']);
        this.updateUserState();
    }

    private updateUserState(): void {
        this.userId = this.authService.getUserId();
        this.isLoggedIn = this.authService.isAuthenticated();
        this.isAdmin = this.authService.isAdmin();
    }
}
