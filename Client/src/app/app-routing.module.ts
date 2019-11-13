import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ValidateuserComponent } from './components/validateuser/validateuser.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserComponent } from './components/user-dashboard/user/user.component';
import { FilesystemComponent } from './components/user-dashboard/filesystem/filesystem.component';


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
    path: 'validate-me', 
    component: ValidateuserComponent
  }, 
  {
    path: 'user-dashboard', 
    component: UserComponent, 
    children: [
      {
        path: 'filesystem', 
        component: FilesystemComponent, 
        outlet: 'user'
      }
    ]
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
