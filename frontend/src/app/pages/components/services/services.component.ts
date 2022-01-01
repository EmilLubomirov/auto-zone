import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ServiceTag } from '../../models/service-tag';
import { ServiceService } from '../../service/service.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
    serviceAppointmentForm: any;
    tags!: ServiceTag[];
    minDate = new Date();

    constructor(private fb: FormBuilder,
        private serviceService: ServiceService,
        private authService: AuthService) { }

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

        this.getServiceTags();
    }

    getServiceTags(): void {
        this.serviceService.getServiceTags().subscribe(response => {
            this.tags = response;
        });
    }

    handleSubmit() {

        if (!this.serviceAppointmentForm.valid) {
            this.showFormErrors();
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
            console.log(response);    
        })
    }

    get firstName() { return this.serviceAppointmentForm.get('firstName'); }

    get surname() { return this.serviceAppointmentForm.get('surname'); }

    get phone() { return this.serviceAppointmentForm.get('phone'); }

    get carLicensePlate() { return this.serviceAppointmentForm.get('carLicensePlate'); }

    get date() { return this.serviceAppointmentForm.get('date'); }

    get hour() { return this.serviceAppointmentForm.get('hour'); }

    get tag() { return this.serviceAppointmentForm.get('tag'); }

    private showFormErrors(): void {
        Object.keys(this.serviceAppointmentForm.controls).forEach(field => {
            const control = this.serviceAppointmentForm.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }

}
