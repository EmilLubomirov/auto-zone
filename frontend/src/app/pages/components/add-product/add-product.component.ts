import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductTag } from '../../models/product-tag';
import { ProductService } from '../../service/product.service';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
    addProductForm: any;
    productTags!: ProductTag[];
    snackbarDuration: number = 3000;

    constructor(private fb: FormBuilder, private productService: ProductService, 
        private authService: AuthService,
        private router: Router,
        private snackbar: MatSnackBar) { }

    ngOnInit(): void {
        this.addProductForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(6)]],
            quantity: [1, [Validators.required, Validators.min(1)]],
            price: [1, [Validators.required, Validators.min(0)]],
            imageUrl: ['', Validators.required],
            tag: [null, Validators.required]
        });

        this.getProductTags();
    }

    getProductTags(): void {
        this.productService.getProductTags().subscribe(response => {
            this.productTags = response;
        });
    }

    handleImageUpload(response: string) {
        this.addProductForm.controls.imageUrl.setValue(response);
    }

    handleSave(): void {

        if (!this.addProductForm.valid) {
            this.showFormErrors();
            return;
        }

        const {
            title,
            description,
            quantity,
            price,
            imageUrl,
            tag
        } = this.addProductForm.value;

        this.authService.getLoggedInUser().subscribe(resp => {
            this.productService.createProduct(title, description, quantity,
                price, imageUrl, tag.name, resp.id).subscribe(response => {
                    if (response.status === 200){
                        this.openSnackBar('Product added successfully', 'success', 'Cancel');
                        this.router.navigate([`product/${response.body._id}`]);
                    }
                });
        });
    }

    get title() { return this.addProductForm.get('title'); }

    get description() { return this.addProductForm.get('description'); }

    get quantity() { return this.addProductForm.get('quantity'); }

    get price() { return this.addProductForm.get('price'); }

    get imageUrl() { return this.addProductForm.get('imageUrl'); }

    get tag() { return this.addProductForm.get('tag'); }

    private showFormErrors(): void {
        Object.keys(this.addProductForm.controls).forEach(field => {
            const control = this.addProductForm.get(field);
            control.markAsTouched({ onlySelf: true });
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

        this.snackbar.open(msg, action, {
            duration: this.snackbarDuration,
            panelClass: styleClass
        });
    }
}
