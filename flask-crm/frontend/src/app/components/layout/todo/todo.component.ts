import { Component, OnInit, Input } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router } from '@angular/router';
import { TodoListsComponent } from 'src/app/components/todo-lists/todo-lists.component';
import { MoveTodoListsService } from 'src/app/services/move-todo-lists.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  // name of task to add
  task_name: string;
  // description of task to add
  task_description: string;
  // user data
  user_data: any[];
  // name of user
  name = localStorage.getItem("user_name");

  @Input()
  // saves todo list
  todo_list: any[];
  @Input()
  // saves todo name
  todo_name: string;

  // initially set to 0
  dragPos: any;

  // initially set todo id
  todo_id = 0;

  constructor(private move_service:MoveTodoListsService, private service:TodoListService, private router:Router, private parent:TodoListsComponent) { }

  // render the updated tasks
  renderTasks(): void {

    // get updated user data
    this.user_data = JSON.parse(localStorage.getItem("user_data"));
    // get todo list information
    this.todo_list = this.user_data[this.todo_name];
    
    try {
      // initially, set checked to false for all elements
      for (let i = 0; i < this.todo_list.length; i++) {
        this.todo_list[i].checked = false;
      }
    }
    catch {
      console.log();
    }
    
    // save todo id
    this.todo_id = this.todo_list[0]["todo_id"];
  }

  // toggle the todo checked status
  changeChecked(event:any, task:any): void {
    
    // check if checkbox is checked
    if (event.target.checked) {
      task.checked = true;
    }
    else {
      // set to false if checkbox is not checked
      task.checked = false;
    }
  }

  // when delete button is pressed
  onDelete(): void {
    let newArray = [];
    try {
      newArray = this.todo_list.filter(function(task:any) {
        return task.checked
      });
    }
    catch {
      newArray = [];
    }

    // delete array to delete
    this.service.deleteTasks(newArray).subscribe(() => {
        // save new user data
        this.service.getTasks(this.name).subscribe(data => {
            localStorage.setItem("user_data", JSON.stringify(data));
            this.renderTasks();
          }
        )
    })
  }

  // Add new task to the todo list
  addTask(): void {   
    // add task to the database
    this.service.addTask(this.task_name, this.task_description, this.todo_id).subscribe(() => {
      
      // save updated tasks to storage
      this.service.getTasks(this.name).subscribe(data => {
        localStorage.setItem("user_data", JSON.stringify(data));
        // re-render list of tasks
        this.renderTasks();
        // clear the input boxes for task name and description
        this.task_name = "";
        this.task_description = "";
      })

    })
  }

  // delete a single todo list
  deleteTodoList(): void {
    // call parent method in TodoListsComponent to delete todo list
    this.parent.deleteTodoList(this.todo_id, this.todo_name, this.name);
  }

  // constantly update position of object when drag ends
  dragEnded($event: any) {
    // get position of element
    let element = $event.source.getRootElement();

    // get size of element and position relative to the viewport
    let boundingClientRect = element.getBoundingClientRect();

    // get x and y coordinates
    const x_pos = boundingClientRect.x;
    const y_pos = boundingClientRect.y;

    // save position after element drag ends
    try {
      this.dragPos.x = x_pos;
      this.dragPos.y = y_pos;
    }
    catch {
      this.dragPos = {x: x_pos, y: y_pos};
    }

    // update the drag position in database after move
    this.move_service.movePosition(this.name, this.todo_id, this.todo_name, this.dragPos).subscribe(
      data => {
        console.log(data)
      }
    )

  }

  // verify that drag position is not null
  getDragPos(): void {
      // get updated user data
      const todo_id_info = JSON.parse(localStorage.getItem("user_data"))[this.todo_name][0]["todo_id"];

      // call service to get position from backend
      this.move_service.getDragPosition(this.name, todo_id_info).subscribe(data => {
        // save drag position
        this.dragPos = {x: data.position["x"], y: data.position["y"]};
        
        // update y position to include displacement by navbar
        this.dragPos.y -= 123;

        // render tasks after the drag position is obtained
        this.renderTasks();
      })  
  }

  ngOnInit(): void {
    // get drag position from database when page is loaded
    this.getDragPos();
  }

}
