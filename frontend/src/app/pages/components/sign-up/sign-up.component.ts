import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
    signUpForm: any;
    hidePass: boolean = true;
    hideRePass: boolean = true;
    snackbarDuration: number = 3000;

    constructor(private fb: FormBuilder, private router: Router,
        private userService: UserService, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.signUpForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            rePassword: ['',  [Validators.required]]
        }, { validator: this.checkPasswords });
    }

    handleSubmit(): void {
        if (!this.signUpForm.valid) {
            this.showFormErrors();
            return;
        }

        const {
            username,
            password,
            rePassword
        } = this.signUpForm.value;

        this.userService.signUp(username, password, rePassword).subscribe(response => {
            if (response._id) {
                this.redirectToLogin();
            }
        }, error => {
            const { message } = error.error.error;
            this.openSnackBar(message, 'error', 'Cancel')
        });
    }

    get username() { return this.signUpForm.get('username'); }

    get password() { return this.signUpForm.get('password'); }

    get rePassword() { return this.signUpForm.get('rePassword'); }

    private redirectToLogin() {
        this.router.navigate(['/sign-in']);
    }

    private checkPasswords(group: FormGroup) {
        let pass = group.controls.password.value;
        let rePassword = group.controls.rePassword.value;

        return (!rePassword || pass === rePassword) ? null : { notSame: true }
    }

    private openSnackBar(msg: string, type:string, action: string) {
        const styleClass = ['snackbar'];

        if (type === 'error'){
            styleClass.push('error-snackbar');
        }
        else if (type === 'success'){
            styleClass.push('success-snackbar');
        }

        this.snackBar.open(msg, action, {
            duration: this.snackbarDuration,
            panelClass: styleClass
        });
    }

    private showFormErrors(): void {
        Object.keys(this.signUpForm.controls).forEach(field => {
            const control = this.signUpForm.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }
}
