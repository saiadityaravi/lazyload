import { Component, OnInit, QueryList, ViewEncapsulation, ViewChild, ViewChildren } from '@angular/core';
import 'rxjs/add/operator/map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Overlay, OverlayConfig, OverlayContainer } from '@angular/cdk/overlay';
import { SharedService } from '../../../shared/services/shared.service';
import { Subscription } from 'rxjs';
import { Portal, TemplatePortalDirective } from '@angular/cdk/portal';
import { Router } from '@angular/router';
import { memberrefrerralDialogueComponent } from '../member-referral-dialoge/member-referral-dialoge';
import { CaseManagerService } from '../../service/casemanager.data.service';
import { MemberList } from '../../model/member-list.model';
import { MemberHealth } from '../../model/memberHealth.model';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { MemberReferral } from '../../model/memberReferral.model';
import { ToastrService } from 'ngx-toastr';
import { memberSearch } from '../../../shared/models/memberSearch.model';
import decode from 'jwt-decode';
import { historyDialogueComponent } from '../referral-history-dialogue/history_dialogue.component';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import{ getformatedDate } from '../../../core/utilities/utilityHelper';
@Component({
    selector: 'app-data-tablelist-member',
    templateUrl: './data-tablelist-member.component.html',
    styleUrls: ['./data-tablelist-member.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('*', style({ height: '*', visibility: 'visible' })),
            transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    encapsulation: ViewEncapsulation.None
})

// Casemanager - Member listing component
export class datatablelistMemberComponent implements OnInit {
    memberData: memberHeader[];
    displayedColumns: string[] = ['expand', 'memberId', 'firstName', 'address', 'birthDate', 'effectiveDt', 'terminationDt', 'preferredLanguage', 'phoneNumber', 'memberTimeZone', 'eligibilityStatus', 'gender'];
    dataSource: MatTableDataSource<memberHeader> = new MatTableDataSource<memberHeader>(this.memberData);
    subTableDisplayedColumns: string[] = ['anySocialSupport', 'hasNooneToTalkTo', 'howOftenMemberLeaveHome', 'liveAlone', 'redFlag', 'refereeName', 'email', 'date', 'contactNumber', 'source'];
    opened: boolean = false;
    iconSubscriptionMember: Subscription;
    updateSubscriptionMember: Subscription;
    searchcriteriaForm: FormGroup;
    searchcriteria: any;
    isLoadingResults: boolean = false;
    rowOpened: boolean = false;
    overlayRef: any;
    rowopenMemberSubscription: Subscription;
    clicked: boolean = false;
    theme = 'togethernessapptheme'
    filteredValue: any = '';
    searchArray: string[];
    aliasName: string = sessionStorage.getItem("alias");
    membersList: Array<MemberList> = [];
    urlConstants: any;
    subMemberReferral: Subscription;
    memberHealthData = new MemberHealth();
    memberReferralData = new MemberReferral();
    refferalHistory: any = null
    memberFilteredSearch = new memberSearch();
    public pageIndex:number;
    public pageSize:number;
    public length:number;
    public arrayVal;
    public arrayState: any[] = [];
    public arrayGender: any[] = [];
    public arrayLanguage: any[] = [];
    public arrayPhonepalStatus: any[] = [];

    @ViewChildren(TemplatePortalDirective) templatePortals: QueryList<Portal<any>>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

    constructor(private toastr: ToastrService, private membersReferred: CaseManagerService, private urlConstantService: UrlconstantsService, private router: Router, private overlayContainer: OverlayContainer, private dialog: MatDialog, public overlay: Overlay, private fb: FormBuilder, public messageService: SharedService) {
        this.urlConstants = this.urlConstantService.getUrls();
        this.populateGrid('All', null);
    }

    // Initialize component, form and subscribe to subject to create an observer
    ngOnInit() {
        this.searchcriteriaForm = this.fb.group({
            memberid: [null],
            firstname: [null],
            lastname: [null],
            eligibilitydate: [null],
            terminationdate: [null],
            language: [null],
            gender: [null],
            city: [null],
            state: [null],
            status: [null],
            referralsource: [null]
        })

        this.rowopenMemberSubscription = this.messageService.rowOpenedCaseManagerDetailView.subscribe(data => {
            this.rowOpened = data;
            this.isLoadingResults = !data;
        })
        this.overlayContainer.getContainerElement().classList.add(this.theme);
        this.router.events.subscribe(() => {
            if (this.opened) {
                this.clearForm()
                this.openDiv(false);
            }
        })

        // Subscribe to the Subject to create an observer
        this.subMemberReferral = this.messageService.memberHealthandReferralData.subscribe(data => {
            if (data) {
                // Display information related to the health details of a member
                this.refferalHistory = data;
                this.memberHealthData.anySocialSupport = data[0].anySocialSupport;
                this.memberHealthData.hasNooneToTalkTo = data[0].hasNooneToTalkTo;
                this.memberHealthData.healthStatusDt = data[0].healthStatusDt;
                this.memberHealthData.howOftenMemberLeaveHome = data[0].howOftenMemberLeaveHome;
                this.memberHealthData.liveAlone = data[0].liveAlone;
                this.memberHealthData.redFlag = data[0].redFlag;

                this.memberReferralData.contactNumber = data[0].contactNumber;
                this.memberReferralData.date = data[0].date;
                this.memberReferralData.email = data[0].email;
                this.memberReferralData.refereeName = data[0].refereeName;
                this.memberReferralData.source = data[0].source;
                this.memberReferralData.notes = data[0].notes;
            }
            this.isLoadingResults = false;
        });
        this.dropDownValues();
    }

    // Populate the combo boxes with values from database
    dropDownValues(){
        let dropdownurl = this.urlConstantService.getUrls().getLookUpValues;
        let url = dropdownurl + "?clientId=1";
        this.messageService.getDropDownValues(url).subscribe(profileData => {
          this.arrayVal = profileData;
          let num:number = 0;
          let i:number;
          for(i = num;i<=this.arrayVal.length;i++) {
            for (let key in profileData[i]) {
                if (key === "State") {
                    let mainObj = profileData[i];
                    this.arrayState = ddlArray(mainObj);
                } else if (key === "Language") {
                    let mainObj = profileData[i];
                    this.arrayLanguage = ddlArray(mainObj);
                } else if (key === "Gender") {
                    let mainObj = profileData[i];
                    this.arrayGender= ddlArray(mainObj);
                } else if (key === "PhonepalStatus") {
                    let mainObj = profileData[i];
                    this.arrayPhonepalStatus = [{ value: "E", viewValue: "Eligible" }, { value: "NE", viewValue: "Not Eligible" }, { value: "P", viewValue: "Pending" }];
                }
            }
          }
        }, (error) => {
          this.messageService.setshowSpinner(false);
        });
    }

    // Open member referral dialog
    referralDialogue() {
        this.openDialog(memberrefrerralDialogueComponent, null, null);
    }

    // Lifecycle hook that is called after Angular has fully initialized a component's view
    ngAfterViewInit() {
        //this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.page.subscribe(
            (event) => console.log(event)
        );        
    }

    // Filter based on value provided by user
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    // Display the list of members All / Filtered data referred by a casemanager
    populateGrid(type: string, body: any) {
        this.isLoadingResults = true;
        let url = "";
        switch (type) {
            case 'All':
                // Get the list of all memebers referred by casemanager using API - caseManager/memberList/{alias}/{page}/{records}
                url = this.urlConstants.getMembersReferredByCaseManager.replace('{alias}/{page}/{records}', decode(sessionStorage.getItem('jwt')).sub +"/0/15");
                this.membersReferred.getMembersReferredByCaseManager(url).subscribe(memberData => {
                    this.memberData = memberData.list;
                    this.pageIndex = 0;
                    this.pageSize = memberData.records;
                    this.length = memberData.totalRecords;
                    this.dataSource.data = this.memberData;
                    this.isLoadingResults = false;
                    this.filteredValue = '';
                    this.searchcriteriaForm.reset();
                }, (error) => {
                    this.isLoadingResults = false;
                    this.toastr.warning('Oops!! Something went wrong with member data, please try again')
                })
                break;
            case 'Filter':
                // Get members referred to casemanager based on search parameters using POST API - /togetherness/searchMembersReferred
                url = this.urlConstants.getMemberReferralSearch;
                this.membersReferred.getMembersReferredFilteredData(url, body).subscribe(memberData => {
                    this.memberData = memberData;
                    this.dataSource.data = this.memberData;
                    this.isLoadingResults = false;
                }, (error) => {
                    this.isLoadingResults = false;
                })
                break;
        }
        this.isLoadingResults = false;
    }

    // Server Side Pagination
    getServerData(event){
        let url = this.urlConstants.getMembersReferredByCaseManager.replace('{alias}/{page}/{records}', decode(sessionStorage.getItem('jwt')).sub +"/"+event.pageIndex+"/"+event.pageSize);
        this.membersReferred.getMembersReferredByCaseManager(url).subscribe(memberData => {
            this.memberData = memberData.list;
            this.length = memberData.totalRecords;
            this.dataSource.data = this.memberData;
            this.isLoadingResults = false;
            this.filteredValue = '';
            this.searchcriteriaForm.reset();
            Promise.resolve().then(() => {
                if (!this.paginator) { return; } 
                this.paginator.length = event.length;
            });
        }, (error) => {
            this.isLoadingResults = false;
            this.toastr.warning('Oops!! Something went wrong with member data, please try again')
        })        
    }

    // Refresh the data populated in the grid
    refresh() {
        this.isLoadingResults = true;
        if (this.filteredValue == "") {
            this.populateGrid('All', null)
        } else {
            this.getfilterValue(this.searchcriteriaForm)
        }
    }

    // Open referral history dialog
    openrefferalHistory() {
        this.openDialog(historyDialogueComponent, this.refferalHistory, '75vw')
    }

    // Toggle Open / Close overlay
    openDiv(closeDiv) {
        let config = new OverlayConfig({
            hasBackdrop: true,
            panelClass: 'ieclass',
            backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy: this.overlay.position().global().centerHorizontally()
        });
        if (!this.opened) {
            this.overlayRef = this.overlay.create(config);
            this.opened = !this.opened;
            this.clicked = true;
            this.overlayRef.attach(this.templatePortals.first);
        } else if (!closeDiv) {
            this.opened = !this.opened;
            this.clicked = false;
            this.overlayRef.detach();
        }
        if (closeDiv) {
            this.opened = !this.opened;
            this.filteredValue = this.getfilterValue(this.searchcriteriaForm)
            this.clicked = false;
            this.overlayRef.detach();
        }
    }

    // Clear the filter and reset the form
    clearForm() {
        if (this.filteredValue !== '') {
            this.populateGrid('All', null);
        } else if (this.searchcriteriaForm.dirty) {
            this.filteredValue = '';
            this.searchcriteriaForm.reset();
        }
    }

    // Apply filter and get results
    getfilterValue(formGroup: FormGroup): string {
        this.memberFilteredSearch.firstname = formGroup.controls.firstname.value;
        this.memberFilteredSearch.lastname= formGroup.controls.lastname.value;
        this.memberFilteredSearch.effectiveDate = formGroup.controls.eligibilitydate.value != null ? getformatedDate(formGroup.controls.eligibilitydate.value) : null;
        this.memberFilteredSearch.terminationDate = formGroup.controls.terminationdate.value != null ? getformatedDate(formGroup.controls.terminationdate.value) : null;
        this.memberFilteredSearch.address = {
            city: formGroup.controls.city.value,
            state: formGroup.controls.state.value
        }
        this.memberFilteredSearch.memberReferral = {
            source: formGroup.controls.referralsource.value,
            alias: decode(sessionStorage.getItem('jwt')).sub
        }
        this.memberFilteredSearch.referralEligibility = formGroup.controls.status.value;
        this.memberFilteredSearch.memberid = formGroup.controls.memberid.value;
        this.memberFilteredSearch.preferredLanguage = formGroup.controls.language.value;
        this.memberFilteredSearch.gender = formGroup.controls.gender.value;
        let body = this.memberFilteredSearch;
        var searchData: string;
        var counterBoolean: boolean = false;
        this.populateGrid('Filter', body);
        var searchData: string;
        var counterBoolean: boolean = false;
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control.value != null && !counterBoolean && control.value != "") {
                counterBoolean = true
                searchData = control.value
                if (field == "eligibilitydate" || field == "terminationdate") {
                    searchData = getformatedDate(control.value)
                }
            } else if (control.value != null && control.value != "" && counterBoolean && (field != "eligibilitydate" && field != "terminationdate")) {
                searchData = searchData + " | " + control.value
            } else if (control.value != null && control.value != "" && counterBoolean && (field == "eligibilitydate" || field == "terminationdate")) {
                searchData = searchData + " | " + getformatedDate(control.value)
            }
        });

        return searchData;
    }

  /**
    * Function to check whether an object is empty or not
    * 
    * @param obj - Object to be checked
    */
    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    isEmptyObjectRefferal(obj) {
        if (obj && (Object.keys(obj).length === 0) == null) {
            return false
        } else if (obj && (Object.keys(obj).length === 0) == false) {
            return true;
        }

        return (obj && (Object.keys(obj).length === 0));
    }

    // Open member referral or referral history dialog
    openDialog(dialogPopup: any, data: any, width:any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = width!==null? width: '680px';
        dialogConfig.data = data;
        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(dialogPopup, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if(!dialogRef._containerInstance._config.data){
                this.populateGrid('All', null);
                this.rowOpened = false;
            }
        });
       
        
    }

    ngOnDestroy() {
        // this.iconSubscriptionMember.unsubscribe();
        // this.updateSubscriptionMember.unsubscribe();
    }

}

export interface memberHeader {
    memberId: any,
    title: string,
    firstName: string,
    lastName: string,
    effectiveDt: any,
    terminationDt: any,
    eligibilityStatus: string,
    productPlan: string,
    preferredLanguage: string,
    memberTimeZone: string,
    gender: string,
    birthDate: any,
    ethnicity: string,
    memberReferral: any;
    address: any;
    phoneNumber: any,
    alternatePhoneNum: any,
    memberPCPName: string,
    memberPCPPhoneNum: any,
    additionalComment: string,
    clientId: any,
    subClientId: any,
    createdDt: any,
    createdBy: string,
    updatedDt: any,
    updatedBy: string,
    actions: any[]
}

