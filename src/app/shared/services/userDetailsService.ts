import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { UrlconstantsService } from './urlconstants.service';
import { SharedService } from './shared.service';
@Injectable()
export class getUser {
    constructor(private httpClient: HttpClient, private urlconstantsService: UrlconstantsService, private http: Http, private messageService: SharedService) {
    }
    urlconstants = this.urlconstantsService.getUrls();
    url: string = environment.getUserUrl;
    searchAssociateUrl: string = environment.searchAssociateUrl;

    // Trying to initialize application   
    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(`initializeApp:: inside promise`);
            setTimeout(() => {
                console.log(`initializeApp:: inside setTimeout`);
                resolve();
            }, 3000);
        });
    }

    // Make API call to LDAP server and get the alias of the user
    getAlias(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            this.http.get(this.url, { withCredentials: true })
                .toPromise()
                .then(data => {
                    let alias = data.json();
                    resolve();
                    sessionStorage.setItem('alias', alias)
                    this.getUserDetails();
                    return alias;
                }
                )
        })
        return promise;
    }

    // Get user details and set whether user is enrolled as phonepal or not
    getUserDetails(): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            let alias = sessionStorage.getItem('alias')
            let secuHeader = new Headers({
                'AccessControlAllowOrigin': '*',
                'ContentType': 'application/json'
            });
            let options = new RequestOptions({ headers: secuHeader });
            this.http.get(this.urlconstants.searchAssociaUrl.replace('{alias}', alias), options)
                .toPromise()
                .then(data => {
                    resolve();
                    if (data.json()) {
                        this.messageService.setPhonepalEnrolled(true);
                    } else {
                        this.messageService.setPhonepalEnrolled(false);
                    }
                    return alias;
                }
                )
            resolve();
        })
        return promise;
    }

    // Check whether user is enrolled or not
    getUserAvailable(): Observable<any> {
        let secuHeader = new Headers({
            'AccessControlAllowOrigin': '*',
            'ContentType': 'application/json'
        });
        let options = new RequestOptions({ headers: secuHeader });
        return this.http.get(this.urlconstants.searchAssociaUrl.replace('{alias}', sessionStorage.getItem('alias')), options).map(data => data.json())
    }


    getUserLdap(url: string): Observable<any> {
        let secuHeader = new Headers({
            'AccessControlAllowOrigin': '*',
            'ContentType': 'application/json'
        });
        let options = new RequestOptions({ headers: secuHeader });
        return this.http.get(url, options).map(data => data.json())
    }

    // Method to enroll phonepal
    enrollPhonepal(url: string, method: string, body: any): Observable<any> {
        let secuHeader = new Headers({
            'AccessControlAllowOrigin': '*',
            'ContentType': 'application/json'
        });
        let options = new RequestOptions({ headers: secuHeader });
        return this.http[method](url, body, options).map(data => data.json())
    }

    // Get the JWT token related to the alias so that it can be used for authorization
    getJwt(): Observable<any> {
        let alias = sessionStorage.getItem('alias')
        let secuHeader = new Headers({
            'AccessControlAllowOrigin': '*',
            'ContentType': 'application/json'
        });
        let options = new RequestOptions({ headers: secuHeader });
        return this.http.get(this.urlconstants.getJwt.replace('{alias}', alias), options).map(data => data.json());
    }

    // Get Associate profile data
    getAssocaiteData(url: string): Observable<any> {
        return this.httpClient.get(url);
    }
    getMemberData(url: string): Observable<any> {
        return this.httpClient.get(url);
    }

    // Update Associate profile data
    updatePhonepal(url: string, method: string, body: any): Observable<any> {
        return this.httpClient.put(url, body);
    }

    // Search Associate data
    searchAssociate(url, body): Observable<any> {
        return this.httpClient.post(url, body)
    }

    // Get total members count, Get Total Associate Count and Get total call duration
    getCounts(url1: any,  url2: any, url3:any): Observable<any> {
        let response1 = this.http.get(url1).map(data=>data.json());
        let response2 = this.http.get(url2).map(data=>data.json());
        let response3 = this.http.get(url3).map(data=>data.json())
        return Observable.forkJoin([response1, response2, response3])
    }

    searchAssociateExists(alias): Observable<any> {
        let secuHeader = new Headers({
            'AccessControlAllowOrigin': '*',
            'ContentType': 'application/json'
        });
        let options = new RequestOptions({ headers: secuHeader });
        return this.http.get(this.urlconstants.searchAssociaUrl.replace('{alias}', alias), options).map(data => data.json())
    }


}