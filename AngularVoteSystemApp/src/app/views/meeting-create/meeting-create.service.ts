import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app.environment';
import { IndexedDbService } from '../../indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingCreateService {

  private apiUrlUser = environment.apiUrl + "/meeting"; 
  constructor(private http: HttpClient, private db: IndexedDbService) { }


  public async createMeeting(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return this.http.post(`${this.apiUrlUser}`, body ,options);
  }
}
