import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';  
import { map, Observable } from 'rxjs';
import { IItem } from '@coreui/angular-pro';

@Injectable({
  providedIn: 'root',
})
export class AssistantService {

  private apiUrl = environment.apiUrl + "/assistant";       

  constructor(private http: HttpClient) { }
             

  public async createAssistantAsync(body: any): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.post(`${this.apiUrl}`, body ,options);
  }


  private async getAllAssistantsAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }

  public async getAllAssistantsPromiseObservableIItemArrayAsync(): Promise<Observable<IItem[]>> {
    return (await this.getAllAssistantsAsync()).pipe(
      map((itemArray: []) => {
        let assistants: IItem[] = [];
        itemArray.forEach((item: any) => {
          let assistant: IItem = {
            '# de Casa': item.unitNumber, 'Fecha de Asamblea': item.meetingDate,
            Vota: 'yes' === item.canVote ? "Sí" : "No"
          };
          console.log(item);
          assistants.push(assistant);
        });
        return assistants;
      })
    );
  }

}
