import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
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

    constructor(private route: ActivatedRoute, private productService: ProductService) { }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            const id = params['id'];
            this.getProduct(id);
        });
    }

    private getProduct(id: string) {
        this.productService.getProduct(id).subscribe(response => {
            this.product = response;
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
