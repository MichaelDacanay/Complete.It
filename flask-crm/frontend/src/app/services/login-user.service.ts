import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  url = 'https://completeit-backend.herokuapp.com';
  
  constructor(private http:HttpClient) { }

  verifyUser(user:string, password:string):Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'user': user,
        'password': password
      })
    }
    return this.http.get<any>(this.url + "/login", httpOptions);
  }
}
