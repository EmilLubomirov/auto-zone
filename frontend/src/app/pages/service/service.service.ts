import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceTag } from '../models/service-tag';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    private serviceTagsUrl = 'http://localhost:9999/api/service-tag';
    private makeAppointmentUrl = 'http://localhost:9999/api/service';

    constructor(private http: HttpClient) { }

    getServiceTags(): Observable<ServiceTag[]> {
        return this.http.get<any>(this.serviceTagsUrl)
            .pipe(
                catchError(this.handleError<any>('getServiceTags', []))
            );
    }

    makeAppointment(userId: string, firstName: string, surname: string, 
                    phoneNumber: string, carLicensePlate: string, date: Date, tag: string): Observable<any> {
        const body = {
            userId,
            firstName,
            surname,
            phoneNumber,
            carLicensePlate,
            appointment: date,
            tag,
        };

        return this.http.post<any>(this.makeAppointmentUrl, body, { observe: "response" })
            .pipe(
                catchError(this.handleError<any>('makeAppointment', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
