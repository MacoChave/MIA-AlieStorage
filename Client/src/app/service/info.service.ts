import { Injectable } from '@angular/core';
import { Uri } from '../modules/Uri';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private http: HttpClient) { }

  getAllInfo() {
    return this.http.get(`${Uri.INFO}`);
  }

  getVideo() {
    return this.http.get(`${Uri.INFO}/video`);
  }
  getLogo() {
    return this.http.get(`${Uri.INFO}/logo`);
  }
}
