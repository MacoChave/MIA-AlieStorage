import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ValidateuserComponent } from './components/validateuser/validateuser.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserComponent } from './components/user-dashboard/user/user.component';
import { FilesystemComponent } from './components/user-dashboard/filesystem/filesystem.component';
import { ProfileComponent } from './components/user-dashboard/profile/profile.component';
import { AdminComponent } from './components/admin-dashboard/admin/admin.component';
import { ReportComponent } from './components/admin-dashboard/report/report.component';
import { PageComponent } from './components/admin-dashboard/page/page.component';
import { ContactsComponent } from './components/admin-dashboard/contacts/contacts.component';

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
      }, 
      {
        path: 'profile', 
        component: ProfileComponent, 
        outlet: 'user'
      }
    ]
  }, 
  {
    path: 'admin-dashboard', 
    component: AdminComponent, 
    children: [
      {
        path: 'report', 
        component: ReportComponent, 
        outlet: 'admin'
      }, 
      {
        path: 'page',
        component: PageComponent, 
        outlet: 'admin'
      }, 
      {
        path: 'contacts', 
        component: ContactsComponent, 
        outlet: 'admin'
      }, 
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
