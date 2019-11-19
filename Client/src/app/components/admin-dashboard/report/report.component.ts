import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReporteService } from 'src/app/service/reporte.service';
import { User } from 'src/app/modules/User';
import { Modified, FolderLog } from 'src/app/modules/Reports';
import { FilesystemService } from 'src/app/service/filesystem.service';
import { Folder } from 'src/app/modules/Folder';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  year1: string;
  year2: string;
  folder: string;

  userReport: User[]

  modReport: Modified[]

  folderReport: FolderLog[]

  folders: Folder[]
  cod_folder: string;

  @ViewChild('content1') content_1: ElementRef;
  @ViewChild('content2') content_2: ElementRef;
  @ViewChild('content3') content_3: ElementRef;
  @ViewChild('content4') content_4: ElementRef;

  constructor(private reportService: ReporteService, 
              private fileService: FilesystemService) { }

  ngOnInit() {
    this.fileService.getDisks().subscribe(
      res => {
        this.folders = <Folder[]>res
      }
    )
  }

  changeFolder() {

  }

  addDate(event: MatDatepickerInputEvent<Date>, datePickNumber: number) {
    switch (datePickNumber) {
      case 1:
        this.year1 = event.value.getFullYear().toString();
        break;
      case 2:
        this.year1 = `${event.value.getDate()}-${event.value.getMonth() + 1}-${event.value.getFullYear()}`
        break;
      case 3:
        this.year2 = `${event.value.getDate()}-${event.value.getMonth() + 1}-${event.value.getFullYear()}`
        break;
      case 4:
        this.year1 = `${event.value.getDate()}-${event.value.getMonth() + 1}-${event.value.getFullYear()}`
        break;
      default:
        break;
    }
    console.log({ YEAR_1: this.year1, YEAR_2: this.year2})
  }

  showReport(index: number) {
    switch (index) {
      case 1:
        // POST('/usuario')
        this.reportService.getUsuarioByDate(this.year1).subscribe(
          res => {
            this.userReport = <User[]>res
            console.log(this.userReport)
          }
        )
        break;
      case 2:
        // POST('/mod')
        console.log('SHOW: SEGUNDO REPORTE')
        console.log(this.cod_folder)
        this.reportService.getJournalByDateRange(this.year1, this.year2, this.cod_folder).subscribe(
          res => {
            this.modReport = <Modified[]>res
            console.log(this.modReport)
          }
        )
        break;
      case 3:
        // POST('/log')
        this.reportService.getJournal().subscribe(
          res => {
            this.modReport = <Modified[]>res
            console.log(this.modReport)
          }
        )
        break;
      case 4:
        // POST('/carpeta')
        this.reportService.getCountFolderByUser(this.year1).subscribe(
          res => {
            this.folderReport = <FolderLog[]>res
            console.log(this.folderReport)
          }
        )
        break;
      default:
        break;
    }
  }

  exportReport(index: number) {
    let name = 'report.pdf';
    
    let doc = new jsPDF('landscape');
    let specialElementHandlers = {
      '#editor': (element, rendered) => {
        return true;
      }
    };

    let content;
    
    switch (index) {
      case 1:
        // POST('/usuario')
        content = this.content_1.nativeElement;
        name = `report_${index}.pdf`
        break;
      case 2:
        // POST('/mod')
        content = this.content_2.nativeElement;
        name = `report_${index}.pdf`
        break;
      case 3:
        // POST('/log')
        content = this.content_3.nativeElement;
        name = `report_${index}.pdf`
        break;
      case 4:
        // POST('/carpeta')
        content = this.content_4.nativeElement;
        name = `report_${index}.pdf`
        break;
      default:
        break;
    }

    doc.fromHTML(content.innerHTML, 15, 15, {
      width: 1024, 
      elementHandlers: specialElementHandlers
    });

    doc.save(name);
  }
}
