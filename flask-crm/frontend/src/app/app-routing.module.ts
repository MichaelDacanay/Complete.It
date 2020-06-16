import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { SignupComponent } from './components/layout/signup/signup.component';
import { TodoListsComponent } from './components/todo-lists/todo-lists.component';

const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: TodoListsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }