import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/modules/User';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
  
  constructor(private userService: UserService, 
              private form: FormBuilder) { }

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
    this.user.FECHA_NACIMIENTO = `${event.value.getMonth()}-${event.value.getDay()}-${event.value.getFullYear()}`;
  }

  upload() {
    this.userService.postProfile(this.image, this.user.FOTOGRAFIA);
  }

  signup() {
    this.user.FOTOGRAFIA = this.user.USERNAME.replace(/ /g, '-');
    this.user.FOTOGRAFIA += '_profile';
    this.upload();
    this.userService.createUser(this.user).subscribe(
      res => console.log(res)
    )
  }
}
