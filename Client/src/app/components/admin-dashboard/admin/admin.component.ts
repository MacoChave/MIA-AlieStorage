import { Component, OnInit, HostBinding } from '@angular/core';
import { User } from 'src/app/modules/User';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @HostBinding('class') clases = 'user__dashboard';
  
  user: User = {};
  
  constructor(private router: Router, 
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('session'));
  }

  signout() {
    localStorage.removeItem('session');
    this.router.navigate(['']);
  }

  openSnackBar(message: string, snack_class: string) {
    let config = <MatSnackBarConfig<any>>new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['snackbar', snack_class];
    this._snackBar.open(message, undefined, config);
  }
}
