import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Observable, map } from 'rxjs';

// Interfaces
import { UserData, LoginPayload, AuthResponse } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://todo-app-server-production.up.railway.app';

  constructor(private http: HttpClient) {}

  // Method to register a user
  register(userData: UserData) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Method to log in a user
  login(credentials: LoginPayload) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse) {
    if (error.error.errors) {
      return throwError(() => error.error.errors); // errors object (field-based)
    }
    if (error.error.message) {
      return throwError(() => ({ general: error.error.message })); // general message
    }
    return throwError(() => ({ general: 'An unknown error occurred.' }));
  }

  // Fetch user by email from /debug/users
  getUserByEmail(email: string): Observable<UserData | undefined> {
    return this.http.get<UserData[]>(`${this.apiUrl}/debug/users`).pipe(
      map(users => users.find(user => user.email === email))
    );
  }
}
