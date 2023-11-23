import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IItem } from '../../../lib/smart-table/smart-table.type';
import { UserListService } from './user-list.service';

@Component({
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  providers: [UserListService],
})
export class UserListComponent implements OnInit {

  title = 'Lista de Propietarios';

  usersData$!: Observable<IItem[]>;

  constructor(private userListService: UserListService) { }

  async ngOnInit(): Promise<void> {
    this.usersData$ = await this.getUsers();
  }

  private async getUsers(): Promise<Observable<IItem[]>> {
    return (await this.userListService.getAllUsersAsync()).pipe(
      map((itemArray: []) => {
        let users: IItem[] = [];
        itemArray.forEach((item: any) => {
          let user: IItem = {
            Correo: item.email, Nombre: item.name, Apellido: item.lastname,
            '# de Casa': item.unitNumber, Creado: new Date(item.created).toLocaleString(),
            Actualizado: new Date(item.updated).toLocaleString()
          };
          users.push(user);
        });
        return users;
      })
    );
  }
}
