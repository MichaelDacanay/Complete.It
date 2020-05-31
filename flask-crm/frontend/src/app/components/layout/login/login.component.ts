import { Component, OnInit } from '@angular/core';
import { LoginUserService } from 'src/app/services/login-user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string;
  password:string;

  constructor(private service:LoginUserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.service.verifyUser(this.username, this.password).subscribe(user => {
      console.log(user);
    });
  }
}
