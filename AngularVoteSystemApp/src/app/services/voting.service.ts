import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { IItem } from '@coreui/angular-pro';
import { map, Observable } from 'rxjs';
import { DateExtensions } from '../../common/date/date.extensions';

@Injectable({
  providedIn: 'root',
})
export class VotingService {

  private apiUrl = environment.apiUrl + "/voting";

  private dateExtensions: DateExtensions = new DateExtensions();

  constructor(private http: HttpClient) { }


  public async createVotingAsync(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}`, body, options);
  }

  private async getVotingsAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }

  public async getAllVotingsPromiseAnyArray(): Promise<any[]> {

    const meetings: any[] = [];

    await (await this.getVotingsAsync()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, value: item.description };
        meetings.push(obj);
      });
    });

    return meetings;
  }

  public async getAllVotingsPromiseObservableIItemArray(): Promise<Observable<IItem[]>> {
    return await (await this.getVotingsAsync()).pipe(
      map((itemArray: []) => {
        let votings: IItem[] = [];
        itemArray.forEach((item: any) => {
          let voting: IItem = {
            'Identificador de Votación': item.id, 'Fecha de Asamblea': this.dateExtensions.toLocaleDateString(item.meetingDate),
            'Descripción': item.description
          };
          console.log(item);
          votings.push(voting);
        });
        return votings;
      })
    );
  }

}
