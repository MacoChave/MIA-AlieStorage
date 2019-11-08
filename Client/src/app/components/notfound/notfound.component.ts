import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  @HostBinding('class') clases = 'notfound';
  constructor() { }

  ngOnInit() {
  }

}
