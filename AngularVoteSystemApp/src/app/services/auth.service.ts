import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IndexedDbService } from '../indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + "/auth";

  constructor(private http: HttpClient, private db: IndexedDbService) { }

  async authorize(userName: string, password: string): Promise<Observable<any>> {
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

  async sendChangePasswordRequest(email: string): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}/send-change-password-request/${email}`, {}, options);
  }

  async sendChangePassword(requestId: string, uniqueKey: string, adminId: string, newPassword: string): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}/change-password/${requestId}/${uniqueKey}/${adminId}/${newPassword}`, {}, options);
  }

  async renewToken(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}/renewToken`, {}, options);
  }

  public async isAuthenticated(): Promise<boolean> {

    (this.renewToken()).then(rt => rt.subscribe(
      (response: any) => {
        console.log('RenewToken exitoso', response);
      },
      (response: any) => {
        console.error('Error en el RenewToken', response);
      }
    ));

    let authenticatedObject: any = await this.db.get(this.db.IsAuthenticatedKey);
    let authenticated: boolean = authenticatedObject != null && authenticatedObject.value ? true : false;
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
