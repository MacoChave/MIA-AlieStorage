import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfoService } from './service/info.service';
import { UserService } from './service/user.service';

import { MaterialModule } from './material/material.module';

import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ValidateuserComponent } from './components/validateuser/validateuser.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserComponent } from './components/user-dashboard/user/user.component';
import { FilesystemComponent } from './components/user-dashboard/filesystem/filesystem.component';
import { ProfileComponent } from './components/user-dashboard/profile/profile.component';
import { AdminComponent } from './components/admin-dashboard/admin/admin.component';
import { ReportComponent } from './components/admin-dashboard/report/report.component';
import { PageComponent } from './components/admin-dashboard/page/page.component';
import { ContactsComponent } from './components/admin-dashboard/contacts/contacts.component';
import { ArchivoComponent } from './components/user-dashboard/filesystem/archivo/archivo.component';
import { MoveComponent } from './components/user-dashboard/filesystem/move/move.component';

@NgModule({
  declarations: [
    AppComponent, 
    FrontpageComponent,
    SignupComponent, 
    SigninComponent, 
    ValidateuserComponent, 
    NotfoundComponent, 
    UserComponent, FilesystemComponent, ProfileComponent, ArchivoComponent, 
    AdminComponent, ReportComponent, PageComponent, ContactsComponent, MoveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MaterialModule, 
    HttpClientModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatNativeDateModule
  ],
  providers: [
    InfoService, 
    UserService
  ],
  bootstrap: [AppComponent], 
  entryComponents: [
    ArchivoComponent, 
    MoveComponent
  ]
})
export class AppModule { }
