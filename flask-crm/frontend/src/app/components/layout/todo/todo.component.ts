import { Component, OnInit, Input } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router } from '@angular/router';
import { TodoListsComponent } from 'src/app/components/todo-lists/todo-lists.component';
import { interval } from 'rxjs';
import { MoveTodoListsService } from 'src/app/services/move-todo-lists.service';

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
  user_data: any[];
  //name of user
  name = localStorage.getItem("user_name");

  @Input()
  //saves todo list
  todo_list: any[];
  @Input()
  //saves todo name
  todo_name: string;

  //initially set to 0
  dragPos: any;

  //initially set todo id
  todo_id = 0;

  constructor(private move_service:MoveTodoListsService, private service:TodoListService, private router:Router, private parent:TodoListsComponent) { }

  //render all of the updated tasks
  renderTasks() {

    //get updated user data
    this.user_data = JSON.parse(localStorage.getItem("user_data"));
    //get todo list information
    this.todo_list = this.user_data[this.todo_name];
    
    try {
      //initially, set checked to false for all elements
      for (let i = 0; i < this.todo_list.length; i++) {
        this.todo_list[i].checked = false;
      }
    }
    catch {
      console.log();
    }
    
    //saves todo id
    this.todo_id = this.todo_list[0]["todo_id"];
  }

  changeChecked(event:any, task:any) {
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
      newArray = this.todo_list.filter(function(task:any) {
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

  // Add task to todolist
  addTask(): void {

    //get id of todo list
    //console.log(this.todo_list);
    /*
    implemented: Solution for edge case where todo list is empty
    how do we get todo_id of todo list when it has no entries
      - use flask to return one element that only contains a todo id
      - dont render that element
    */
   
    //call addtask method to add task
    this.service.addTask(this.task_name, this.task_description, this.todo_id).subscribe( () => {
      
      //save new task to localstorage
      this.service.getTasks(this.name).subscribe( data => {
        localStorage.setItem("user_data", JSON.stringify(data));
        //re render list of tasks
        this.renderTasks();
        this.task_name = "";
        this.task_description = "";
      })

    })
  }

  //Method to delete a single todo list
  deleteTodoList() {

    //call parent method to delete todo list
    this.parent.deleteTodoList(this.todo_id, this.todo_name, this.name);
  }

  //constantly update position of object
  dragEnded($event: any) {
    
    //get accurate position of element
    let element = $event.source.getRootElement();

    let boundingClientRect = element.getBoundingClientRect();
    //get position of element
    //const { offsetLeft, offsetTop } = $event.source.element.nativeElement;
    //const { x, y } = $event.distance;
    const x_pos = boundingClientRect.x;
    const y_pos = boundingClientRect.y;
    //save drag position after element is dragged
    try {
      this.dragPos.x = x_pos;
      this.dragPos.y = y_pos;
    }
    catch {
      this.dragPos = {x: x_pos, y: y_pos};
    }

    //move the drag position in database
    this.move_service.movePosition(this.name, this.todo_id, this.todo_name, this.dragPos).subscribe(
      (data)=>{console.log(data)}
    )

  }

  //verify that drag position is not null
  getDragPos() {
      
      //get updated user data
      const todo_id_info = JSON.parse(localStorage.getItem("user_data"))[this.todo_name][0]["todo_id"];

      //call service to get position from backend
      this.move_service.getDragPosition(this.name, todo_id_info).subscribe((data) => {
      
        //save drag position
        this.dragPos = {x: data.position["x"], y: data.position["y"]};
        
        //update y position to include drop
        this.dragPos.y -= 124;

        //render tasks after the drag pos is obtained
        this.renderTasks();
      })
      
  }

  ngOnInit(): void {
    
    //get drag position from backend when page is loaded
    this.getDragPos();

  }

}
