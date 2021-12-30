import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CartProduct } from 'src/app/pages/models/cart-product';
import { CartService } from 'src/app/pages/service/cart.service';

@Component({
    selector: 'app-cart-product',
    templateUrl: './cart-product.component.html',
    styleUrls: ['./cart-product.component.css']
})
export class CartProductComponent implements OnInit {
    @Input() cartProduct!: CartProduct;
    @Input() userId!: string;
    @Output() productQtyChangeEvent = new EventEmitter<string>();
    @Output() productRemoveEvent = new EventEmitter<string>();

    cartProductForm!: any;
    maxProductQuantity = 10;
    productEndPrice!: string;
    quantities!: number[];


    constructor(private fb: FormBuilder, private cartService: CartService) { }

    ngOnInit(): void {
        const quantity = this.cartProduct.product.quantity;

        const maxQuantity = this.maxProductQuantity > quantity ?
            quantity : this.maxProductQuantity;

        const requestedQuantity = this.cartProduct.quantity > maxQuantity ?
            maxQuantity : this.cartProduct.quantity;

        this.quantities = [...Array(maxQuantity + 1).keys()].slice(1);

        this.cartProductForm = this.fb.group({
            quantity: [requestedQuantity, [Validators.required, Validators.min(1)]]
        });

        this.productEndPrice = (requestedQuantity * this.cartProduct.product.price).toFixed(2);
    }

    handleAmountChange(event: any): void {
        const amount: number = event.value;
        this.productEndPrice = (amount * this.cartProduct.product.price).toFixed(2);

        this.cartService.updateCartProductQuantitiy(this.cartProduct.product._id, this.userId, amount)
        .subscribe(response => {
            this.productQtyChangeEvent.emit(this.cartProduct.product._id);
        });
    }

    handleProductRemove(event: any): void {
       this.productRemoveEvent.emit(this.cartProduct.product._id);
    }

    get quantity() { return this.cartProductForm.get('quantity'); }

}
