import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';               

@Injectable({
  providedIn: 'root',
})
export class UnitService {


  private apiUrl = environment.apiUrl + "/unit";

  constructor(private http: HttpClient) { }

  private async getAllUnitsAsync(): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers, withCredentials: true };
    return await this.http.get(`${this.apiUrl}`, options);
  }


  public async getAllUnitsPromiseAnyArrayAsync(): Promise<any[]> {
    const units: any[] = [];   
    await (await this.getAllUnitsAsync()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, number: String(item.number) };
        units.push(obj);
      });
    });
    return units;
  }
}
