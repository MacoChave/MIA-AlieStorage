import { Component, HostBinding } from '@angular/core';
import { Info } from './modules/Info';
import { InfoService } from './service/info.service';
import { Router } from '@angular/router';
import { Uri } from './modules/Uri';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostBinding('class') cases = 'main';
  
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
