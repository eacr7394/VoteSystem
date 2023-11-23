import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../app.environment';
import { IndexedDbService } from '../../../indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private apiUrl = environment.apiUrl + "/auth";

  constructor(private http: HttpClient, private db: IndexedDbService) { }

  async login(userName: string, password: string): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}/authorize`, { username: userName, password: password }, options);
  }

  async logout(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}/logout`, {}, options);
  }

  public async isAuthenticated(): Promise<boolean> {
    let authenticatedObject: any = await this.db.get(this.db.IsAuthenticatedKey);
    let authenticated: boolean = authenticatedObject != null && authenticatedObject ? true : false;
    return authenticated;
  }

  public async getUserId(): Promise<string> {
    let userId: string = await this.db.get(this.db.UserIdKey);
    return userId;
  }

  public async hasRole(role: any): Promise<boolean> {
    return true;
  }
}
