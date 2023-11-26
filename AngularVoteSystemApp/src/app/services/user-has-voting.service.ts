import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { IItem } from '@coreui/angular-pro';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHasVotingService {

  private apiUrl = environment.apiUrl + "/userhasvoting";

  constructor(private http: HttpClient) { }

  public async generateAllUserHasVoteAsync(votingId: string): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}/${votingId}`, {}, options);
  }

  private async getAllUserHasVotingsAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }

  public async getAllUserHasVotingsPromiseObservableIItemArray(): Promise<Observable<IItem[]>> {
    return await (await this.getAllUserHasVotingsAsync()).pipe(
      map((itemArray: []) => {
        let votings: IItem[] = [];
        itemArray.forEach((item: any) => {
          let voting: IItem = {
            'Tema': item.votingDescription, 'Fecha Asamblea': item.meetingDate,
            'Casa': item.unitNumber, '¿Vota?': item.canVote === "yes" ? "Sí" : "No",
            'A Favor': item.accepted === "yes" ? "Sí" : (item.accepted === "no" ? "No" : "No ha votado"),
            'Enviada': item.send === "yes" ? "Sí" : "No",
            'Fecha de Voto': item.votedTime
          };
          console.log(item);
          votings.push(voting);
        });
        return votings;
      })
    );
  }

}
