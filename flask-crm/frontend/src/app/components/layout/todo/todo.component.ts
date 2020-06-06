import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router, RouterModule } from '@angular/router';

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

  //name of task to add
  task_name: string;
  //descr of task to add
  task_description: string;

  constructor(private service:TodoListService, private router:Router) {

    this.service.getTasks(this.name).subscribe( data => {
      //console.log(data);
        localStorage.setItem("user_data", JSON.stringify(data));
    })
    //console.log(this.name);
    //console.log(localStorage.getItem("user_data"))

    this.renderTasks();
  }

  //render all of the updated tasks
  renderTasks() {

    this.user_data = JSON.parse(localStorage.getItem("user_data"));

    this.first_todo = Object.keys(this.user_data)[0];
    
    this.first_todo_arr = this.user_data[this.first_todo];
    try {
      //initially, set checked to false for all elements
      for (let i = 0; i < this.first_todo_arr.length; i++) {
        this.first_todo_arr[i].checked = false;
      }
    }
    catch {
      console.log();
    } 
  }

  //method that logs user out and returns them to login screen
  logout() {
    localStorage.setItem("user_data", "");
    localStorage.setItem("user_name", "");
    this.router.navigateByUrl("/");
  }

  changeChecked(event, task) {
    //Check if checkbox is checked
    if (event.target.checked) {
      task.checked = true;
    }
    //set to false if checkbox is not checked.
    else {
      task.checked = false;
    }
  }

  //when delete button is pressed
  onDelete(): void {
    let newArray = [];
    try {
      newArray = this.first_todo_arr.filter(function(task) {
        return task.checked
      });
    }
    catch {
      newArray = [];
    }

    //call delete method with array to delete
    //save new user data
    this.service.deleteTasks(newArray).subscribe( ()=> {
        this.service.getTasks(this.name).subscribe( data => {
            localStorage.setItem("user_data", JSON.stringify(data));
            this.renderTasks();
          }
        )
    })

  }

  //add task to todolist
  addTask() {

    //get id of todo list
    let todo_id = this.first_todo_arr[0]["todo_id"];

    /*
    To be implemented: Handling creation of first todo list
    New tasks in empty todo list.
    */
   
    //call addtask method to add task
    this.service.addTask(this.task_name, this.task_description, todo_id).subscribe( ()=>{
      
      //save new task to localstorage
      this.service.getTasks(this.name).subscribe( data => {
        localStorage.setItem("user_data", JSON.stringify(data));
        //re render list of tasks
        this.renderTasks();
        this.task_name = "";
        this.task_description = "";
      }
    )
      }
    )
  }

  ngOnInit(): void {
  }

  //Add each of the tasks to the ToDoItems array
  //inside HTML component, have a for loop that loops through 
  //todo items and shows list of todo items (li element)

}
