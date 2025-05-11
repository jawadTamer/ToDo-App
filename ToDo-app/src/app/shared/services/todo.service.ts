import { AuthResponse } from './auth.service/auth.models';
import { AuthService } from './auth.service/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map, switchMap, forkJoin, of } from 'rxjs';
import { todo } from '../../shared/Model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://todo-app-server-production.up.railway.app/tasks';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.setToken(storedToken);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.authService.login({ email, password }).pipe(
      map((response: AuthResponse) => {
        if (response.token) {
          this.setToken(response.token);
        }
        return response;
      }),
      catchError(error => this.handleError(error))
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available. Please log in.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getalltodo(): Observable<todo[]> {
    return this.httpClient.get<todo[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  createtodo(todo: todo): Observable<todo> {
    console.log('Sending POST request with data:', todo);
    return this.httpClient.post<todo>(this.apiUrl, todo, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  updatetodo(todo: todo): Observable<todo> {
    const taskId = todo._id || todo.id;
    return this.httpClient.put<todo>(`${this.apiUrl}/${taskId}`, todo, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deletetodo(id: string): Observable<todo> {
    return this.httpClient.delete<todo>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  deleteAllUserTasks(): Observable<any> {
    return this.httpClient.get<todo[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() }).pipe(
      switchMap(tasks => {
        if (tasks.length === 0) {
          return of({ success: true, message: 'No tasks to delete' });
        }
        
        // Create an array of delete observables
        const deleteObservables = tasks.map(task => 
          this.deletetodo(task.id?.toString() || '')
        );
        
        // Execute all delete operations and return a single observable
        return forkJoin(deleteObservables).pipe(
          map(() => ({ success: true, message: `Deleted ${tasks.length} tasks` })),
          catchError(error => throwError(() => ({ 
            success: false, 
            message: `Failed to delete all tasks: ${error.message}` 
          })))
        );
      }),
      catchError(error => this.handleError(error))
    );
  }

  getbyid(id: string): Observable<todo> {
    return this.httpClient.get<todo>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.status === 0) {
      errorMessage = 'Network error: Check your connection or server.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized: Please log in again.';
      this.clearToken();
    } else if (error.status === 403) {
      errorMessage = 'Forbidden: Invalid permissions.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.error?.message) {
      errorMessage = `Error ${error.status}: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }
}
