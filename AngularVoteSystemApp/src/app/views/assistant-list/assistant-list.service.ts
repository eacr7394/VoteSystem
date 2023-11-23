import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app.environment';

@Injectable({
  providedIn: 'root',
})
export class AssistantListService {

  private apiUrl = environment.apiUrl + "/assistant";

  constructor(private http: HttpClient) { }

  public async getAssistantsAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };          
    return await this.http.get(`${this.apiUrl}`, options);
  }

}
