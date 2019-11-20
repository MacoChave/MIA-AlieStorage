import { Component, OnInit, Inject } from '@angular/core';
import { Folder } from 'src/app/modules/Folder';
import { FilesystemService } from 'src/app/service/filesystem.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.css']
})
export class ArchivoComponent implements OnInit {

  cod_padre: number
  actual: Folder = {
    COD_CARPETA: 0, 
    COD_DISCO: 0, 
    COD_PADRE: 0, 
    COD_PARTICION: 0, 
    CONTENIDO: '', 
    FECHA_CREACION: '', 
    NOMBRE: '', 
    NO_BLOQUE: 0, 
    PERMISO: 664, 
    TIPO: 0
  }

  constructor(private filesystemService: FilesystemService, 
              private dialogRef: MatDialogRef<ArchivoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.actual = (!this.data.CREATE) ? this.data.FOLDER : this.actual;
    this.actual.COD_PADRE = (!this.data.CREATE) ? this.actual.COD_PADRE : this.data.FOLDER.COD_CARPETA;
    if (this.data.CREATE) {
      this.actual.COD_DISCO = this.data.FOLDER.COD_DISCO 
      this.actual.COD_PARTICION = this.data.FOLDER.COD_PARTICION 
    }
    console.log('CREAR O EDITAR ARCHIVO/CARPETA')
    console.log(this.data)
  }

  saveFolder() {
    const result = {
      MESSAGE: '', 
      ROWS_AFFECTED: 0
    }
    if (this.data.CREATE) {
      if (this.actual.TIPO == 1) {
        console.log({
          MESSAGE: 'CREATE FILE', 
          DATA: this.actual
        })
        this.filesystemService.postFile(this.actual).subscribe(
          res => console.log(res), 
          err => console.error(err)
        )
      }
      else {
        console.log({
          MESSAGE: 'CREATE FOLDER', 
          DATA: this.actual
        })
        this.filesystemService.postFolder(this.actual).subscribe(
          res => console.log(res), 
          err => console.error(err)
        )
      }
    }
    else {
      if (this.actual.TIPO == 1) {
        console.log({
          MESSAGE: 'EDIT FILE', 
          DATA: this.actual
        })
        this.filesystemService.updateName(this.actual.COD_CARPETA, this.actual.NOMBRE).subscribe(
          res => {
            console.log(res)
            this.filesystemService.updateContent(this.actual.COD_CARPETA, this.actual.CONTENIDO).subscribe(
              resContent => console.log(resContent)
            )
          }, 
          err => console.error(err)
        )
      }
      else {
        console.log({
          MESSAGE: 'EDIT FOLDER', 
          DATA: this.actual
        })
        this.filesystemService.updateName(this.actual.COD_CARPETA, this.actual.NOMBRE).subscribe(
          res => console.log(res), 
          err => console.error(err)
        )
      }
    }

    this.dialogRef.close(result);
  }
}
