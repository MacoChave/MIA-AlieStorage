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
  result: any;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  validate() {
    this.userService.validate(this.user, this.GENPASS).subscribe(
      res => this.result = res[0], 
      err => console.error(err)
    )
  }
}
