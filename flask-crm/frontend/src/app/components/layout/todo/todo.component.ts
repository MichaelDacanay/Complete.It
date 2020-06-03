import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  toDoItems = [];
  name = localStorage.getItem("user_name") 
  user_data:JSON;
  first_todo:string;
  first_todo_arr = [];

  constructor() {
    this.user_data = JSON.parse(localStorage.getItem("user_data"));

    this.first_todo = Object.keys(this.user_data)[0];
    
    this.first_todo_arr = this.user_data[this.first_todo];
  }

  ngOnInit(): void {
  }

  //Add each of the tasks to the ToDoItems array
  //inside HTML component, have a for loop that loops through 
  //todo items and shows list of todo items (li element)

}
