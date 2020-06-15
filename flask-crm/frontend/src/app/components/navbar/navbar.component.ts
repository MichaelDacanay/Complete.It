import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  //method that logs user out and returns them to login screen
  logout() {
    localStorage.setItem("user_data", "");
    localStorage.setItem("user_name", "");
    this.router.navigateByUrl("/");
  }

  //method that checks if user is logged in
  isLoggedIn() {
    if (localStorage.getItem("user_name")) {
      return true;
    }
    return false;
  }
  

}
