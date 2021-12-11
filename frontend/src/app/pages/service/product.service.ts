import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'http://localhost:9999/api/product';
  private productsCountUrl = 'http://localhost:9999/api/product/count';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.post<any>(this.productsUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getProducts', []))
      );
  }

  getProductsPaged(skip: number, limit: number): Observable<any> {
    const body = {
      skip, 
      limit
    }

    return this.http.post<any>(this.productsUrl, body, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getProducts', []))
      );
  }

  getProductsCount(): Observable<any> {
    return this.http.get<any>(this.productsCountUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('getProductsCount', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
