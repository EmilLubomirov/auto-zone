import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    signInForm: any;
    hidePass: boolean = true;
    snackbarDuration: number = 3000;
    authCookieName: string = "x-auth-token";

  constructor(private fb: FormBuilder,
            private userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  handleSubmit(): void {
    const {
        username,
        password
    } = this.signInForm.value;

    this.userService.signIn(username, password).subscribe(response => {
        if (response.status === 200) {
            const authToken = response.headers.get("Authorization");
            document.cookie = `${this.authCookieName}=${authToken}`;
            this.redirectToStore();
        }
        else if (response.status === 401){
            this.openSnackBar(response.error, 'Cancel')
        }
    }, err => console.log('lele'));
}

  get username() { return this.signInForm.get('username'); }

  get password() { return this.signInForm.get('password'); }

  private showFormErrors(): void {
    Object.keys(this.signInForm.controls).forEach(field => {
        const control = this.signInForm.get(field);
        control.markAsTouched({ onlySelf: true });
    });
}

private openSnackBar(msg: string, action: string) {
    console.log(msg)
    this.snackBar.open(msg, action, {
        duration: this.snackbarDuration
    });
}

private redirectToStore(){
    this.router.navigate(['/store']);
}

}
