import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modules/User';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  users: User[]

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAll().subscribe(
      res => this.users = <User[]>res
    )
  }

}
