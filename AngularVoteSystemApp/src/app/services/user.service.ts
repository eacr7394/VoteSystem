import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { IItem } from '@coreui/angular-pro';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = environment.apiUrl + "/user";

  constructor(private http: HttpClient) { }

  private async getAllUsersAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };          
    return await this.http.get(`${this.apiUrl}`, options);
  }

  public async createUserAsync(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}`, body, options);
  }

  public async getAllUsersPromiseObservableIItemArrayAsync(): Promise<Observable<IItem[]>> {
    return (await this.getAllUsersAsync()).pipe(
      map((itemArray: []) => {
        let users: IItem[] = [];
        itemArray.forEach((item: any) => {
          let user: IItem = {
            Correo: item.email, Nombre: item.name, Apellido: item.lastname,
            '# de Casa': item.unitNumber, Creado: new Date(item.created).toLocaleString()
          };
          users.push(user);
        });
        return users;
      })
    );
  }
}
