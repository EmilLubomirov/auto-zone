import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartProduct } from '../models/cart-product';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private makeOrderUrl = 'http://localhost:9999/api/order/make-order';

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    makeOrder(userId: string, products: CartProduct[], firstName: string, surname: string,
        email: string, phoneNumber: string, address: string, productsPrice: string,
        totalPrice: string, deliveryName: string): Observable<any> {
        const body = {
            userId,
            products,
            firstName,
            surname,
            email,
            phoneNumber,
            address,
            productsPrice,
            totalPrice,
            deliveryName
        }

        return this.http.post<any>(this.makeOrderUrl, body, { observe: "response" })
            .pipe(
                catchError(this.handleError<any>('makeOrder', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
