import { Component, OnInit, Inject } from '@angular/core';
import { Folder } from 'src/app/modules/Folder';
import { FilesystemService } from 'src/app/service/filesystem.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css']
})
export class MoveComponent implements OnInit {

  movingFolder: Folder = {
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
  folders: Folder[];
  history: Array<Folder> = [];

  nuevo_padre: number;

  constructor(private filesystemService: FilesystemService, 
              private dialogRef: MatDialogRef<MoveComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.movingFolder = this.data.FOLDER
    this.history = this.data.HISTORY
  }

  move() {
    let data = {
      COD_CARPETA: this.movingFolder.COD_CARPETA, 
      NOMBRE: this.movingFolder.NOMBRE, 
      OLD_PADRE: this.movingFolder.COD_PADRE, 
      NEW_PADRE: this.nuevo_padre
    }
    console.log(data)
    this.filesystemService.moveContent(data.COD_CARPETA, data.NOMBRE, data.NEW_PADRE).subscribe(
      res => {
        console.log(res)
        this.dialogRef.close(res)
      }
    )
  }

  folderPick(pick: Folder) {
    if (pick.COD_CARPETA != this.movingFolder.COD_CARPETA && 
        pick.COD_PADRE != this.movingFolder.COD_CARPETA) {
      this.nuevo_padre = pick.COD_CARPETA 
      this.history.push(pick);
      this.filesystemService.getFolderContent(pick.COD_PARTICION, pick.COD_CARPETA).subscribe(
        res => {
          this.folders = <Folder[]>res
          console.log(this.folders)
        }, 
        err => console.error(err)
      )
    }
  }

  returnTo(folder: Folder) {
    this.filesystemService.getFolderContent(folder.COD_PARTICION, folder.COD_CARPETA).subscribe(
      res => {
        this.folders = <Folder[]>res
        this.history = this.history.slice(0, this.history.indexOf(folder) + 1)
      }
    )
  }

}
