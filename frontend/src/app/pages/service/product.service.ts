import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productsUrl = 'http://localhost:9999/api/product';
    private productUrl = 'http://localhost:9999/api/product/'
    private createProductUrl = 'http://localhost:9999/api/product/create'
    private productTagsUrl = 'http://localhost:9999/api/product-tag';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    getProductsPaged(page: number, size: number, selectedTags: string[], minPrice: number, maxPrice: number): Observable<any> {
        const options = {
            params: new HttpParams({ fromString: `page=${page}&size=${size}&selectedTags=${selectedTags.join(',')}&minPrice=${minPrice}&maxPrice=${maxPrice}` })
        }

        return this.http.get<any>(this.productsUrl, options)
            .pipe(
                catchError(this.handleError<any>('getProducts', []))
            );
    }

    getProduct(id: string) {
        return this.http.get<any>(this.productUrl + id)
            .pipe(
                catchError(this.handleError<any>('getProduct', []))
            );
    }

    createProduct(title: string, description: string, quantity: number,
        price: number, imageUrl: string, tag: string, userId: string) {
        const body = {
            title,
            description,
            quantity,
            price,
            tag,
            imageUrl,
            userId
        }

        return this.http.post<any>(this.createProductUrl, body, { observe: 'response' })
            .pipe(
                catchError(this.handleError<any>('createProduct', []))
            );
    }

    getProductTags(): Observable<any> {
        return this.http.get<any>(this.productTagsUrl)
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
