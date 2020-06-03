import { Component, OnInit } from '@angular/core';
import { LoginUserService } from 'src/app/services/login-user.service';
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

  constructor(private router: Router, private service:LoginUserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    try {
      this.service.verifyUser(this.username, this.password).subscribe(user => {
      //console.log(user["successs"])
          if (user["success"]) {
            //console.log(user)
            localStorage.setItem("user_name", this.username);
            localStorage.setItem("user_data", JSON.stringify(user["user_todo"]));
            this.router.navigateByUrl("/home");
          }
          else {
            alert("Login failed.")
          }
      });
    } catch {
      alert("Login failed.")
    }
  }
}
