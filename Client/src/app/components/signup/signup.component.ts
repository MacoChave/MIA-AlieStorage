import { Component, OnInit, HostBinding } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/modules/User';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @HostBinding('class') cases = 'signup';
  
  image: File;
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

  list_genero = [
    { nombre: 'Masculino', value: 'm' }, 
    { nombre: 'Femenino', value: 'f' }
  ]
  
  constructor(private userService: UserService, 
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  change(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
      console.log(this.image);
    }
  }

  addDate(event: MatDatepickerInputEvent<Date>) {
    this.user.FECHA_NACIMIENTO = `${event.value.getDate()}-${event.value.getMonth() + 1}-${event.value.getFullYear()}`;
  }

  upload() {
    this.userService.postProfile(this.image, this.user.FOTOGRAFIA).subscribe(
      res => console.log(res), 
      err => console.error(err)
    )
  }

  signup() {
    this.user.FOTOGRAFIA = this.user.USERNAME.replace(/ /g, '-');
    this.user.FOTOGRAFIA += '_profile';
    this.upload();
    console.log(this.user);
    this.userService.create(this.user).subscribe(
      (res) => this.openSnackBar('Su cuenta ha sido creada. Revise su correo electrónico.', 'snackbar--valid'), 
      (err) => this.openSnackBar('Su cuenta no se ha creado.', 'snackbar--invalid'), 
    )
  }

  openSnackBar(message: string, snack_class: string) {
    let config = <MatSnackBarConfig<any>>new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['snackbar', snack_class];
    this._snackBar.open(message, undefined, config);
  }
}
