import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SignupUserService {
  url = 'https://completeit-backend.herokuapp.com';

  constructor(private http:HttpClient) { }

  addUser(user:string, password:string):Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'user': user,
        'password': password
      })
    }

    return this.http.get<User>(this.url + "/signup", httpOptions);
  }
}