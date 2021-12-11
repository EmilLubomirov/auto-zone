import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  products!: Product[];
  length!: number
  pageSize!: number
  pageSizeOptions!: object;

  constructor(private productService: ProductService) {
    this.products = [];
    this.pageSize = 10
  }

  ngOnInit(): void {
    this.getProductsCount();
    this.getProductsPaged(0, this.pageSize);
  }

  getProductsPaged(skip: number, limit: number): void {
    this.productService.getProductsPaged(skip, limit).subscribe(response => {
      this.products = response;
    });
  }

  getProductsCount(): void {
    this.productService.getProductsCount().subscribe(response => {
      this.length = response.count;
    });
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;

    const skip = pageIndex * pageSize;
    const limit = pageSize;

    this.getProductsPaged(skip, limit);
  }

}
