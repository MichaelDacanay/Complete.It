import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoveTodoListsService {

  url = 'http://127.0.0.1:5000';

  constructor(private http:HttpClient) { }

  //get the drag position of a given todo list
  getDragPosition(user_name: string, todo_id: Object) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': user_name,
        'todo_id': JSON.stringify(todo_id)
      })
    }
    
    return this.http.get(this.url + "/getDragPosition", httpOptions);
  }

  //move the drag position of the given todo list
  movePosition(user_name: string, todo_id: Object, todo_name: string, newPosition: Object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': user_name,
        'todo_id': JSON.stringify(todo_id),
        'todo_name': todo_name,
        "newPosition": JSON.stringify(newPosition)
      })
    }
    
    return this.http.get(this.url + "/moveDragPosition", httpOptions);
  }

}
