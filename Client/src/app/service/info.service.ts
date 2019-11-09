import { Injectable } from '@angular/core';
import { Uri } from '../modules/Uri';
import { HttpClient } from '@angular/common/http';
import { Info } from '../modules/Info';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get(`${Uri.INFO}`);
  }

  getVideo() {
    return this.http.get(`${Uri.INFO}/video`);
  }

  getLogo() {
    return this.http.get(`${Uri.INFO}/logo`);
  }

  postVideo(file: File) {
    const fd = new FormData();
    fd.append('video', file, file.name);
    return this.http.post(`${Uri.INFO}/video`, fd);
  }

  update(info: Info) {
    return this.http.put(`${Uri.INFO}/`, info);
  }
}
