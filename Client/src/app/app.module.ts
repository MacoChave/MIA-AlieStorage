import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { InfoService } from './service/info.service';

import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { MaterialModule } from './material/material.module';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ValidateuserComponent } from './components/validateuser/validateuser.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    SignupComponent, 
    SigninComponent, ValidateuserComponent, NotfoundComponent
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
    InfoService
  ],
  bootstrap: [AppComponent], 
  entryComponents: [
  ]
})
export class AppModule { }
