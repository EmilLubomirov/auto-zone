import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceTag } from '../../models/service-tag';
import { ServiceService } from '../../service/service.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
    serviceAppointmentForm: any;
    addServiceForm: any;
    tags!: ServiceTag[];
    minDate = new Date();
    isAdmin!: boolean;
    isAddServiceContent = false;
    snackbarDuration: number = 3000;

    constructor(private fb: FormBuilder,
        private router: Router,
        private serviceService: ServiceService,
        private authService: AuthService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.serviceAppointmentForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            surname: ['', [Validators.required, Validators.minLength(2)]],
            phone: ['', [Validators.required, Validators.minLength(3)]],
            carLicensePlate: ['', [Validators.required, Validators.minLength(3)]],
            date: [null, Validators.required],
            hour: [null, Validators.required],
            tag: [null, Validators.required]
        });

        this.addServiceForm = this.fb.group({
            serviceName: ['', [Validators.required, Validators.minLength(2)]]
        });

        this.getServiceTags();
        this.isAdmin = this.authService.isAdmin();
    }

    getServiceTags(): void {
        this.serviceService.getServiceTags().subscribe(response => {
            this.tags = response;
        });
    }

    handleAddServiceClick(): void{
        this.isAddServiceContent = true;
    }

    handleAddServiceSubmit(): void {
        if (!this.addServiceForm.valid) {
            this.showFormErrors(this.addServiceForm);
            return;
        }

        const serviceName = this.addServiceForm.value.serviceName;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '250px',
                data: serviceName,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result){
                this.saveService(serviceName);
            }
          });
    }

    handleBackClick(): void{
        this.isAddServiceContent = false;
    }

    handleSubmit(): void {
        if (!this.serviceAppointmentForm.valid) {
            this.showFormErrors(this.serviceAppointmentForm);
            return;
        }

        const {
            firstName,
            surname,
            phone,
            carLicensePlate,
            tag
        } = this.serviceAppointmentForm.value;

        const date: Date = this.serviceAppointmentForm.value.date;
        const hour: string = this.serviceAppointmentForm.value.hour;

        const h = parseInt(hour.split(':')[0]);
        const m = parseInt(hour.split(':')[1]);

        date.setHours(h, m, 0);

        const userId = this.authService.getUserId();

        this.serviceService.makeAppointment(userId, firstName, surname, phone, 
            carLicensePlate, date, tag.name).subscribe(response => {
            if (response.status === 200){
                this.openSnackBar('Appointment is successful', 'success', 'Cancel');
                this.redirectToStore();
            }
        }, error => {
            const { message } = error.error;
            this.openSnackBar(message, 'error', 'Cancel');
        });
    }

    get firstName() { return this.serviceAppointmentForm.get('firstName'); }

    get surname() { return this.serviceAppointmentForm.get('surname'); }

    get phone() { return this.serviceAppointmentForm.get('phone'); }

    get carLicensePlate() { return this.serviceAppointmentForm.get('carLicensePlate'); }

    get date() { return this.serviceAppointmentForm.get('date'); }

    get hour() { return this.serviceAppointmentForm.get('hour'); }

    get tag() { return this.serviceAppointmentForm.get('tag'); }

    get serviceName() { return this.addServiceForm.get('serviceName'); }

    private saveService(serviceName: string): void{
        this.serviceService.addService(this.authService.getUserId(), serviceName).subscribe(response => {
            if (response.status === 200){
                this.openSnackBar('Service is added successfully', 'success', 'Cancel');
                this.redirectToStore();
            }
        }, error => {
            const message = error.error;
            this.openSnackBar(message, 'error', 'Cancel');
        });
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

    private showFormErrors(form: any): void {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }

    private redirectToStore() {
        this.router.navigate(['/store']);
    }

}
