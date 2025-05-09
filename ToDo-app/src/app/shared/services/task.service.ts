import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Interface representing a Todo item
interface Todo {
  task: string;
  dueDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Base URL for the API
  private apiUrl = 'https://todo-app-server-production.up.railway.app';

  // Inject HttpClient for making HTTP requests
  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of tasks from the server.
   * Returns an empty array if no token is found.
   */
  getTasks(): Observable<Todo[]> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return of([]); // Return an empty observable if no token is found
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Todo[]>(`${this.apiUrl}/tasks`, { headers });
  }

  /**
   * Retrieves the authentication token from local storage.
   */
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}