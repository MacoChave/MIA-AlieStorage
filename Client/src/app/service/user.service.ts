import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Uri } from '../modules/Uri';
import { User } from '../modules/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  postProfile(file: File, filename: string) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${Uri.USUARIO}/profile/${filename}`, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  createUser(user: User) {
    return this.http.post(`${Uri.USUARIO}/`, user);
  }
}
