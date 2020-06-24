import { Component, OnInit } from '@angular/core';
import { SignupUserService } from 'src/app/services/signup-user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // user credentials
  username: string;
  password: string;

  // inject dependency services
  constructor(private service:SignupUserService, private router:Router) { }

  ngOnInit(): void {
  }

  // when user clicks sign up button
  onSubmit() {

    // add inputted user credentials to the database
    this.service.addUser(this.username, this.password).subscribe(user => {
      // user account successfully created
      if (user["success"]) {
        alert("Account successfully created!")
        this.router.navigateByUrl("/");
      }
      else {
        // username is already taken
        alert("This username has already been taken.")
      }
    });
  }

}
