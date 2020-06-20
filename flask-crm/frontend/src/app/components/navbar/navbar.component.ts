import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //Name of todolist to add
  todoListName:string;
  //name of current user
  name = localStorage.getItem("user_name") 

  constructor(private router: Router, private service: TodoListService) { }

  ngOnInit(): void {
  }

  // method that logs user out and returns them to login screen
  logout(): void {
    localStorage.setItem("user_data", "");
    localStorage.setItem("user_name", "");
    this.router.navigateByUrl("/");
  }

  //method that checks if user is logged in
  isLoggedIn(): boolean {
    if (localStorage.getItem("user_name")) {
      console.log(localStorage.getItem("user_name"))
      return true;
    }
    return false;
  }

  //method that adds a new todo list for the given user
  addTodoList() {
    
    //add todo list with correct name and save updated data for the user.
    this.service.addTodoList(this.todoListName, this.name).subscribe( () => {
      this.service.getTasks(this.name).subscribe( data=> {
        localStorage.setItem("user_data", JSON.stringify(data));
        //re-render todolist
      })
    })
  }

}


