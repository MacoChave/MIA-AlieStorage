import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Uri } from '../modules/Uri';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {

  constructor(private http: HttpClient) { }

  getDisks() {

  }

  getDisk(user: number) {
    return this.http.get(`${Uri.DISCO}/${user}`);
  }

  getParts(disk: number) {
    return this.http.get(`${Uri.PARTICION}/${disk}`)
  }

  getRootContent(part: number) {
    const body = { PARTICION: part }
    return this.http.post(`${Uri.CARPETA}/root`, body);
  }

  getFolderContent(part: number, child: number) {
    const body = {
      PARTICION: part, 
      PADRE: child
    }
    return this.http.post(`${Uri.CARPETA}/child`, body);
  }

  getUpTo(part: number, cod_folder: number) {
    const body = {
      PARTICION: part, 
      COD_CARPETA: cod_folder
    }
    return this.http.post(`${Uri.CARPETA}/up`, body);
  }
  
  postFolder() {

  }

  postFile() {

  }

  updateFolder() {

  }

  updateFile() {

  }

  deleteFolder() {

  }

  deleteFile() {

  }
}
