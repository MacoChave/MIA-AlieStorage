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

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    SignupComponent, 
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MaterialModule, 
    HttpClientModule
  ],
  providers: [
    InfoService
  ],
  bootstrap: [AppComponent], 
  entryComponents: [
  ]
})
export class AppModule { }
