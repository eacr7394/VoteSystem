import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../app.environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private apiUrl = environment.apiUrl + "/auth";

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',    
    });
    const options = { headers, withCredentials: true };
    return this.http.post(`${this.apiUrl}/authorize`, { username: userName, password: password }, options);
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return this.http.post(`${this.apiUrl}/logout`, {}, options);
  }
}
