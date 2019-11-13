import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-filesystem',
  templateUrl: './filesystem.component.html',
  styleUrls: ['./filesystem.component.css']
})
export class FilesystemComponent implements OnInit {

  @HostBinding('class') clases = 'filesystem';
  opened: boolean = false;
  toggle_button = 'arrow_forward';

  constructor() { }

  ngOnInit() {
  }

  toggle_menu() {
    this.opened = !this.opened;
    this.toggle_button = (this.opened) ? 'close' : 'arrow_forward';
  }
}
