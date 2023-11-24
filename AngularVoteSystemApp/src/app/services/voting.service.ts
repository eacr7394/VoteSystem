import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../app.environment';

import { IItem } from '@coreui/angular-pro';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VotingService {

  private apiUrl = environment.apiUrl + "/voting";       

  constructor(private http: HttpClient) { }
             

  public async createVotingAsync(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}`, body ,options);
  }

  private async getVotingsAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }

  public async getAllVotingsPromiseObservableIItemArray(): Promise<Observable<IItem[]>> {
    return (await this.getVotingsAsync()).pipe(
      map((itemArray: []) => {
        let votings: IItem[] = [];
        itemArray.forEach((item: any) => {
          let voting: IItem = {
            '# de Casa': item.unitNumber, 'Fecha de Asamblea': item.meetingDate,
            Vota: 'yes' === item.canVote ? "Sí" : "No"
          };
          console.log(item);
          votings.push(voting);
        });
        return votings;
      })
    );
  }

}
