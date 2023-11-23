import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app.environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingListService {

  private apiUrl = environment.apiUrl + "/meeting";

  constructor(private http: HttpClient) { }

  public getMeetings(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };          
    return this.http.get(`${this.apiUrl}`, options);
  }

}
