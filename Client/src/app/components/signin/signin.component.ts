import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  @HostBinding('class') clases = 'signin';
  
  constructor() { }

  ngOnInit() {
  }

}
