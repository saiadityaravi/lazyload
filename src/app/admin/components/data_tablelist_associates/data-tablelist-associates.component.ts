import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import 'rxjs/add/operator/map';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { OverlayConfig, Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Portal, TemplatePortalDirective } from '@angular/cdk/portal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getformatedDate } from '../../../core/utilities/utilityHelper';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { connectorServices } from '../../../shared/services/connector.services';
import { userFiltered } from '../../models/userFilter.model';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { userHeader } from '../../models/usertable.model'
import { addAssociate } from '../add-associate-dialoge/add-associate-dialoge';
import { memberAssignDialogueComponent } from '../member-assign-dialogue/member-assign-dialogue.component';
import { ConfirmDialogue } from '../confirmDialogue/confirmDialogue.component';
import { memberUnassignDialogueComponent } from '../member-unassign-dialogue/member-unassign-dialogue.component';

@Component({
    selector: 'app-data-tablelist-phonepal',
    templateUrl: './data-tablelist-associates.component.html',
    styleUrls: ['./data-tablelist-associates.component.scss'],
})

// List Associates Component
export class datatablelistassociatesComponent implements OnInit {
    phonepalData: userHeader[] = [];
    displayedColumns: string[] = ['firstName', 'address', 'language', 'availabilityStartDt', 'phoneNumber', 'timezone', 'status', 'membersConnected', 'actions'];
    dataSource: MatTableDataSource<userHeader> = new MatTableDataSource<userHeader>(this.phonepalData);;
    updateSubscription: Subscription;
    iconSubscription: Subscription;
    memberDataInformation: Subscription;
    statusSubscription: Subscription;
    roleSubscription: Subscription;
    rowopenphonepalSubscription: Subscription;
    searchcriteriaForm: FormGroup;
    userFilteredSearch = new userFiltered();
    bsConfig: Partial<BsDatepickerConfig>;
    pageNumber: number = sessionStorage.getItem("pagenumAsso") ? parseInt(sessionStorage.getItem("pagenumAsso")) : 0;
    offset: number = sessionStorage.getItem("offsetAsso") ? parseInt(sessionStorage.getItem("offsetAsso")) : 15;
    length: number;
    public theme: string = 'profilepagetheme';
    public overlayTheme: string = 'togethernessapptheme';
    public clicked: boolean = false;
    public opened: boolean = false;
    public searchcriteria: any;
    public overlayRef: any;
    public filteredValue: any = '';
    public urlConstants: any;
    public searchRole: string = 'phonepal';
    public isLoadingResults: boolean = false;
    public rowOpened: boolean = false;
    role: string;
    public searchArray: string[];
    public arrayVal;
    public arrayState: any[] = [];
    public arrayTimeZone: any[] = [];
    public arrayLanguage: any[] = [];
    public arrayPhonepalStatus: any[] = [];
    actions = [
        {
            "iconName": "user-plus",
            "desc": "Assign Member"
        }, {
            "iconName": "exchange",
            "desc": "Switch Roles"
        }, {
            "iconName": "toggle-on",
            "desc": "Switch status"
        }, {
            "iconName": "user-times",
            "desc": "Unassign Member"
        }
    ]
    @ViewChildren(TemplatePortalDirective) templatePortals: QueryList<Portal<any>>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private activatedRoute: ActivatedRoute, private toastr: ToastrService, private memberDetails: connectorServices, private router: Router, private urlConstantService: UrlconstantsService, private overlayContainer: OverlayContainer, private dialog: MatDialog, public overlay: Overlay, private fb: FormBuilder, public messageService: SharedService) {
        this.activatedRoute.url.subscribe(url => {
            sessionStorage.setItem('filterAsso', '');
            sessionStorage.setItem('filterDispAsso', '');
            sessionStorage.setItem('pageNumFilAsso', '');
            sessionStorage.setItem('pageSizeFilAsso', '');
            sessionStorage.setItem('offsetAsso', '');
            sessionStorage.setItem('pagenumAsso', '');
        })
        let path = this.activatedRoute.snapshot['_routerState'].url ? this.activatedRoute.snapshot['_routerState'].url : null;
        if (path != null) {
            this.role = path.substring(path.lastIndexOf("/") + 1, path.length - 1)
        }
        // Get Search Associate Data
        if (sessionStorage.getItem('filterAsso')) {
            this.urlConstants = this.urlConstantService.getUrls();
            let url = this.urlConstants.getAllPhonepals;
            this.filteredValue = sessionStorage.getItem('filterDispAsso');
            this.getfilterValueService(url, sessionStorage.getItem('filterAsso'))
        } else {
            this.getPhonepalData(0, this.offset);
        }
        this.bsConfig = Object.assign({}, { containerClass: "theme-default", rangeInputFormat: 'MM/DD/YYYY', showWeekNumbers: false });
    }

  /**
   * Function to get search associate data
   *
   * @param pageNumber - Current page number
   * @param offset - Page Size
   */
    getPhonepalData(pageNumber, offset) {
        this.urlConstants = this.urlConstantService.getUrls();
        let url = this.urlConstants.getAllPhonepals;
        let body;
        this.isLoadingResults = true;
        if (this.searchcriteriaForm ? this.searchcriteriaForm.dirty : false) {
            this.userFilteredSearch = this.searchcriteriaForm.value;
            body = this.userFilteredSearch;
        } else {
            body = `{
                "pageNumber": ${pageNumber},
                "pageSize": ${offset},
                "roleDesc":"${this.role}" 
              }`
        }
        // Get Search Associate Data
        this.memberDetails.getAllPhonepals(url, body).subscribe(phonepalData => {
            this.length = phonepalData.totalRecords;
            this.phonepalData = phonepalData.list;
            this.dataSource.data = this.phonepalData;
            this.isLoadingResults = false;
            sessionStorage.setItem("pagenumAsso", JSON.stringify(this.paginator.pageIndex))
            sessionStorage.setItem("offsetAsso", JSON.stringify(this.paginator.pageSize))
        }, (error) => {
            this.isLoadingResults = false;
            this.toastr.warning("Oops!!, something went wrong with Phonepal Data")
        })
    }

    // Refresh page content
    refresh() {
        if (this.filteredValue != '') {
            this.getfilterValue(this.searchcriteriaForm)
        } else {
            this.getPhonepalData(sessionStorage.getItem("pagenumAsso"), sessionStorage.getItem("offsetAsso"));
        }
    }

    // Open Add Associate dialog box
    referralDialogue() {
        this.messageService.setRole(this.role)
        this.openDialog(addAssociate, null, "650px", null);
    }
    /**
     * 
     * @param iconName
     * @param memberID 
     */
    test(action: string, member) {
        if (action.includes('plus')) {
            this.openDialog(memberAssignDialogueComponent, member, "1000px", 'add');
        } else if (action.includes('times')) {
            this.openDialog(memberUnassignDialogueComponent, member, "1000px", 'remove');
        } else {
            this.openDialog(ConfirmDialogue, member, "250px", action)
        }
    }

  /**
   * Function invoked when user clicks on page number / change page size
   *
   * @param event - Page event from angular material paginator component
   */
    onPaginateChange(event) {
        if (this.filteredValue !== '') {
            let url = this.urlConstants.getAllPhonepals;
            sessionStorage.setItem('pageNumFilAsso', JSON.stringify(event.pageIndex));
            sessionStorage.setItem('pageSizeFilAsso', JSON.stringify(event.pageSize));
            var temp = JSON.parse(sessionStorage.getItem('filterAsso'));
            temp.pageNumber = event.pageIndex;
            temp.pageSize = event.pageSize;
            this.getfilterValueService(url, JSON.stringify(temp))
        } else {
            sessionStorage.setItem("pagenumAsso", JSON.stringify(event.pageIndex))
            sessionStorage.setItem("offsetAsso", JSON.stringify(event.pageSize))
            this.getPhonepalData(event.pageIndex, event.pageSize)
        }
    }

    // Initialize component, form and subscribe to the subject to create an observer
    ngOnInit() {
        this.searchcriteriaForm = this.fb.group({
            firstName: [null],
            lastName: [null],
            city: [null],
            state: [null],
            language: [null],
            phoneNumber: [null],
            timezone: [null],
            status: [null],
            availability: [null],
            roleDesc: 'phonepal',
            trainingCompletionDt: [null],
            nominationApprovalDt: [null],
            nominationDt: [null]
        })
        this.iconSubscription = this.messageService.iconMessage.subscribe(data => {
            this.action(data)
        })
        this.updateSubscription = this.messageService.getaddedAssociate().subscribe(data => {
            if (data) {
                this.getPhonepalData(this.pageNumber, this.offset);
            }
        })
        this.overlayContainer.getContainerElement().classList.add(this.overlayTheme);

        this.router.events.subscribe(() => {
            if (this.opened) {
                this.clearForm()
                this.openDiv(false);
            }
        })
        this.iconSubscription = this.messageService.updateStatus.distinctUntilChanged().subscribe(data => {
            if (data == "assigmentsuccessful") {
                this.refresh()
                this.messageService.updateStatusMessage('')
            }
        })

        this.statusSubscription = this.messageService.status$.distinctUntilChanged().subscribe(data=>{
            if(data){
                this.messageService.status$.next(false);
                this.refresh()
            }
        })

        this.roleSubscription = this.messageService.role$.distinctUntilChanged().subscribe(data=>{
            if(data){
                this.messageService.role$.next(false);
                this.refresh()
            }
        })
        this.dropDownValues();
    }

    // Populate the dropdowns based on the data from database
    dropDownValues() {
        let dropdownurl = this.urlConstantService.getUrls().getLookUpValues;
        let url = dropdownurl + "?clientId=1";
        this.messageService.getDropDownValues(url).subscribe(profileData => {
            this.arrayVal = profileData;
            let num: number = 0;
            let i: number;
            for (i = num; i <= this.arrayVal.length; i++) {
                for (let key in profileData[i]) {
                    if (key === "State") {
                        let mainObj = profileData[i];
                        this.arrayState = ddlArray(mainObj);
                    } else if (key === "Language") {
                        let mainObj = profileData[i];
                        this.arrayLanguage = ddlArray(mainObj);
                    } else if (key === "TimeZone") {
                        let mainObj = profileData[i];
                        this.arrayTimeZone = ddlArray(mainObj);
                    } else if (key === "PhonepalStatus") {
                        let mainObj = profileData[i];
                        this.arrayPhonepalStatus = ddlArray(mainObj);
                    }
                }
            }
        }, (error) => {
            this.messageService.setshowSpinner(false);
        });
    }

  /**
    * Function to check whether an object is empty or not
    * 
    * @param obj - Object to be checked
    */
    isEmptyObjectRefferal(obj) {
        if (obj && (Object.keys(obj).length === 0) == null) {
            return false
        } else if (obj && (Object.keys(obj).length === 0) == false) {
            return true;
        }

        return (obj && (Object.keys(obj).length === 0));
    }

    // Lifecycle hook that is called after Angular has fully initialized a component's view
    ngAfterViewInit() {
        if (this.filteredValue !== '') {

        } else {
            this.dataSource.sort = this.sort;
            this.paginator.pageIndex = sessionStorage.getItem("pagenumAsso") ? parseInt(sessionStorage.getItem("pagenumAsso")) : 0;
        }
    }

    // Filter based on value provided by user
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    // Open Search Criteria form overlay
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

    // Clear filter and get search associate data
    clearForm() {
        sessionStorage.setItem('filterAsso', '');
        sessionStorage.setItem('filterDispAsso', '')
        sessionStorage.setItem('pageNumFilAsso', '')
        sessionStorage.setItem('pageSizeFilAsso', '')
        let body = `{ 
            "pageNumber": ${sessionStorage.getItem("pagenumAsso")},
            "pageSize": ${sessionStorage.getItem("offsetAsso")},
            "roleDesc":"${this.role}" 
          }`
        let url = this.urlConstants.getAllPhonepals;
        this.isLoadingResults = true;
        this.memberDetails.getAllPhonepals(url, body).subscribe(phonepalData => {
            this.length = phonepalData.totalRecords
            this.phonepalData = phonepalData.list;
            this.dataSource.data = this.phonepalData;
            this.paginator.pageIndex = parseInt(sessionStorage.getItem("pagenumAsso"));
            this.isLoadingResults = false;
            this.filteredValue = '';
            this.searchcriteriaForm.reset();
        })
    }

    // Apply filter and get search associate data
    getfilterValue(formGroup: FormGroup): string {
        if (formGroup.dirty) {
            formGroup.controls.roleDesc.patchValue(this.role);
            let availabilityDate = formGroup.controls.availability.value;
            this.userFilteredSearch.availabilityStartDt = availabilityDate != null ? getformatedDate(availabilityDate[0]) : null;
            this.userFilteredSearch.availabilityEndDate = availabilityDate != null ? getformatedDate(availabilityDate[1]) : null;
            this.userFilteredSearch.nominationApprovalDt = getformatedDate(formGroup.controls.nominationApprovalDt.value);
            this.userFilteredSearch.nominationDt = getformatedDate(formGroup.controls.nominationDt.value);
            this.userFilteredSearch.trainingCompletionDt = getformatedDate(formGroup.controls.trainingCompletionDt.value);
            this.userFilteredSearch.firstName = formGroup.controls.firstName.value;
            this.userFilteredSearch.lastName = formGroup.controls.lastName.value;
            this.userFilteredSearch.city = formGroup.controls.city.value;
            this.userFilteredSearch.state = formGroup.controls.state.value;
            this.userFilteredSearch.language = formGroup.controls.language.value;
            this.userFilteredSearch.phoneNumber = formGroup.controls.phoneNumber.value;
            this.userFilteredSearch.timezone = formGroup.controls.timezone.value;
            this.userFilteredSearch.roleDesc = this.role;
            this.userFilteredSearch.status = formGroup.controls.status.value;
            this.userFilteredSearch.pageNumber = 0;
            this.userFilteredSearch.pageSize = this.offset;
            let body = this.userFilteredSearch;
            this.userFilteredSearch = new userFiltered();
            sessionStorage.setItem('filterAsso', JSON.stringify(body))
            var searchData: string;
            var counterBoolean: boolean = false;
            this.isLoadingResults = true;
            // Get Search Associate data
            let url = this.urlConstants.getAllPhonepals;
            this.getfilterValueService(url, body)
            Object.keys(formGroup.controls).forEach(field => {
                const control = formGroup.get(field);
                if (control.value != null && !counterBoolean && control.value != "") {
                    counterBoolean = true

                    if (field == "nominationApprovalDt" || field == "availability" || field == "nominationDt" || field == "trainingCompletionDt") {
                        searchData = getformatedDate(control.value)
                    } else {
                        searchData = control.value
                    }
                } else if (control.value != null && control.value != "" && counterBoolean && (field != "nominationApprovalDt" && field != "Availability" && field != "nominationDt" && field != "trainingCompletionDt")) {
                    searchData = searchData + " | " + control.value
                } else if (control.value != null && control.value != "" && counterBoolean && (field == "nominationApprovalDt" || field == "Availability" || field == "nominationDt" || field == "trainingCompletionDt")) {
                    searchData = searchData + " | " + getformatedDate(control.value)
                }
            });
            sessionStorage.setItem('filterDispAsso', searchData);
            return searchData.includes("00:00:00.000") ? searchData.replace(/00:00:00.000/g, '') : searchData;
        }
        return '';
    }

    getfilterValueService(url, body) {
        this.isLoadingResults = true;
        // Get Search Associate Data
        this.memberDetails.getAllPhonepals(url, body).subscribe(phonepalData => {
            this.length = phonepalData.totalRecords;
            this.phonepalData = phonepalData.list;
            this.dataSource.data = this.phonepalData;
            this.isLoadingResults = false;
        }, (error) => {
            this.isLoadingResults = false;
        })
    }

    action(action: any) {

    }

    // Function to unassign member
    unAssignMember(phonepalName) {
        this.isLoadingResults = true;
        let url = this.urlConstantService.getUrls().unassignMember.replace('{primaryAlias}', phonepalName);
        this.memberDetails.unAssignMember(url).subscribe(data => {
            this.isLoadingResults = false;
            this.toastr.success("Member unassigned successfully");
            this.getPhonepalData(sessionStorage.getItem("pagenumAsso"), sessionStorage.getItem("offsetAsso"));
        }, (error) => {
            this.isLoadingResults = false;
            this.toastr.warning("Oops!! something went wrong. Please try again")
        })
    }

    openDialog(dialogPopup: any, phonepalalias: any, width: any, title: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = width;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            dataKey: phonepalalias,
            action: title
        }
        this.dialog.open(dialogPopup, dialogConfig);
    }

    // Perform unsubscribe before Angular destroys the component
    ngOnDestroy() {
        // Unsubscribe to the Subject
        this.iconSubscription.unsubscribe();
        this.updateSubscription.unsubscribe();
        this.roleSubscription.unsubscribe();
        this.statusSubscription.unsubscribe();
        // this.rowopenphonepalSubscription.unsubscribe();
        // this.memberDataInformation.unsubscribe();
    }
}



