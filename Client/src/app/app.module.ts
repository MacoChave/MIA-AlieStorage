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

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    SignupComponent, 
    SigninComponent, 
    ValidateuserComponent, 
    NotfoundComponent, 
    UserComponent, FilesystemComponent, ProfileComponent
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
  ]
})
export class AppModule { }
