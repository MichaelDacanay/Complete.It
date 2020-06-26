import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  // backend url
  url = 'https://completeit-backend.herokuapp.com';

  constructor(private http:HttpClient) { }

  // delete tasks in the database
  deleteTasks(removeArray:string[]): Observable<any> {
    // content of http request
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'remove_array': JSON.stringify(removeArray)
      })
    }
    return this.http.delete<any>(this.url + "/deleteTasks", httpOptions);
  }

  // add task to todo list
  addTask(task_name:string, task_description:string, todo_id:number): Observable<any> {
    // save options for task
    const httpOptions = {
        'task_name': task_name,
        'task_description': task_description,
        'todo_id': todo_id
      };
      
    // call post method to flask to add item to todo list
    return this.http.post<any>(this.url + "/addTask", httpOptions);
  }

  // get updated tasks from flask app
  getTasks(user_name:string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': user_name
      })
    }
    return this.http.get<any>(this.url + "/getTasks", httpOptions);
  }

  // add new todo list with given name
  addTodoList(todo_name:string, user_name:string): Observable<any> {
      // save todo list name
      const httpOptions = {
        'todo_name': todo_name,
        "username": user_name
      };
      // call post method to flask to add item to todo list
      return this.http.post<any>(this.url + "/addTodoList", httpOptions);
  }

  // delete todo list with given id
  deleteTodoList(todo_id, todo_name, user_name:string): Observable<any> {
      // save todo list name
      const httpOptions = {
        'todo_id': todo_id,
        'todo_name': todo_name,
        "username": user_name
      };

      // call post method to flask to add item to todo list
      return this.http.post<any>(this.url + "/deleteTodoList", httpOptions);
  }

}
