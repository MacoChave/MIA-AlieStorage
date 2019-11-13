import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @HostBinding('class') clases = 'user__dashboard';
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  signout() {
    localStorage.removeItem('session');
    this.router.navigate(['']);
  }
}
