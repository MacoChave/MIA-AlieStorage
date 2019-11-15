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

  getDisk(id: string) {
    return this.http.get(`${Uri.DISCO}/${id}`);
  }

  getFolderContent(id: string) {

  }
  
  getFileContent(id: string) {

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
