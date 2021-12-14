import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'http://localhost:9999/api/product';
  private productsCountUrl = 'http://localhost:9999/api/product/count';
  private productTagsUrl = 'http://localhost:9999/api/product-tag';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getProductsPaged(page: number, size: number, selectedTags: string[]): Observable<any> {
    const options = {
      params: new HttpParams({fromString: `page=${page}&size=${size}&selectedTags=${selectedTags.join(',')}`})
    }

    return this.http.get<any>(this.productsUrl, options)
      .pipe(
        catchError(this.handleError<any>('getProducts', []))
      );
  }

  getProductsCount(selectedTags: string[]): Observable<any> {
    const httpOptions2 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams({fromString: "_page=1&_limit=10"})
      // params: {
      //   selectedTags
      // }
    };

    return this.http.get<any>(this.productsCountUrl, httpOptions2)
      .pipe(
        catchError(this.handleError<any>('getProductsCount', []))
      );
  }

  getProductTags(): Observable<any> {
    return this.http.get<any>(this.productTagsUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getProductTags', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
