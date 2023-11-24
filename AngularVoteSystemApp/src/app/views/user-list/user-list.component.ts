import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IItem } from '@coreui/angular-pro';

import { UserService } from '../../services/user.service';

@Component({
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  providers: [UserService],
})
export class UserListComponent {

  constructor(private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.usersData$ = await this.userService.getAllUsersPromiseObservableIItemArrayAsync();
  }

  title = 'Lista de Propietarios';

  usersData$!: Observable<IItem[]>;

}
