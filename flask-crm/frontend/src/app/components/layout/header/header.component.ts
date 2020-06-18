import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //method that checks if user is logged in
  isLoggedIn(): boolean {
    if (localStorage.getItem("user_name")) {
      return true;
    }
    return false;
  }

}
