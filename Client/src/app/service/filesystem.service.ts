import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Uri } from '../modules/Uri';
import { Folder } from '../modules/Folder';

@Injectable({
  providedIn: 'root'
})
export class FilesystemService {
  
  constructor(private http: HttpClient) { }

  getDisks() {
    return this.http.get(`${Uri.CARPETA}`);
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
  
  postFolder(folder: Folder) {
    return this.http.post(`${Uri.CARPETA}/folder`, folder);
  }

  postFile(folder: Folder) {
    return this.http.post(`${Uri.CARPETA}/file`, folder);
  }

  updateName(cod: number, name: string) {
    const data = {
      COD_CARPETA: cod, 
      NOMBRE: name
    }
    return this.http.put(`${Uri.CARPETA}/nombre`, data)
  }

  updateContent(cod: number, content: string) {
    const data = {
      COD_CARPETA: cod, 
      CONTENIDO: content
    }
    return this.http.put(`${Uri.CARPETA}/contenido`, data)
  }

  deleteFolder(cod: number) {
    return this.http.delete(`${Uri.CARPETA}/${cod}`)
  }

}
