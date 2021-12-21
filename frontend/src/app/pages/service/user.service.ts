import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private signUpUrl = 'http://localhost:9999/api/user/register';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  signUp(username: string, password: string, rePassword: string): Observable<any> {
    const body = {
      username,
      password,
      rePassword
    }

    return this.http.post<any>(this.signUpUrl, body, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('signUp', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
