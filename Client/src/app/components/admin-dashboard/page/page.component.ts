import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/service/info.service';
import { Info } from 'src/app/modules/Info';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';
import { Uri } from 'src/app/modules/Uri';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  info: Info = {
    NOMBRE: '', 
    ABOUT: '', 
    ESLOGAN: '', 
    LOGO: '', 
    MISION: '',
    VIDEO: '', 
    VISION: ''
  }

  video: File;

  constructor(private infoService: InfoService, 
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.infoService.get().subscribe(
      res => {
        this.info = <Info>res[0]
        this.loadInfo();
      }
    )
  }

  loadInfo () {
    this.infoService.get().subscribe(
      res => {
        this.info = res[0];
        this.info.LOGO = `${Uri.INFO}/logo`;
        this.info.VIDEO = `${Uri.INFO}/video`;
      }
    )
  }

  change(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.video = file;
      console.log(this.video);
    }
  }

  update() {
    this.infoService.putVideo(this.video).subscribe(
      res => this.openSnackBar('Video subido', 'snackbar--valid')
    )
  }

  openSnackBar(message: string, snack_class: string) {
    let config = <MatSnackBarConfig<any>>new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['snackbar', snack_class];
    this._snackBar.open(message, undefined, config);
  }
}
