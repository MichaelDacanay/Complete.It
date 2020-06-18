import { Component, OnInit } from '@angular/core';
import { LoginUserService } from 'src/app/services/login-user.service';
import { TodoListService } from 'src/app/services/todo-list.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string;
  password:string;

  constructor(private router: Router, private service:LoginUserService, private todoService:TodoListService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    try {
      
      this.service.verifyUser(this.username, this.password).subscribe(user => {
        //alert('test');
        console.log(user["success"]);
        if (user["success"]) {
          //console.log(user)
          localStorage.setItem("user_name", this.username);
          console.log(this.username)
          //call getTasks to get the tasks for the newly logged in user
          this.todoService.getTasks(this.username).subscribe(data => {
              console.log('test');
              //save tasks and lists for user in storage
              localStorage.setItem("user_data", JSON.stringify(data))
              //go to homepage
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
