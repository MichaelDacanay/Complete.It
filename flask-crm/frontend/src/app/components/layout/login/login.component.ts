import { Component, OnInit } from '@angular/core';
import { LoginUserService } from 'src/app/services/login-user.service';
import { TodoListService } from 'src/app/services/todo-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // user credentials
  username: string;
  password: string;

  // inject router and service dependencies
  constructor(private router: Router, private service:LoginUserService, private todoService:TodoListService) { }

  ngOnInit(): void {
  }

  // when user clicks the login button
  onSubmit(): void {
    try {
      // verify if user credentials are valid
      this.service.verifyUser(this.username, this.password).subscribe(user => {

        // if user login is successful
        if (user["success"]) {

          // store username in localStorage
          localStorage.setItem("user_name", this.username);

          // get the tasks for the newly logged in user
          this.todoService.getTasks(this.username).subscribe(data => {
              // save tasks and lists for user in storage
              localStorage.setItem("user_data", JSON.stringify(data))
              // go to homepage
              this.router.navigateByUrl("/home");
          })
        } else {
          alert("Login failed.")
        }

      });
    } catch {
      alert("Login failed.")
    }
  }
}
