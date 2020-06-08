import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  //name of task to add
  task_name: string;
  //descr of task to add
  task_description: string;
  //user data
  user_data:[];
  //name of user
  name = localStorage.getItem("user_name");

  @Input()
  //saves todo list
  todo_list: [];
  @Input()
  //saves todo name
  todo_name: string;

  constructor(private service:TodoListService, private router:Router) {

  }

  //render all of the updated tasks
  renderTasks() {

    //get updated user data
    this.user_data = JSON.parse(localStorage.getItem("user_data"));
    //get todo list information
    this.todo_list = this.user_data[this.todo_name];
    console.log(this.user_data)
    console.log(this.todo_name)
    console.log(this.todo_list);

    try {
      //initially, set checked to false for all elements
      for (let i = 0; i < this.todo_list.length; i++) {
        this.todo_list[i].checked = false;
      }
    }
    catch {
      console.log();
    } 
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
      newArray = this.todo_list.filter(function(task) {
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
    console.log(this.user_data);
    /*
    To be implemented: Solution for edge case where todo list is empty
    how do we get todo_id of todo list when it has no entries??
    */
    let todo_id = this.todo_list[0]["todo_id"];

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

    //call render tasks to set inital checked to false
    //for all tasks in todo list
    this.renderTasks();
  }

}