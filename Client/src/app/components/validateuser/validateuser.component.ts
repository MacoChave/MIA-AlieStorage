import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/User';
import { UserService } from 'src/app/service/user.service';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  validate() {
    this.userService.validate(this.user, this.GENPASS).subscribe(
      res => {
        console.log(res);
        if (res.rows_affected > 0) console.info('Se ha verificado la cuenta')
        else if (res.rows_affected < 0) console.error('Verificar el dato ingresado')
        else {
          this.userService.reloadpass(this.user)
          console.info('Contraseña temporal reenviada');
        }
      }, 
      err => console.error(err)
    )
  }
}
