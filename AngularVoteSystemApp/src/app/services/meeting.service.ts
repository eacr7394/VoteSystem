import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IItem } from '@coreui/angular-pro';
import { map, Observable } from 'rxjs';
import { DateExtensions } from '../../common/date/date.extensions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {

  private apiUrl = environment.apiUrl + "/meeting";

  private dateExtensions: DateExtensions = new DateExtensions();

  constructor(private http: HttpClient) { }


  public async createMeetingAsync(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}`, body, options);
  }

  private async getAllMeetingsAsync(): Promise<Promise<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }

  public async getAllMeetingsPromiseAnyArray(): Promise<any[]> {

    const meetings: any[] = [];

    await (await this.getAllMeetingsAsync()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, value: String(this.dateExtensions.toLocaleDateString(new Date(String(item.date) + "T12:00:00"))) };
        meetings.push(obj);
      });
    });

    return meetings;
  }

  public async getAllMeetingsPromiseObservableIItemArrayAsync(): Promise<Observable<IItem[]>> {
    return (await this.getAllMeetingsAsync()).pipe(
      map((itemArray: []) => {
        let meetings: IItem[] = [];
        itemArray.forEach((item: any) => {     
          let meeting: IItem = {
            Identificador: item.id, 'Fecha de Celebración': this.dateExtensions.toLocaleDateString(new Date(String(item.date) + "T12:00:00")), 'Identificador del Administrador': item.adminId
          };
          meetings.push(meeting);
        });
        return meetings;
      })
    );
  }

}
