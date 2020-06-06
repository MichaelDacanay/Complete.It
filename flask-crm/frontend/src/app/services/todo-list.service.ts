import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  url = 'http://127.0.0.1:5000';

  constructor(private http:HttpClient) { }

  //method to call flask app and delete tasks
  deleteTasks(removeArray:string[]) {
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'remove_array': JSON.stringify(removeArray)
      })
    }
    return this.http.delete(this.url + "/deleteTasks", httpOptions);
  }

  //method to add task to user's todo list
  addTask(task_name:string, task_description:string, todo_id:string) {

    //save options for task
    const httpOptions = {
        'task_name': task_name,
        'task_description': task_description,
        'todo_id': todo_id
      };
      
    //call post method to flask to add item to todo list
    return this.http.post(this.url + "/addTask", httpOptions);
  }

  //method to get updated tasks from flask app
  getTasks(user_name) {
    //console.log(user_name);
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': user_name
      })
    }
    //console.log(httpOptions);
    return this.http.get(this.url + "/getTasks", httpOptions);
  }
}
