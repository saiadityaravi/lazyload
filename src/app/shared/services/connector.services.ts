import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlconstantsService } from './urlconstants.service';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class connectorServices {
    constructor(private httpClient: HttpClient, private urlconstantsService: UrlconstantsService) {
    }
    urlconstants = this.urlconstantsService.getUrls();

    // Get All Member Information
    getAllMembers(url: any): Observable<any> {
        return this.httpClient.get(url)
    }

    // Get search associate data
    getAllPhonepals(url: any, body: any): Observable<any> {
        return this.httpClient.post(url, body)
    }

    getAssignedMember(meberAssignedUrl: string): Observable<any> {
        return this.httpClient.get(meberAssignedUrl)
    }

    getAssignedPhonepal(phonepalAssignedUrl: string): Observable<any> {
        return this.httpClient.get(phonepalAssignedUrl)
    }

    getmemberInformationandInteraction(requestUrl1, requestUrl2, requestUrl3): Observable<any[]> {
        let response1 = this.httpClient.get(requestUrl1);
        let response2 = this.httpClient.get(requestUrl2);
        let response3 = this.httpClient.get(requestUrl3);
        return Observable.forkJoin([response1, response2, response3]);
    }

    getPhonepalInformationandInteraction(getAssociateProfileUrl: any, memberInteractionUrl: any, memberReferralUrl: any): Observable<any> {
        let response1 = this.httpClient.get(getAssociateProfileUrl);
        let response2 = this.httpClient.get(memberInteractionUrl);
        let response3 = this.httpClient.get(memberReferralUrl);
        return Observable.forkJoin([response2, response1, response3]);
    }

    getMemberInteraction(url: any, url2:any): Observable<any> {
        let response1 = this.httpClient.get(url);
        let response2 = this.httpClient.get(url2);
        return Observable.forkJoin([response1, response2]);
    }

    getPhonepalFilteredData(url: any, body: any): Observable<any> {
        return this.httpClient.post(url, body)
    }

    getMemberFilteredData(url: any, body: any): Observable<any> {
        return this.httpClient.post(url, body)
    }

    assignAssociateMember(url: any, body: any): Observable<any> {
        return this.httpClient.post(url, body)
    }

    unAssignMember(url): Observable<any> {
        return this.httpClient.put(url,"")
    }

    getMemberNotes(url): Observable<any> {
        return this.httpClient.get(url)
    }

    updateAssociateTrainingStatus(url1: any, body1: any, url2: any, body2: any): Observable<any> {
        let response1 = this.httpClient.put(url1, body1);
        let response2 = this.httpClient.put(url2, body2);
        return Observable.forkJoin([response1, response2])
    }

  
    unassignAssociateMember(url: any, body: any): Observable<any> {
        return this.httpClient.put(url, body)
    
    }

    roleChange(url:any, body:any):Observable<any>{
        return this.httpClient.put(url, body)
    }

}