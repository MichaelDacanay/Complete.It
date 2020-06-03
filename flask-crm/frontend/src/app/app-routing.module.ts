import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { LoginComponent } from './components/layout/login/login.component';
import { SignupComponent } from './components/layout/signup/signup.component';
import { TodoComponent } from './components/layout/todo/todo.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: TodoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }