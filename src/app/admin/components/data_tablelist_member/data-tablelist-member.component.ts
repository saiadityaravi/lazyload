import { Component, OnInit, QueryList, ViewEncapsulation, ViewChild, ViewChildren } from '@angular/core';
import 'rxjs/add/operator/map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig, PageEvent } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Overlay, OverlayConfig, OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { Portal, TemplatePortalDirective } from '@angular/cdk/portal';
import { getformatedDate } from '../../../core/utilities/utilityHelper'
import { Router } from '@angular/router';
import { connectorServices } from '../../../shared/services/connector.services';
import { memberFiltered } from '../../models/memberFilter.model';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged } from 'rxjs/operators';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { SharedService } from '../../../shared/services/shared.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { memberHeader } from '../../models/membertable.model'

@Component({
    selector: 'app-data-tablelist-member',
    templateUrl: './data-tablelist-member.component.html',
    styleUrls: ['./data-tablelist-member.component.scss'],

})

// Admin - Member Listing Component
export class datatablelistMemberComponent implements OnInit {
    opened: boolean = false;
    memberData: memberHeader[];
    iconSubscriptionMember: Subscription;
    phonepalDataSubcription: Subscription;
    updateSubscriptionMember: Subscription;
    rowopenMemberSubscription: Subscription;    
    searchcriteriaForm: FormGroup;
    bsConfig: Partial<BsDatepickerConfig>;
    dataSource: MatTableDataSource<memberHeader> = new MatTableDataSource<memberHeader>(this.memberData);
    displayedColumns: string[] = ['memberId', 'firstName', 'address', 'preferredLanguage', 'phoneNumber', 'memberTimeZone', 'eligibilityStatus', 'ethnicity', 'gender'];
    pageNumber: number = sessionStorage.getItem("pagenum") ? parseInt(sessionStorage.getItem("pagenum")) : 0;
    offset: number = sessionStorage.getItem("offset") ? parseInt(sessionStorage.getItem("offset")) : 15;
    length: number;
    public searchcriteria: any;
    public isLoadingResults: boolean = false;
    public rowOpened: boolean = false;
    public overlayRef: any;
    public clicked: boolean = false;
    public theme: string = 'togethernessapptheme';
    public filteredValue: any = '';
    public urlConstants: any;    

    public searchArray: string[];
    public arrayVal;
    public arrayState: any[] = [];
    public arrayTimeZone: any[] = [];
    public arrayLanguage: any[] = [];
    public arrayPhonepalStatus: any[] = [];
    public arrayEthnicity: any[] = [];

    critical: any[] = [true, false, "Null"]
    connectorDisable: boolean = null;
    phonepalDisable: boolean = null;
    memberFilteredSearch = new memberFiltered();

    @ViewChildren(TemplatePortalDirective) templatePortals: QueryList<Portal<any>>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
    
    // Text mask applied to angular material input to display US Phonenumber
    public mask = {
        guide: false,
        showMask: false,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };

    constructor(private toastr: ToastrService, private memberDetails: connectorServices, private urlConstantService: UrlconstantsService, private router: Router, private overlayContainer: OverlayContainer, private dialog: MatDialog, public overlay: Overlay, private fb: FormBuilder, public messageService: SharedService) {
        this.urlConstants = this.urlConstantService.getUrls();
        this.bsConfig = Object.assign({}, { containerClass: "theme-default", rangeInputFormat: 'MM/DD/YYYY', showWeekNumbers: false });
        if (sessionStorage.getItem('filter')) {
            // Get Search Member Data
            let url = this.urlConstants.searchMemberUrl;
            this.filteredValue = sessionStorage.getItem('filterDisp');
            this.getfilterValueService(url, sessionStorage.getItem('filter'))
        } else {
            this.getMemberData(this.pageNumber, this.offset);
        }

    }

    // Get All member information data
    getMemberData(pagenum, offset) {
        let url = this.urlConstants.getAllMembers.replace('{page}', pagenum).replace('{offset}', offset);
        this.isLoadingResults = true;
        this.memberDetails.getAllMembers(url).subscribe(memberData => {
            this.length = memberData.totalRecords;
            this.memberData = memberData.list;
            this.dataSource.data = this.memberData;
            this.isLoadingResults = false;
            sessionStorage.setItem("pagenum", JSON.stringify(this.paginator.pageIndex))
            sessionStorage.setItem("offset", JSON.stringify(this.paginator.pageSize))
        }, (error) => {
            this.isLoadingResults = false;
            this.toastr.warning('Oops!! Something went wrong with member data, please try again')
        })
    }

  /**
   * Function invoked when user clicks on page number / change page size
   *
   * @param event - Page event from angular material paginator component
   */
    onPaginateChange(event) {
        if (this.filteredValue !== '') {
            let url = this.urlConstants.searchMemberUrl;
            sessionStorage.setItem('pageNumFil', JSON.stringify(event.pageIndex));
            sessionStorage.setItem('pageSizeFil', JSON.stringify(event.pageSize));
            var temp = JSON.parse(sessionStorage.getItem('filter'));
            temp.pageNumber =  event.pageIndex;
            temp.pageSize =  event.pageSize;
            this.getfilterValueService(url, JSON.stringify(temp) )
        } else {
            sessionStorage.setItem("pagenum", JSON.stringify(event.pageIndex))
            sessionStorage.setItem("offset", JSON.stringify(event.pageSize))
            this.getMemberData(event.pageIndex, event.pageSize)
        }
    }

    // Initialize component, form and subscribe to the subject to create an observer
    ngOnInit() {
        this.searchcriteriaForm = this.fb.group({
            firstName: [null],
            lastName: [null],
            address: this.fb.group({
                city: [null],
                state: [null]
            }),
            preferredLanguage: [null],
            phoneNumber: [null],
            memberTimeZone: [null],
            eligibilityStatus: [null],
            ethnicity: [null],
            connectorNextCallDate: [null],
            phonepalNextCallDate: [null],
            connectorAlias: [false],
            isCritical: [null]
        })

        this.searchcriteriaForm.controls.connectorNextCallDate.valueChanges.pipe(distinctUntilChanged()).subscribe(data => {
            if (data != null) {
                this.phonepalDisable = true;
            } else {
                this.phonepalDisable = null;
            }
            this.searchcriteriaForm.updateValueAndValidity()
        })
        this.searchcriteriaForm.controls.phonepalNextCallDate.valueChanges.pipe(distinctUntilChanged()).subscribe(data => {
            if (data != null) {
                this.connectorDisable = true;
            } else {
                this.connectorDisable = null;
            }
            this.searchcriteriaForm.updateValueAndValidity()
        })

        this.iconSubscriptionMember = this.messageService.iconMessageMember.pipe(distinctUntilChanged()).subscribe(data => {
            console.log(data);

            this.action(data);
        })

        this.overlayContainer.getContainerElement().classList.add(this.theme);
        this.router.events.subscribe(() => {
            if (this.opened) {
                this.clearForm()
                this.openDiv(false);
            }
        })
        this.dropDownValues();
    }

    // Populate the dropdowns based on the data from database
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
                } else if (key === "TimeZone") {
                    let mainObj = profileData[i];
                    this.arrayTimeZone = ddlArray(mainObj);
                } else if (key === "PhonepalStatus") {
                    this.arrayPhonepalStatus =   this.arrayPhonepalStatus = [{ value: "E", viewValue: "Eligible" }, { value: "NE", viewValue: "Not Eligible" }, { value: "P", viewValue: "Pending" }];
                } else if (key === "Ethnicity") {
                    let mainObj = profileData[i];
                    this.arrayEthnicity = ddlArray(mainObj);
                }
            }
          }
        }, (error) => {
          this.messageService.setshowSpinner(false);
        });
    }

    // Lifecycle hook that is called after Angular has fully initialized a component's view
    ngAfterViewInit() {
        if (this.filteredValue !== '') {

        } else {
            this.dataSource.sort = this.sort;
            this.paginator.pageIndex = sessionStorage.getItem("pagenum") ? parseInt(sessionStorage.getItem("pagenum")) : 0;
        }

    }

    // Refresh page content
    refresh() {
        if (this.filteredValue != '') {
            this.getfilterValue(this.searchcriteriaForm)
        } else {
            this.getMemberData(sessionStorage.getItem("pagenum"), sessionStorage.getItem("offset"));
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

    // Clear filter and get all member information data
    clearForm() {
        if (this.filteredValue !== '') {
            sessionStorage.setItem('filter', '');
            sessionStorage.setItem('filterDisp', '')
            sessionStorage.setItem('pageNumFil', '')
            sessionStorage.setItem('pageSizeFil', '')
            let url = this.urlConstants.getAllMembers.replace('{page}', sessionStorage.getItem("pagenum")).replace('{offset}', sessionStorage.getItem("offset"));
            this.isLoadingResults = true;
            this.memberDetails.getAllMembers(url).subscribe(memberData => {
                this.length = memberData.totalRecords;
                this.memberData = memberData.list;
                this.dataSource.data = this.memberData
                this.isLoadingResults = false;
                this.filteredValue = '';
                this.searchcriteriaForm.reset();
            }, (error) => {
                this.filteredValue = '';
                this.searchcriteriaForm.reset();
                this.isLoadingResults = false;
                this.toastr.warning('Oops!! Something went wrong with member data, please try again')
            })
        } else if (this.searchcriteriaForm.dirty) {
            this.searchcriteriaForm.reset();
        }
    }
    getCriticalValue(value: any): boolean {
        if (value == true) {
            return true
        }
        if (value == false) {
            return false
        }
        if (value == "null") {
            return null
        }
        return null
    }

    // Apply filter and get search member data
    getfilterValue(formGroup: FormGroup): string {
        if (formGroup.dirty) {
            // Get Search Member Data
            this.memberFilteredSearch = new memberFiltered();
            this.memberFilteredSearch = formGroup.value;
            this.memberFilteredSearch.pageNumber = 0
            this.memberFilteredSearch.pageSize = 15;
            this.paginator.pageIndex = 0;
            this.memberFilteredSearch.connectorAlias = formGroup.controls.connectorAlias.value || formGroup.controls.connectorNextCallDate.value != null ? sessionStorage.getItem('alias') : null;
            this.memberFilteredSearch.isCritical = this.getCriticalValue(formGroup.controls.isCritical.value)
            this.memberFilteredSearch.connectorNextCallDate = formGroup.controls.connectorNextCallDate.value != null ? getformatedDate(formGroup.controls.connectorNextCallDate.value) : null;
            this.memberFilteredSearch.phonepalNextCallDate = formGroup.controls.phonepalNextCallDate.value != null ? getformatedDate(formGroup.controls.phonepalNextCallDate.value) : null;
            let body: any = this.memberFilteredSearch;
            sessionStorage.setItem('filter', JSON.stringify(body))
            var searchData: string;
            var counterBoolean: boolean = false;
            this.isLoadingResults = true;
            //Get Search Member Data
            let url = this.urlConstants.searchMemberUrl;
            this.getfilterValueService(url, body)
            var searchData: string;
            var counterBoolean: boolean = false;
            (<any>Object).keys(formGroup.controls).forEach(field => {
                const control: any = formGroup.get(field);

                if (control.controls && !counterBoolean) {
                    if (control.controls.city.value != null) {
                        counterBoolean = true
                        searchData = control.controls.city.value
                    }
                    if (control.controls.state.value != null) {
                        counterBoolean = true
                        searchData = control.controls.state.value
                    }
                }
                else if (control.value != null && !counterBoolean && control.value != "") {
                    counterBoolean = true
                    if (field == "connectorCallDate" || field == "phonepalCallDate") {
                        searchData = getformatedDate(control.value)
                    } else {
                        searchData = control.value
                    }
                } else if (control.value != null && !control.controls && control.value != "" && counterBoolean && (field != "connectorCallDate" && field != "phonepalCallDate")) {
                    searchData = searchData + " | " + control.value
                } else if (control.value != null && !control.controls && control.value != "" && counterBoolean && (field == "connectorCallDate" || field == "phonepalCallDate")) {
                    searchData = searchData + " | " + getformatedDate(control.value)
                } else if (control.controls && counterBoolean) {
                    if (control.controls.city.value != null) {
                        searchData = searchData + " | " + control.controls.city.value
                    }
                    if (control.controls.state.value != null) {
                        searchData = searchData + " | " + control.controls.state.value
                    }
                }
            });
            sessionStorage.setItem('filterDisp', searchData);
            return searchData.includes("00:00:00.000") ? searchData.replace(/00:00:00.000/g, ''): searchData;
        }
        return '';
    }
    getfilterValueService(url, body) {
        this.isLoadingResults = true;
        this.memberDetails.getMemberFilteredData(url, body).subscribe(memberData => {
            this.length = memberData.totalRecords
            this.memberData = memberData.list? memberData.list: [];
            this.dataSource.data = this.memberData;
            this.isLoadingResults = false;
            sessionStorage.setItem('pageNumFil', JSON.stringify(this.paginator.pageIndex))
            sessionStorage.setItem('pageSizeFil', JSON.stringify(this.paginator.pageSize))
        }, (error) => {
            this.isLoadingResults = false;
        })
    }

    action(action: any) {

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

    openDialog(dialogPopup: any, memberId: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.width = '620px';
        dialogConfig.data = {
            dataKey: memberId
        }
        dialogConfig.autoFocus = true;
        this.dialog.open(dialogPopup, dialogConfig);
    }

    // Perform unsubscribe before Angular destroys the component
    ngOnDestroy() {
        this.iconSubscriptionMember.unsubscribe();
    }

}
