import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from '../../models/product';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
    product!: Product;
    isLoading: boolean = true;
    private sub: any;
    snackbarDuration: number = 3000;

    constructor(private route: ActivatedRoute, private productService: ProductService,
        private authService: AuthService, private cartService: CartService,  private snackBar: MatSnackBar,
        private router: Router) { }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            const id = params['id'];
            this.getProduct(id);
        });
    }

    handleAddToCartClick(productId: string) {
        this.authService.getLoggedInUser().subscribe(user => {
            if (!user || !user.id){
                this.router.navigate(['sign-in']);
            }
            else{
                this.cartService.addToCart(productId, user.id).subscribe(response => {
                    if (response.status === 200){
                        this.openSnackBar('Product added to cart', 'success', 'Cancel')
                    }
                }, error => {
                    const { message } = error.error.error;
                    this.openSnackBar(message, 'error', 'Cancel')
                })
            }
        })
    }

    private getProduct(id: string) {
        this.productService.getProduct(id).subscribe(response => {
            this.product = response;
            this.isLoading = false;
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

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
