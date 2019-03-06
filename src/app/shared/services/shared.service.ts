import { Injectable, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { shareReplay, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

@Injectable()

// Shared service that can be injected in components
export class SharedService {
    constructor(private httpClient: HttpClient, private http: Http) { }

    public enrollMessage = new Subject<boolean>();
    public iconMessage = new Subject<any>();
    public iconMessageMember = new Subject<any>();
    public updateStatus = new BehaviorSubject<any>(null);
    public dateMessage = new Subject<any>();
    public rowOpenedPhonepal = new Subject<boolean>();
    public rowOpenedMember = new Subject<boolean>();
    public isPhonepalEnrolled = new BehaviorSubject<boolean>(false);
    public phonepalProfile = new BehaviorSubject<boolean>(false);
    public enrollDialogueForm = new BehaviorSubject<boolean>(false);
    public updateProile = new Subject<boolean>();
    public memberData = new Subject<any>();
    public phonepalData = new Subject<any>();
    public memberHealthData = new Subject<any>();
    public memberReferralData = new Subject<any>();
    public memberHealthandReferralData = new Subject<any>();
    public rowOpenedCaseManagerDetailView = new Subject<boolean>();
    public ldapData = new Subject<any>();
    public role = new BehaviorSubject<any>(null);
    public showSpinner = new BehaviorSubject<boolean>(false);
    public showTimeOut = new Subject<any>();
    public stopTimer = new Subject<any>();
    public vref: ViewContainerRef;
    public vrefphonepal: ViewContainerRef;
    public vrefCasemanager: ViewContainerRef;
    private cache$: Observable<any>;
    public addAssociate$ = new  Subject<boolean>();
    public addedAssociate$ = new  Subject<boolean>();
    public status$ = new  BehaviorSubject<boolean>(false);
    public role$ = new  BehaviorSubject<boolean>(false); 

    setEnroolMessage(value) {
        this.enrollMessage.next(value);
    }

    seticonMessage(icon: string, name: string) {
        this.iconMessage.next({ nameIcon: icon, phonepalName: name });
    }

    seticonmemberMessage(icon: string, name: string) {
        this.iconMessageMember.next({ nameIcon: icon, phonepalName: name });
    }


    updateStatusMessage(value: any) {
        this.updateStatus.next(value);
    }

    setRowopenedphonepal(value: boolean) {
        this.rowOpenedPhonepal.next(value)
    }
    setRowOpenedCaseManagerDetailView(value: boolean) {
        this.rowOpenedCaseManagerDetailView.next(value)
    }
    setRowopenedMember(value: boolean) {
        this.rowOpenedMember.next(value)
    }

    setPhonepalEnrolled(value: boolean) {
        this.isPhonepalEnrolled.next(value);
    }


    setPhonepalProfile(value: boolean) {
        this.phonepalProfile.next(value);
    }

    setEnrollDialogue(value: boolean) {
        this.enrollDialogueForm.next(value);
    }

    setDateMessage(status: any, nominationDt: any, welcomeEmailDt: any, trainingCompletionDt: any, nominationApprovalDt: any) {
        this.dateMessage.next({
            status: status,
            nominationDt: nominationDt,
            welcomeEmailDt: welcomeEmailDt,
            trainingCompletionDt: trainingCompletionDt,
            nominationApprovalDt: nominationApprovalDt
        });
    }

    setMemberData(value: any) {
        this.memberData.next(value)
    }

    setUpdateProfile(value: boolean) {
        this.updateProile.next(value);
    }

    setshowSpinner(value: boolean) {
        this.showSpinner.next(value);
    }

    setPhonepalData(value: any) {
        this.phonepalData.next(value)
    }
    setMemberHealthData(value: any) {
        this.memberHealthData.next(value)
    }
    setMemberReferralData(value: any) {
        this.memberReferralData.next(value)
    }
    setMemberHealthandReferralData(value: any) {
        this.memberHealthandReferralData.next(value)
    }
    setTimeoutSubject(value: any) {
        this.showTimeOut.next(value);
    }
    setStopTimer() {
        this.stopTimer.next();
    }
    getDropDownValues(url: string): Observable<any> {
        if (!this.cache$) {
            const timer$ = timer(0, 36000000);
            this.cache$ = timer$.pipe(
                switchMap(_ => this.dropDowns(url)),
                shareReplay(1)
            );
        }
        return this.cache$;
    }

    dropDowns(url): Observable<any> {
        return this.http.get(url).map(res => res.json());
    }

    setView(value: ViewContainerRef) {
        this.vref = value;;
    }

    getView() {
        return this.vref;
    }


    setViewPhonepal(value: ViewContainerRef) {
        this.vrefphonepal = value;;
    }

    getViewPhonepal() {
        return this.vrefphonepal;
    }

    setViewCasemanager(value: ViewContainerRef) {
        this.vrefCasemanager = value;;
    }

    getViewCasemanager() {
        return this.vrefCasemanager;
    }

    setLdapData(value: any, role: any) {
        this.ldapData.next({
            role: role,
            data: value
        })
    }

    getLdapData() {
        return this.ldapData;
    }

    setRole(role: any) {
        this.role.next(role)
    }

    getRole(): Observable<any> {
        return this.role;
    }

    setaddAssociate(value: any) {
        this.addAssociate$.next(value)
    }

    getaddAssociate():Observable<any>{
        return this.addAssociate$;
    }

    setaddedAssociate(value: any) {
        this.addedAssociate$.next(value)
    }

    getaddedAssociate():Observable<any>{
        return this.addedAssociate$;
    }

    setStatus(value:boolean){
        this.status$.next(value)
    }

    setRoleAssociate(value:boolean){
        this.role$.next(value)
    }
}