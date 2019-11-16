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
    return this.http.post(`${Uri.USUARIO}/profile/${filename}`, formData);
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

  reloadpass(user: User, pass: string) {
    const data = {
      USERNAME: user.USERNAME, 
      PASS: user.PASS, 
      GENPASS: pass, 
      EMAIL: user.EMAIL
    }
    return this.http.put(`${Uri.USUARIO}/reloadpass`, user);
  }

  check(user: User) {
    return this.http.post(`${Uri.USUARIO}/check`, user);
  }

  update(user: User) {
    return this.http.put(`${Uri.USUARIO}/`, user);
  }

  updatePass(codigo: number, pass: string) {
    const data = {
      COD_USUARIO: codigo, 
      PASS: pass
    }
    return this.http.put(`${Uri.USUARIO}/pass`, data);
  }
  
  changeRole(user: User) {
    return this.http.put(`${Uri.USUARIO}/role`, user);
  }
}
