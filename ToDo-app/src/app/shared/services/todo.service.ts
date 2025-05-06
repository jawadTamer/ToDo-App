import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { todo } from '../Model/todo';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

 private apiurl="http://localhost:3000/todos";

  constructor(private httpclient:HttpClient) { }
getalltodo():Observable<todo[]>{
return this.httpclient.get<todo[]>(this.apiurl)
}
creattodo(todo:todo):Observable<todo>{
return this.httpclient.post<todo>(this.apiurl,todo)
}
updatetodo(todo:todo):Observable<todo>{
return this.httpclient.put<todo>(`${this.apiurl}/${todo.id}`,todo)
}
deletetodo(id:string):Observable<todo>{
  return this.httpclient.delete<todo>(`${this.apiurl}/${id}`)
}
getbyid(todo:string):Observable<todo>{
  return this.httpclient.get<todo>(`${this.apiurl}/${todo}`)

}}
