import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/User';
import { UserService } from 'src/app/service/user.service';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Result } from 'src/app/modules/Result';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = {};
  newPass: string = '';
  resultUser: Result;
  resultPass: Result;

  list_genero = [
    { nombre: 'Masculino', value: 'm' }, 
    { nombre: 'Femenino', value: 'f' }
  ]
  
  constructor(private userService: UserService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = <User>JSON.parse(localStorage.getItem('session'));
  }

  addDate(event: MatDatepickerInputEvent<Date>) {
    this.user.FECHA_NACIMIENTO = `${event.value.getDay()}-${event.value.getMonth()}-${event.value.getFullYear()}`;
  }

  update() {
    this.userService.update(this.user).subscribe(
      resUser => {
        this.resultUser = <Result>resUser;
        if (this.resultUser.ROWS_AFFECTED > 0) {
          localStorage.setItem('session', JSON.stringify(this.user));
          this.openSnackBar('El usuario se ha actualizado', 'snackbar--valid')
        }
        else this.openSnackBar('El usuario no se actualizó', 'snackbar--invalid')
        if (this.newPass != '') {
          this.userService.updatePass(this.user.COD_USUARIO, this.user.PASS).subscribe(
            resPass => {
              this.resultPass = <Result>resPass
              if (this.resultPass.ROWS_AFFECTED > 0) 
                this.openSnackBar('La contraseña se actualizó', 'snackbar--valid')
              else  this.openSnackBar('La contraseña no cumple con las reglas', 'snackbar--invalid')
            }
          )
        }
      }
    )
  }

  openSnackBar(message: string, snack_class: string) {
    let config = <MatSnackBarConfig<any>>new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['snackbar', snack_class];
    this._snackBar.open(message, undefined, config);
  }

}
