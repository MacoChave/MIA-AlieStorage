import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/modules/User';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @HostBinding('class') clases = 'user__dashboard';
  
  user: User = {};
  
  constructor(private router: Router, 
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('session'));
    if (this.user === null) this.signout();
    if (this.user.EMAIL === null) this.openSnackBar('Completa tus datos de perfil', 'snackbar--invalid');
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
