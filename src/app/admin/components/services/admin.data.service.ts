import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

// Admin data service that can be injected in components
export class AdminService {
  getConnectorMemberCountStats(url: any): any {
    return this.httpClient.get(url);
  }


  
  constructor(private httpClient: HttpClient) {
  }


  getSystemUserStatistics(url:any):Observable<any>{
    return this.httpClient.get(url);
  }
  getPhonePalGrowthStatistics(url:any):Observable<any>{
    return this.httpClient.get(url);
  }
  getMemberByStateByStatusStatistics(url:any):Observable<any>{
    return this.httpClient.get(url);
  }
  getMemberByStateByRiskStatus(url:any):Observable<any>{
    return this.httpClient.get(url);
  }
  getMemberByRiskStatus(url: any): any {
    return this.httpClient.get(url);
  }
  getMemberByStatus(url: any): any {
    return this.httpClient.get(url);
  }
  getConnectorByStatus(url: any): any {
    return this.httpClient.get(url);
  }
  getPhonepalByStatus(url: any): any {
    return this.httpClient.get(url);
  }
}