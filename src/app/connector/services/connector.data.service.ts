import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

// Connnector data service that can be injected in components
export class ConnectorService {
  
  constructor(private httpClient: HttpClient) {
  }

  getMembershipStats(url: any):Observable<any>{
    return this.httpClient.get(url);
  } 
  getMembershipStatsByState(url: any):Observable<any>{
    return this.httpClient.get(url);
  }

}