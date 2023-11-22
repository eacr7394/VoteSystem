import { Component } from '@angular/core';

import { IItem } from '../../../lib/smart-table/smart-table.type';
import { UserListService } from './user-list.service';

@Component({
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  providers: [UserListService]
})
export class UserListComponent {

  async ngOnInit(): Promise<void> {
    this.usersData = await this.getUsers();
  }
  constructor(private userListService: UserListService) { }

  title = 'Lista de Propietarios';

  usersData: IItem[] = [];

  async getUsers(): Promise<IItem[]> {

    const users: IItem[] = [];

    (await this.userListService.getUsers()).forEach((value: IItem) => {
      users.push(value);
    });

    return users;
  }
}
