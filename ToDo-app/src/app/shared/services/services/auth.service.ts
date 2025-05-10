import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://todo-app-server-production.up.railway.app';

  constructor(private http: HttpClient) { }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  deleteAccount(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/delete-account`, { headers });
  }
}
