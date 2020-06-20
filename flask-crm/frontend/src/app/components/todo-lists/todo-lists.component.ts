import { Component, OnInit } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-todo-lists',
  templateUrl: './todo-lists.component.html',
  styleUrls: ['./todo-lists.component.css']
})
export class TodoListsComponent implements OnInit {

  //Name of todolist to add
  todoListName:string;

  //name of current user
  name = localStorage.getItem("user_name") 
  //list of todo lists
  todo_lists: any[];
  user_data: any[];

  constructor(private service: TodoListService, private router:Router) { }

  //method that updates all the information
  renderTodoLists() {
    //get data for this particular user
    this.service.getTasks(this.name).subscribe( data => {
      localStorage.setItem("user_data", JSON.stringify(data));
    })

    this.constantlyRender();
  }

  //method that listens for changes to local storage
  constantlyRender() {
    //Save user data, make sure there is a change in localstorage
    if (JSON.stringify(this.user_data) !== localStorage.getItem("user_data")) {
      
      this.user_data = JSON.parse(localStorage.getItem("user_data"));
      //save as todo lists
      this.todo_lists = this.user_data;
    }
  }

  //method that logs user out and returns them to login screen
  logout(): void {
    localStorage.setItem("user_data", "");
    localStorage.setItem("user_name", "");
    this.router.navigateByUrl("/");
  }

  //Method to delete a single todo list
  deleteTodoList(todo_id:number, todo_name:string, user_name:string) {

    //receive variables from child method
    this.service.deleteTodoList(todo_id, todo_name, user_name).subscribe( ()=> {
      //save new info to localstorage
      this.service.getTasks(this.name).subscribe( data => {
        localStorage.setItem("user_data", JSON.stringify(data));
      
        //re-render todo lists
      })
    })
  }

  ngOnInit(): void {

    //constantly re-render todo lists
    this.renderTodoLists();
    interval(100).subscribe(() => {
      this.constantlyRender();
    })
  }

}
