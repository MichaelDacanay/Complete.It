import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // name of the todo list to add
  todoListName: string;

  // name of the current user
  name = localStorage.getItem("user_name") 

  constructor(private router: Router, private service: TodoListService) { }

  ngOnInit(): void {
  }

  // logs user out and returns them to login screen
  logout(): void {
    // remove user credentials from storage
    localStorage.setItem("user_data", "");
    localStorage.setItem("user_name", "");
    // return to login screen
    this.router.navigateByUrl("/");
  }

  // checks if user is logged in
  isLoggedIn(): boolean {
    if (localStorage.getItem("user_name")) {
      return true;
    }
    return false;
  }

  // adds a new todo list for the given user
  addTodoList(): void {
    // add todo list with correct name and save updated data for the user
    this.service.addTodoList(this.todoListName, this.name).subscribe( () => { 
      // return the updated tasks for this todo list, for re-render
      this.service.getTasks(this.name).subscribe(data => {
        localStorage.setItem("user_data", JSON.stringify(data));
      })
    })
  }

}


