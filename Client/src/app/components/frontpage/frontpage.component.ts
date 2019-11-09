import { Component, OnInit, HostBinding } from '@angular/core';
import { Info } from 'src/app/modules/Info';
import { InfoService } from 'src/app/service/info.service';
import { Router } from '@angular/router';
import { Uri } from 'src/app/modules/Uri';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  @HostBinding('class') clases = 'homepage';

  info: Info = {
    NOMBRE: '',
    ESLOGAN: '', 
    LOGO: '', 
    VIDEO: '', 
    MISION: '', 
    VISION: '', 
    ABOUT: ''
  }

  constructor(
    private infoService: InfoService, 
    private router: Router
  ) { }

  ngOnInit() {
    this.loadInfo();
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
}
