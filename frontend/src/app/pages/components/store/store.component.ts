import { ChangeContext } from '@angular-slider/ngx-slider';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductTag } from '../../models/product-tag';
import { ProductService } from '../../service/product.service';

@Component({
    selector: 'app-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit, AfterViewChecked {
    minSliderPrice = 0;
    maxSliderPrice = 350;
    sliderStep = 50;

    products!: Product[];
    productsCount = 0;
    productTags!: ProductTag[];
    selectedProductTags!: string[];
    minPrice = this.minSliderPrice;
    maxPrice = this.maxSliderPrice;
    length!: number
    pageSize!: number
    pageIndex!: number
    pagesCount!: number;
    paramsInvalid?: boolean;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    isLoading = true;
    scrolled = false;
    loadingFilters = false;

    constructor(private productService: ProductService, private route: ActivatedRoute,
        private router: Router) {
        this.products = [];

        if (sessionStorage.getItem("tags")) {
            this.selectedProductTags = JSON.parse(sessionStorage.getItem("tags") || '');
        }
        else {
            this.selectedProductTags = [];
        }

        if (sessionStorage.getItem("minPrice")) {
            this.minPrice = JSON.parse(sessionStorage.getItem("minPrice") || '');
        }
        else {
            this.minPrice = this.minSliderPrice;
        }

        if (sessionStorage.getItem("maxPrice")) {
            this.maxPrice = JSON.parse(sessionStorage.getItem("maxPrice") || '');
        }
        else {
            this.maxPrice = this.maxSliderPrice;
        }

        if (sessionStorage.getItem("loadingFilters")) {
            this.loadingFilters = true;
            sessionStorage.removeItem("loadingFilters")
        }

        this.pageSize = 10;
    }

    ngOnInit(): void {
        this.route
            .queryParams
            .subscribe(params => {
                this.validatePageParams(params);

                if (this.paramsInvalid) {
                    this.changeRoute();
                }
                else {
                    this.getProducts();
                    this.isLoading = true;
                }

            });

        this.router.events
            .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
            .subscribe((events: RoutesRecognized[]) => {
                const prevUrl = events[0].urlAfterRedirects;
                const currentUrl = events[1].urlAfterRedirects;

                if (prevUrl.startsWith('/store') && !currentUrl.startsWith('/product')) {
                    sessionStorage.removeItem('scrollY');
                }
            });


        this.getProductTags();
    }

    ngAfterViewChecked(): void {
        let newProductsCount = this.products.length;

        if (newProductsCount <= 0 || !this.productsCountChanged(newProductsCount) || this.scrolled) {
            return;
        }

        const scrollY = sessionStorage.getItem('scrollY');

        if (scrollY) {
            window.scrollTo(0, parseFloat(scrollY));
        }

        this.productsCount = newProductsCount;
        this.scrolled = true;
    }

    getProducts(): void {
        const maxPriceFilter = this.maxPrice === this.maxSliderPrice ? Number.MAX_SAFE_INTEGER : this.maxPrice;

        this.productService.getProductsPaged(this.pageIndex, this.pageSize, this.selectedProductTags, this.minPrice, maxPriceFilter).subscribe(response => {
            const {
                products,
                count
            } = response;

            this.products = products;
            this.length = count;
            this.isLoading = false;

            if (this.loadingFilters) {
                this.loadingFilters = false;
            }
        });
    }

    getProductTags(): void {
        this.productService.getProductTags().subscribe(response => {
            this.productTags = response;
        });
    }

    handleProductClick(id: string): void {
        sessionStorage.setItem('scrollY', window.scrollY.toString());
        sessionStorage.setItem("loadingFilters", JSON.stringify(true));
        this.router.navigate(['/product', id]);
    }

    onPageChange(event: any): void {
        if (this.products.length === 0){
            this.pageIndex = 1;
            this.changeRoute();
            return;
        }

        sessionStorage.removeItem('scrollY');

        const { pageIndex, pageSize } = event;

        if (pageSize !== this.pageSize) {
            this.pageIndex = 1;
        }
        else {
            this.pageIndex = pageIndex + 1;
        }

        this.pageSize = pageSize;
        this.changeRoute();
    }

    onTagChange(tagName: string, event: any): void {
        if (event.checked) {
            this.selectedProductTags.push(tagName);
        }
        else {
            this.selectedProductTags = this.selectedProductTags.filter(tag => tag !== tagName);
        }

        if (this.pageIndex !== 1) {
            this.pageIndex = 1;
            this.changeRoute();
        }
        else {
            this.getProducts();
            this.isLoading = true;
        }

        sessionStorage.setItem("tags", JSON.stringify(this.selectedProductTags));
    }

    onPriceRangeChange(changeContext: ChangeContext) {
        const { value, highValue } = changeContext;

        if (value !== this.minPrice || highValue !== this.maxPrice) {
            this.minPrice = value;
            this.maxPrice = highValue!;

            if (this.pageIndex !== 1) {
                this.pageIndex = 1;
                this.changeRoute();
            }
            else {
                this.getProducts();
                this.isLoading = true;
            }

            sessionStorage.setItem("minPrice", JSON.stringify(this.minPrice));
            sessionStorage.setItem("maxPrice", JSON.stringify(this.maxPrice));
        }
    }

    private productsCountChanged(newProductsCount: number): boolean {
        return newProductsCount !== this.productsCount;
    }

    private validatePageParams(params: { [x: string]: any; }) {
        this.paramsInvalid = false;

        if (!params['size'] || isNaN(params['size']) || !this.pageSizeOptions.includes(+params['size'])) {
            this.pageSize = 10;
            this.paramsInvalid = true;
        } else {
            this.pageSize = +params['size'];
        }

        if (!params['page'] || isNaN(params['page']) || +params['page'] < 1 || +params['page'] > this.pagesCount) {
            this.pageIndex = 1;
            this.paramsInvalid = true;
        } else {
            this.pageIndex = +params['page'];
        }
    }

    private changeRoute() {
        this.router.navigate(['/store'], {
            queryParams:
            {
                page: this.pageIndex,
                size: this.pageSize
            },
            queryParamsHandling: 'merge'
        });
    }

}
