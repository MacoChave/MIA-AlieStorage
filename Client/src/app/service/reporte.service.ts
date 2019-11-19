import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Uri } from '../modules/Uri';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient) { }

  getUsuarioByDate(year: string){
    const data = { YEAR: year }
    return this.http.post(`${Uri.REPORT}/usuario`, data);
  }

  getJournalByDateRange(min_year: string, max_year: string, folder: string) {
    const data = {
      Y_DATE: min_year, 
      Z_DATE: max_year, 
      CARPETA: folder
    }
    return this.http.post(`${Uri.REPORT}/mod`, data);
  }

  getJournal() {
    return this.http.get(`${Uri.REPORT}/log`);
  }

  getCountFolderByUser(year: string) {
    const data = { YEAR: year }
    return this.http.post(`${Uri.REPORT}/carpeta`, data);
  }
}
