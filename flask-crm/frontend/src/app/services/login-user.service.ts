import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  url = 'http://localhost:5000';
  
  constructor(private http:HttpClient) { }

  verifyUser(user:string, password:string):Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'user': user,
        'password': password,
      })
    }

    return this.http.get<User>(this.url + "/login", httpOptions);

    // if (user === 'michael' && password === 'password') {
    //   return true;
    // }
    // return false;
  }
}
