import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { todo } from '../../shared/Model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiurl = 'http://localhost:8000/tasks';

  constructor(private httpclient: HttpClient) {}

  getalltodo(): Observable<todo[]> {
    return this.httpclient.get<todo[]>(this.apiurl, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createtodo(todo: todo): Observable<todo> {
    console.log('Sending POST request with data:', todo);
    return this.httpclient.post<todo>(this.apiurl, todo, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updatetodo(todo: todo): Observable<todo> {
    return this.httpclient.put<todo>(`${this.apiurl}/${todo.id}`, todo, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deletetodo(id: string): Observable<todo> {
    return this.httpclient.delete<todo>(`${this.apiurl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getbyid(todo: string): Observable<todo> {
    return this.httpclient.get<todo>(`${this.apiurl}/${todo}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const staticToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDY2MzU3NTIsImV4cCI6MTc0NjY3ODk1Mn0.sxCpV816A4cA9mwxWO0_nNQL6Z71OBsDdGlmvmO3Vgo';
    return new HttpHeaders({
      'Authorization': `Bearer ${staticToken}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.status === 0) {
      errorMessage = 'Network error: Request was blocked. Check your browser extensions or server.';
    } else if (error.status === 403) {
      errorMessage = 'Forbidden: Invalid or missing token. Please log in.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized: Invalid token. Please log in again.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found. Check the API endpoint.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid task data. Please check all required fields.';
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
