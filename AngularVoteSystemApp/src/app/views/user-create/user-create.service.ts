import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../app.environment';
import { IndexedDbService } from '../../indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class UserCreateService {

  private apiUrl = environment.apiUrl + "/user";

  constructor(private http: HttpClient, private db: IndexedDbService) { }
            
}
