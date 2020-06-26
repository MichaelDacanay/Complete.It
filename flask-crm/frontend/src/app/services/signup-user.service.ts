import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupUserService {
  // backend url
  url = 'https://completeit-backend.herokuapp.com';

  constructor(private http:HttpClient) { }

  // add user to the database
  addUser(user:string, password:string): Observable<any> {
    // format of the http request
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'user': user,
        'password': password
      })
    }
    return this.http.post<any>(this.url + "/signup", httpOptions);
  }
}