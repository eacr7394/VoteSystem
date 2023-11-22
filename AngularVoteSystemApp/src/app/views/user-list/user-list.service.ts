import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app.environment';
import { IndexedDbService } from '../../indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class UserListService {

  private apiUrl = environment.apiUrl + "/user";

  constructor(private http: HttpClient, private db: IndexedDbService) { }

  public async getUsers(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };          
    return this.http.get(`${this.apiUrl}`, options);
  }

}
