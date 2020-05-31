import { Component, OnInit } from '@angular/core';
import { SignupUserService } from 'src/app/services/signup-user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username:string;
  password:string;

  constructor(private service:SignupUserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.service.addUser(this.username, this.password).subscribe(user => {
      console.log(user);
    });
  }

}
