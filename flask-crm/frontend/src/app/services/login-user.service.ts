import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {

  constructor() { }

  verifyUser(user:string, password:string) {
    if (user === 'michael' && password === 'password') {
      return true;
    }
    return false;
  }
}
