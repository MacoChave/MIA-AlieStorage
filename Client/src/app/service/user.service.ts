import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Uri } from '../modules/Uri';
import { User } from '../modules/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  getAll() {
    return this.http.get(`${Uri.USUARIO}`);
  }
  
  getOne(id: string) {
    return this.http.get(`${Uri.USUARIO}/${id}`);
  }
  
  postProfile(file: File, filename: string) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${Uri.USUARIO}/profile/${filename}`, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  create(user: User) {
    return this.http.post(`${Uri.USUARIO}/`, user);
  }

  validate(user: User, pass: string) {
    const data = {
      USERNAME: user.USERNAME, 
      PASS: user.PASS, 
      GENPASS: pass
    }
    return this.http.post(`${Uri.USUARIO}/validate`, data);
  }

  check(user: User) {
    return this.http.post(`${Uri.USUARIO}/check`, user);
  }

  update(user: User) {
    return this.http.put(`${Uri.USUARIO}/`, user);
  }

  changeRole(user: User) {
    return this.http.put(`${Uri.USUARIO}/role`, user);
  }
}
