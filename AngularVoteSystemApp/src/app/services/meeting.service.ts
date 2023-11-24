import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../app.environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {

  private apiUrl = environment.apiUrl + "/meeting";

  constructor(private http: HttpClient) { }


  public async createMeetingAsync(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}`, body ,options);
  }

  public async getAllMeetingsAsync(): Promise<Promise<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }

}
