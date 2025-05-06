import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface Todo {
  task: string;
  dueDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://todo-app-server-production.up.railway.app';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Todo[]> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return of([]); // Return an empty observable if no token is found
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Todo[]>(`${this.apiUrl}/tasks`, { headers });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}