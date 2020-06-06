import { Component, OnInit } from '@angular/core';
import { SignupUserService } from 'src/app/services/signup-user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username:string;
  password:string;

  constructor(private service:SignupUserService, private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.service.addUser(this.username, this.password).subscribe(user => {
      if (user["success"]) {   
        alert("Account successfully created!")
        this.router.navigateByUrl("/");
      }
      else {
        alert("This username has already been taken.")
      }
    });
  }

}
