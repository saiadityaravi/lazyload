import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { UrlconstantsService } from '../../shared/services/urlconstants.service';

@Injectable()

// Casemanager data service that can be injected in components
export class CaseManagerService {
  
  constructor(private httpClient: HttpClient, private urlconstantsService: UrlconstantsService) {
  }

  // Get member information using memberId
  getMemberInformationByMemberID(url:any): Observable<any> {
    return this.httpClient.get(url);
  }

  // Get member data from EDH and Anthem
  getCareMoreMemberInformation(edhUrl:any,antmUrl:any): Observable<any> {
    return Observable.forkJoin([this.httpClient.get(edhUrl), this.httpClient.get(antmUrl)]);
  }

  // Get Associate Profile data
  getAssociateProfile(url:any): Observable<any> {
    return this.httpClient.get(url);
  }

  // Post member information data
  postMembersData(url: any,body:any): Observable<any> {
    return this.httpClient.post(url,body);
  }

  // Display the Filtered list of members data referred by a casemanager
  getMembersReferredFilteredData(url: any,body:any): Observable<any> {
    return this.httpClient.post(url,body);
  }

  // Display the list of All members data referred by a casemanager
  getMembersReferredByCaseManager(url: any): Observable<any> {
      return this.httpClient.get(url);
  }

  // Get Member Health Details for MemberId  
  getMemberHealthInformation(urlMemberHealth:any):Observable<any>{
    return this.httpClient.get(urlMemberHealth);
  }

  // Get Member Referal Data for MemberId  
  getMemberReferralInformation(urlMemberReferral:any):Observable<any>{
    return this.httpClient.get(urlMemberReferral);

  }

  // Get Member Health Details as well as All Member Referal Data for MemberId
  getMemberHealthandReferralInformation(urlMemberHealth:any,urlMemberReferral:any):Observable<any>{
    let response1 = this.httpClient.get(urlMemberHealth);
    let response2 = this.httpClient.get(urlMemberReferral);
    return Observable.forkJoin([response1, response2]);
  }

  getMembershipStats(url: any):Observable<any>{
    return this.httpClient.get(url);
  } 
  getMembershipStatsByState(url: any):Observable<any>{
    return this.httpClient.get(url);
  }
}