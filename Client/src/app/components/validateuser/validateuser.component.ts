import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/User';
import { UserService } from 'src/app/service/user.service';
import { Result } from 'src/app/modules/Result';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-validateuser',
  templateUrl: './validateuser.component.html',
  styleUrls: ['./validateuser.component.css']
})
export class ValidateuserComponent implements OnInit {

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
    COD_TIPO: 0, 
    TIPO: 'Cliente'
  }

  GENPASS: string;
  result: Result;

  constructor(private userService: UserService, 
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  validate() {
    this.userService.validate(this.user, this.GENPASS).subscribe(
      res => {
        this.result = res;
        console.log(this.result);
        if (this.result.ROWS_AFFECTED == 1) {
          // CONFIGURACION SATISFACTORIO
          this.openSnackBar('Configuración de su cuenta con éxito', 'snackbar--valid')
        }
        else if (this.result.ROWS_AFFECTED == -1) {
          // TIEMPO CADUCADO
          this.userService.reloadpass(this.user, this.GENPASS).subscribe(
            res => {
              this.openSnackBar('El tiempo ha caducado, Revise su correo electrónico', 'snackbar--invalid')
            }, 
            err => console.error(err)
          )
        }
        else if (this.result.ROWS_AFFECTED == -2) {
          // CREDENCIALES INCORRECTOS
          this.openSnackBar('Credenciales incorrectas', 'snackbar--invalid')
        }
        else {
          // CONTRASEÑA EN CONTRA DE LAS REGLAS
          this.openSnackBar('Su contraseña no sigue las reglas de la politica', 'snackbar--invalid')
        }
      }, 
      err => {
        console.error(err);
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
