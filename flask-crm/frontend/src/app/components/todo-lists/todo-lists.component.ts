import { Component, OnInit } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-lists',
  templateUrl: './todo-lists.component.html',
  styleUrls: ['./todo-lists.component.css']
})
export class TodoListsComponent implements OnInit {

  //name of current user
  name = localStorage.getItem("user_name") 
  //list of todo lists
  todo_lists:JSON;
  user_data:JSON;

  constructor(private service: TodoListService, private router:Router) {

      //get data for this particular user
      this.service.getTasks(this.name).subscribe( data => {
          localStorage.setItem("user_data", JSON.stringify(data));
      })

      //Save user data
      this.user_data = JSON.parse(localStorage.getItem("user_data"));

      //save as todo lists
      this.todo_lists = this.user_data;

   }
   
  //method that logs user out and returns them to login screen
  logout() {
    localStorage.setItem("user_data", "");
    localStorage.setItem("user_name", "");
    this.router.navigateByUrl("/");
  }

  ngOnInit(): void {
  }

}
