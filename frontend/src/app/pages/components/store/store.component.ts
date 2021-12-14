import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductTag } from '../../models/product-tag';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  products!: Product[];
  productTags!: ProductTag[];
  selectedProductTags!: string[]
  length!: number
  pageSize!: number
  pageIndex!: number
  pagesCount!: number;
  paramsInvalid?: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean = true;

  constructor(private productService: ProductService,  private route: ActivatedRoute, 
              private router: Router) {
    this.products = [];
    this.selectedProductTags = [];
    this.pageSize = 10
  }

  ngOnInit(): void {
    this.route
    .queryParams
    .subscribe(params => {
      this.validatePageParams(params);

      if (this.paramsInvalid){
        this.changeRoute();
      }
      else {
        this.getProducts();
        this.isLoading = true;
      }

    });

    this.getProductTags();
  }

  getProducts(): void {
    this.productService.getProductsPaged(this.pageIndex, this.pageSize, this.selectedProductTags).subscribe(response => {
      const {
        products,
        count
      } = response;

      this.products = products;
      this.length = count;
      this.isLoading = false;
    });
  }

  getProductTags(): void {
    this.productService.getProductTags().subscribe(response => {
      this.productTags = response;
    });
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;

    if (pageSize !== this.pageSize){
      this.pageIndex = 1;
    }
    else {
      this.pageIndex = pageIndex + 1;
    }

    this.pageSize = pageSize;
    this.changeRoute();
  }

  onTagChange(tagName: string, event: any): void {
    if (event.checked){
      this.selectedProductTags.push(tagName);
    }
    else{
      this.selectedProductTags = this.selectedProductTags.filter(tag => tag !== tagName);
    }

    if (this.pageIndex !== 1){
      this.pageIndex = 1;
      this.changeRoute();
    }
    else{
      this.getProducts();
    }
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

  private changeRoute(){
    this.router.navigate(['/store'], { queryParams: 
      { page: this.pageIndex,
        size: this.pageSize
      },
        queryParamsHandling: 'merge'
      });
  }

}
