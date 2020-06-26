import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoveTodoListsService {
  // backend url
  url = 'https://completeit-backend.herokuapp.com';
  // current position on the screen
  drag_pos: any;

  constructor(private http:HttpClient) { }

  // get the drag position of a given todo list
  getDragPosition(user_name: string, todo_id: Object): Observable<any> {
    // specify http request format and content
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': user_name,
        'todo_id': JSON.stringify(todo_id)
      })
    }
    // get the drag position of specified todo list
    this.drag_pos = this.http.get<any>(this.url + "/getDragPosition", httpOptions)
    return this.drag_pos;
  }

  // move the drag position of the given todo list
  movePosition(user_name: string, todo_id: Object, todo_name: string, newPosition: Object): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'username': user_name,
        'todo_id': JSON.stringify(todo_id),
        'todo_name': todo_name,
        "newPosition": JSON.stringify(newPosition)
      })
    }
    return this.http.get<any>(this.url + "/moveDragPosition", httpOptions);
  }

}
