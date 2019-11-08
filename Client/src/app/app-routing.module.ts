import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ValidateuserComponent } from './components/validateuser/validateuser.component';
import { NotfoundComponent } from './components/notfound/notfound.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/alie-storage', 
    pathMatch: 'full'
  }, 
  {
    path: 'alie-storage', 
    component: FrontpageComponent
  }, 
  {
    path: 'signin', 
    component: SigninComponent
  }, 
  {
    path: 'signup', 
    component: SignupComponent
  }, 
  {
    path: 'validateme', 
    component: ValidateuserComponent
  }, 
  {
    path: '**', 
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
