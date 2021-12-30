import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../service/order.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
    orderForm: any;
    totalPrice!: string;
    userId!: string;
    snackbarDuration: number = 3000;

    constructor(private fb: FormBuilder, 
                private route: ActivatedRoute,
                private router: Router, 
                private orderService: OrderService,
                private snackbar: MatSnackBar) { }

    ngOnInit(): void {
        this.orderForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            surname: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.minLength(3)]],
            address: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.route.params.subscribe(params => {
            this.userId = params['userId'];
        });

        this.totalPrice = window.history.state ? window.history.state.totalPrice : '0.00'; 
    }

    handleSubmit(): void {
        if (!this.orderForm.valid) {
            this.showFormErrors();
            return;
        }

        const {
            firstName,
            surname,
            email,
            phone,
            address
        } = this.orderForm.value;

        const { products, productsPrice, deliveryName } = window.history.state;

        this.orderService.makeOrder(this.userId, products, firstName, surname, email, phone, address, 
            productsPrice, this.totalPrice, deliveryName).subscribe(response => {
                if (response.status === 200){
                    this.redirectToStore();
                    this.openSnackBar('Order is successful', 'success', 'Cancel');
                }
                else{
                    this.openSnackBar(response.error, 'error', 'Cancel');
                }
            });

    }

    get firstName() { return this.orderForm.get('firstName'); }

    get surname() { return this.orderForm.get('surname'); }

    get email() { return this.orderForm.get('email'); }

    get phone() { return this.orderForm.get('phone'); }

    get address() { return this.orderForm.get('address'); }

    private showFormErrors(): void {
        Object.keys(this.orderForm.controls).forEach(field => {
            const control = this.orderForm.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }

    private openSnackBar(msg: string, type: string, action: string) {
        this.snackbar.open(msg, action, {
            duration: this.snackbarDuration,
            panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar']
        });
    }

    private redirectToStore() {
        this.router.navigate(['/store']);
    }

}
