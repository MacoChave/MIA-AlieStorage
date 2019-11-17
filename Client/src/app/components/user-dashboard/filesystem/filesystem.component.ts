import { Component, OnInit, HostBinding } from '@angular/core';
import { FilesystemService } from 'src/app/service/filesystem.service';
import { Disk } from 'src/app/modules/Disk';
import { User } from 'src/app/modules/User';
import { Partition } from 'src/app/modules/Partition';
import { Folder } from 'src/app/modules/Folder';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Result } from 'src/app/modules/Result';

@Component({
  selector: 'app-filesystem',
  templateUrl: './filesystem.component.html',
  styleUrls: ['./filesystem.component.css']
})
export class FilesystemComponent implements OnInit {

  @HostBinding('class') clases = 'filesystem';
  opened: boolean = false;
  toggle_button = 'arrow_forward';
  
  disks: Disk[];
  parts: Partition[];
  folders: Folder[];
  user: User = {};

  history: Array<Folder> = [];

  label = {
    DISCO: 0, 
    PARTICION: 0, 
    FOLDER: 0
  }
  result: Result;

  constructor(private fsService: FilesystemService, 
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('session'));
    this.fsService.getDisk(this.user.COD_USUARIO).subscribe(
      res => {
        this.disks = <Disk[]>res;
        console.info(this.disks);
      }
    )
  }

  toggle_menu() {
    this.opened = !this.opened;
    this.toggle_button = (this.opened) ? 'close' : 'arrow_forward';
  }

  changeDisk() {
    this.fsService.getParts(this.label.DISCO).subscribe(
      res => {
        this.parts = <Partition[]>res
        console.info(this.parts)
      }, 
      err => console.error(err)
    )
  }

  changePart() {
    this.fsService.getRootContent(this.label.PARTICION).subscribe(
      res => this.folders = <Folder[]>res, 
      err => console.error(err)
    )
  }

  getChildren(folder: Folder) {
    if (folder.TIPO == 1) {
      // TODO: OPEN TEXT EDITOR
    }
    else {
      this.history.push(folder);
      this.fsService.getFolderContent(folder.COD_PARTICION, folder.COD_CARPETA).subscribe(
        res => {
          this.folders = <Folder[]>res
          console.log(this.folders)
        }, 
        err => console.error(err)
      )
    }
  }

  returnTo(folder: Folder) {
    this.fsService.getUpTo(folder.COD_PARTICION, folder.COD_CARPETA).subscribe(
      res => {
        this.folders = <Folder[]>res
        this.history = this.history.slice(0, this.history.indexOf(folder))
      }
    )
  }

  add(folder: Folder) {

  }

  edit(folder: Folder) {
  }

  delete(folder: Folder) {
    this.fsService.deleteFolder(folder.COD_CARPETA).subscribe(
      res => {
        this.result = <Result>res;
        if (this.result.ROWS_AFFECTED == 1) this.openSnackBar(`Se eliminó ${folder.NOMBRE} con éxito`, 'snackbar--valid')
        else this.openSnackBar(`No eliminó ${folder.NOMBRE}`, 'snackbar--invalid')
      }
    )
  }

  openSnackBar(message: string, snack_class: string) {
    let config = <MatSnackBarConfig<any>>new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['snackbar', snack_class];
    this._snackBar.open(message, undefined, config);
  }

}