import { Component, OnInit, HostBinding } from '@angular/core';
import { FilesystemService } from 'src/app/service/filesystem.service';
import { Disk } from 'src/app/modules/Disk';
import { User } from 'src/app/modules/User';
import { Partition } from 'src/app/modules/Partition';
import { Folder } from 'src/app/modules/Folder';

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

  constructor(private fsService: FilesystemService) {}

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
    this.history.push(folder);
    this.fsService.getFolderContent(folder.COD_PARTICION, folder.COD_CARPETA).subscribe(
      res => {
        this.folders = <Folder[]>res
        console.log(this.folders)
      }, 
      err => console.error(err)
    )
  }

  returnTo(folder: Folder) {
    this.fsService.getUpTo(folder.COD_PARTICION, folder.COD_CARPETA).subscribe(
      res => {
        this.folders = <Folder[]>res
        this.history = this.history.slice(0, this.history.indexOf(folder))
      }
    )
  }
}