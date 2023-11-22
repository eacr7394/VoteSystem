import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app.environment';
import { IndexedDbService } from '../../indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class UserCreateService {

  private apiUrl = environment.apiUrl + "/user";

  private apiUnitUrl = environment.apiUrl + "/unit";

  constructor(private http: HttpClient, private db: IndexedDbService) { }

  public async getUnits(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return this.http.get(`${this.apiUnitUrl}`, options);
  }
}
