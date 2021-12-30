import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cart } from '../models/cart';
import { Delivery } from '../models/delivery';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private addToCartUrl = 'http://localhost:9999/api/cart/add-to-cart';
    private cartUrl = 'http://localhost:9999/api/cart';
    private updateQuantityUrl = 'http://localhost:9999/api/cart/update-quantity';
    private removeProductUrl = 'http://localhost:9999/api/cart/remove-from-cart';
    private deliveryUrl = `http://localhost:9999/api/delivery`;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    addToCart(productId: string, userId: string): Observable<any> {
        const body = {
            productId,
            userId
        }

        return this.http.post<any>(this.addToCartUrl, body, { observe: 'response' })
            .pipe(
                catchError(this.handleError<any>('addToCart', []))
            );
    }

    getCart(userId: string): Observable<Cart> {
        const options = {
            params: new HttpParams({ fromString: `user=${userId}` })
        }

        return this.http.get<any>(this.cartUrl, options)
            .pipe(
                catchError(this.handleError<any>('getCart', []))
            );
    }

    updateCartProductQuantitiy(productId: string, userId: string, quantity: number): Observable<Cart> {
        const body = {
            productId,
            userId,
            quantity
        };


        return this.http.put<any>(this.updateQuantityUrl, body, this.httpOptions)
            .pipe(
                catchError(this.handleError<any>('updateCartProductQuantitiy', []))
            );
    }

    removeProduct(productId: string, userId: string): Observable<Cart> {
        const body = {
            productId,
            userId
        };

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body
        };

        return this.http.delete<any>(this.removeProductUrl, httpOptions)
            .pipe(
                catchError(this.handleError<any>('removeProduct', []))
            );
    }

    getDeliveryByName(name: string): Observable<Delivery> {
        const options = {
            params: new HttpParams({ fromString: `name=${name}` })
        }

        return this.http.get<any>(this.deliveryUrl, options)
            .pipe(
                catchError(this.handleError<any>('getDeliveryByName', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
