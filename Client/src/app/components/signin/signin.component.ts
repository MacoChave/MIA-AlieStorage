import { Component, OnInit, HostBinding } from '@angular/core';
import { User } from 'src/app/modules/User';
import { UserService } from 'src/app/service/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  @HostBinding('class') clases = 'signin';
  
  user: User = {
    COD_USUARIO: 0,
    NOMBRE: '', 
    APELLIDO: '', 
    USERNAME: '', 
    PASS: '', 
    EMAIL: '', 
    TELEFONO: 0, 
    FOTOGRAFIA: '', 
    GENERO: '', 
    FECHA_NACIMIENTO: '', 
    FECHA_REGISTRO: '', 
    FECHA_VALIDACION: '', 
    COD_TIPO: 0, 
    TIPO: 'Cliente', 
    DIRECCION: '', 
    ESTADO: '' 
  }
  result: any;

  constructor(private userService: UserService, 
              private _snackBar: MatSnackBar, 
              private router: Router) { }

  ngOnInit() {
  }

  signin() {
    this.userService.check(this.user).subscribe(
      res => {
        if (res != null) {
          this.user = res[0];
          console.log(this.user);
          this.openSnackBar(`Bienvenido ${this.user.USERNAME}`, 'snackbar--valid')
          localStorage.setItem('session', JSON.stringify(this.user));
          if (this.user.TIPO === 'Cliente') {
            this.router.navigate(['user-dashboard']);
          }
          else if (this.user.TIPO === 'Admin') {
            // TODO: GO TO ADMIN DASHBOARD
          }
          else {
            // TODO: GO TO ROOT DASHBOARD
          }
        }
        else this.openSnackBar('Usuario y/o contraseña inválida', 'snackbar--invalid')
      }, 
      err => this.openSnackBar('Usuario y/o contraseña inválida', 'snackbar--invalid')
    )
  }

  openSnackBar(message: string, snack_class: string) {
    let config = <MatSnackBarConfig<any>>new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['snackbar', snack_class];
    this._snackBar.open(message, undefined, config);
  }
}
