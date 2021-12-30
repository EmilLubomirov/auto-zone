import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Cart } from '../../models/cart';
import { CartService } from '../../service/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cart!: Cart;
    userId!: string;
    isLoading: boolean = true;
    maxProductQuantity = 10;
    productsPrice!: string;
    totalPrice!: string;
    

    constructor(private cartService: CartService, private authService: AuthService) { }

    ngOnInit(): void {
        this.getCart();
    }

    getCart() {
        this.userId = this.authService.getUserId();
        this.cartService.getCart(this.userId).subscribe(response => {
            this.cart = response;
            this.isLoading = false;
            this.updateProductsPrice();
        });
    }

    handleProductRemove(productId: string) {
        this.cartService.removeProduct(productId, this.userId).subscribe(response => {
            this.getCart();
        });
    }

    handleProductQtyChange(productId: string) {
        this.getCart();
    }

    private updateProductsPrice(): void {
        const price = this.cart.products ? this.cart.products.map(p => p.product.price * p.quantity)
            .reduce((acc, curr) => acc + curr, 0) : 0;

        this.productsPrice = price.toFixed(2);
        this.updateTotalPrice();
    }

    private updateTotalPrice(): void {
        const currentProductsPrice = parseFloat(this.productsPrice);

        if (!isNaN(currentProductsPrice) && currentProductsPrice > 0){
            if (currentProductsPrice < 50){
                this.cartService.getDeliveryByName("Standard").subscribe(response => {
                    this.totalPrice = (currentProductsPrice + response.price).toFixed(2);
                });
            }

            else {
                this.cartService.getDeliveryByName("Free").subscribe(response => {
                    this.totalPrice = (currentProductsPrice + response.price).toFixed(2);
                });
            }
        }
        else {
            this.totalPrice = '0.00';
        }
    }

}
