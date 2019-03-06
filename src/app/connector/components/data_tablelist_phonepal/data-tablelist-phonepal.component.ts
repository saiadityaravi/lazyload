import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import 'rxjs/add/operator/map';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { OverlayConfig, Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { Portal, TemplatePortalDirective } from '@angular/cdk/portal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getformatedDate } from '../../../core/utilities/utilityHelper';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';
import { editDialogueComponent } from '../edit-dialogue/edit_dialogue.component';
import { Router } from '@angular/router';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { connectorServices } from '../../../shared/services/connector.services';
import { PhonepalAssignedMember } from '../../models/phonepalAssignedmember.model'
import { phonepalFiltered } from '../../models/phonepalFilter.model';
import { memberAssignDialogueComponent } from '../member-assign-dialogue/member-assign-dialogue.component';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { phonepalHeader } from '../../models/phonepaltable.model'

@Component({
    selector: 'app-data-tablelist-phonepal',
    templateUrl: './data-tablelist-phonepal.component.html',
    styleUrls: ['./data-tablelist-phonepal.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('*', style({ height: '*', visibility: 'visible' })),
            transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

// Connector - Phonepal listing component
export class datatablelistPhonepalComponent implements OnInit {
    phonepalData: phonepalHeader[] = [];
    displayedColumns: string[] = ["islinked", 'firstName', 'city', 'state', 'language', 'phoneNumber', 'timezone', 'status', 'availabilityStartDt', 'actions'];
    dataSource: MatTableDataSource<phonepalHeader> = new MatTableDataSource<phonepalHeader>(this.phonepalData);;
    assignMemberData = new PhonepalAssignedMember()
    updateSubscription: Subscription;
    iconSubscription: Subscription;
    memberDataInformation: Subscription;
    rowopenphonepalSubscription: Subscription;
    searchcriteriaForm: FormGroup;
    phonepalFilteredSearch = new phonepalFiltered();
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

    public searchArray: string[];
    public arrayVal;
    public arrayState: any[] = [];
    public arrayTimeZone: any[] = [];
    public arrayLanguage: any[] = [];
    public arrayPhonepalStatus: any[] = [];

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
    constructor(private toastr: ToastrService, private memberDetails: connectorServices, private router: Router, private urlConstantService: UrlconstantsService, private overlayContainer: OverlayContainer, private dialog: MatDialog, public overlay: Overlay, private fb: FormBuilder, public messageService: SharedService) {
        if (sessionStorage.getItem('filterAsso')) {
            this.urlConstants = this.urlConstantService.getUrls();
            let url = this.urlConstants.getAllPhonepals;
            this.filteredValue = sessionStorage.getItem('filterDispAsso');
            this.getfilterValueService(url, sessionStorage.getItem('filterAsso'))
        } else {
            this.getPhonepalData(this.pageNumber, this.offset);
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
            this.phonepalFilteredSearch = this.searchcriteriaForm.value;
            body = this.phonepalFilteredSearch;
        } else {
            body = `{
                "pageNumber": ${pageNumber},
                "pageSize": ${offset},
                "roleDesc":"phonepal" 
              }`
        }
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

        // Display Success / Warning messages in toastr
        // Subscribe to the Subject to create an observer
        this.updateSubscription = this.messageService.updateStatus.subscribe(data => {
            if (data == "assigmentsuccessful") {
                this.getPhonepalData(sessionStorage.getItem("pagenumAsso"), sessionStorage.getItem("offsetAsso"));
                this.messageService.updateStatusMessage('');
                this.toastr.success('', 'Member has been succesfully assigned to phonepal', {
                    progressAnimation: 'increasing'
                });
            } else if (data == "assigmentfailed") {
                // Calling next to emit value from the observer
                this.messageService.updateStatusMessage('');
                this.toastr.warning('', 'Oops!! something went wrong, please try again', {
                    progressAnimation: 'increasing'
                });
            } else if (data == "updateSuccess") {
                this.getPhonepalData(sessionStorage.getItem("pagenumAsso"), sessionStorage.getItem("offsetAsso"));
                this.messageService.updateStatusMessage('');
                this.toastr.success('', 'phonepal has been updated succesfully ', {
                    progressAnimation: 'increasing'
                });
            } else if (data == "updateFail") {
                // Calling next to emit value from the observer
                this.messageService.updateStatusMessage('');
                this.toastr.warning('', 'Oops!! something went wrong, please try again', {
                    progressAnimation: 'increasing'
                });
            } else if (data ? data.includes('not available') : '') {
                // Calling next to emit value from the observer
                this.messageService.updateStatusMessage('');
                this.toastr.warning('', data, {
                    progressAnimation: 'increasing'
                });
            }
        })
        // Subscribe to the Subject to create an observer
        this.rowopenphonepalSubscription = this.messageService.rowOpenedPhonepal.subscribe(data => {
            this.rowOpened = data;
            this.isLoadingResults = !data;
            if (!data) {
                this.assignMemberData = new PhonepalAssignedMember();
            }
        })
        this.overlayContainer.getContainerElement().classList.add(this.overlayTheme);

        this.router.events.subscribe(() => {
            if (this.opened) {
                this.clearForm()
                this.openDiv(false);
            }
        })
        this.memberDataInformation = this.messageService.memberData.subscribe(data => {
            if (data) {
                this.assignMemberData.memberName = data[0] ? data[0].firstName + (data[0].lastName == null ? "" : data[0].lastName) : null;
                this.assignMemberData.nextScheduledCallDate = data[1] ? data[1][0] ? data[1][0].callDt : null : null;
                this.assignMemberData.contact = data[0] ? data[0].phoneNumber : null;
                this.assignMemberData.lonliness = data[1] ? data[1][0] ? data[1][0].loneliness : null : null;
                this.assignMemberData.socialization = data[1] ? data[1][0] ? data[1][0].socialization : null : null;
                this.assignMemberData.mood = data[1] ? data[1][0] ? data[1][0].mood : null : null;
                this.assignMemberData.isolationScore = data[1] ? data[1][0] ? data[1][0].isolationScore : null : null;
                this.assignMemberData.riskStratification = data[1] ? data[1][0] ? data[1][0].riskStratification : null : null;
                if (data[2][0] != null) {
                    console.log(data[2][0].source);

                    this.assignMemberData.referralSource = data[2][0].source;
                    this.assignMemberData.referralDate = data[2][0].date;
                    this.assignMemberData.referralName = data[2][0].refereeName;
                    this.assignMemberData.referralContact = data[2][0].contactNumber;
                    this.assignMemberData.referralEmail = data[2][0].email;
                }
                this.assignMemberData.barrier = data[1] ? data[1][0] ? data[1][0].barriers.filter(Boolean) : null : null;
                this.assignMemberData.physicalActivity = data[1] ? data[1][0] ? data[1][0].physicalActivity.filter(Boolean) : null : null;
                this.assignMemberData.anthemProgram = data[1] ? data[1][0] ? data[1][0].anthemPrograms.filter(Boolean) : null : null;
                this.assignMemberData.careCoordination = data[1] ? data[1][0] ? data[1][0].careCoordination.filter(Boolean) : null : null;
                this.assignMemberData.communityResources = data[1] ? data[1][0] ? data[1][0].communityResources.filter(Boolean) : null : null;
            }
            this.isLoadingResults = false;
        });

        this.dropDownValues();
    }

    // Populate combo box values
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

    // Apply Filter
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    // Open div overlay
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

    // Clear search criteria
    clearForm() {
        sessionStorage.setItem('filterAsso', '');
        sessionStorage.setItem('filterDispAsso', '')
        sessionStorage.setItem('pageNumFilAsso', '')
        sessionStorage.setItem('pageSizeFilAsso', '')
        let body = `{ 
            "pageNumber": ${sessionStorage.getItem("pagenumAsso")},
            "pageSize": ${sessionStorage.getItem("offsetAsso")},
            "roleDesc":"phonepal" 
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

    // Get filter value
    getfilterValue(formGroup: FormGroup): string {
        if (formGroup.dirty) {
            formGroup.controls.roleDesc.patchValue('phonepal');
            let availabilityDate = formGroup.controls.availability.value;
            this.phonepalFilteredSearch.availabilityStartDt = availabilityDate != null ? getformatedDate(availabilityDate[0]) : null;
            this.phonepalFilteredSearch.availabilityEndDate = availabilityDate != null ? getformatedDate(availabilityDate[1]) : null;
            this.phonepalFilteredSearch.nominationApprovalDt = getformatedDate(formGroup.controls.nominationApprovalDt.value);
            this.phonepalFilteredSearch.nominationDt = getformatedDate(formGroup.controls.nominationDt.value);
            this.phonepalFilteredSearch.trainingCompletionDt = getformatedDate(formGroup.controls.trainingCompletionDt.value);
            this.phonepalFilteredSearch.firstName = formGroup.controls.firstName.value;
            this.phonepalFilteredSearch.lastName = formGroup.controls.lastName.value;
            this.phonepalFilteredSearch.city = formGroup.controls.city.value;
            this.phonepalFilteredSearch.state = formGroup.controls.state.value;
            this.phonepalFilteredSearch.language = formGroup.controls.language.value;
            this.phonepalFilteredSearch.phoneNumber = formGroup.controls.phoneNumber.value;
            this.phonepalFilteredSearch.timezone = formGroup.controls.timezone.value;
            this.phonepalFilteredSearch.status = formGroup.controls.status.value;
            this.phonepalFilteredSearch.pageNumber = 0;
            this.phonepalFilteredSearch.pageSize = this.offset;
            let body = this.phonepalFilteredSearch;
            this.phonepalFilteredSearch = new phonepalFiltered();
            sessionStorage.setItem('filterAsso', JSON.stringify(body))
            var searchData: string;
            var counterBoolean: boolean = false;
            this.isLoadingResults = true;
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
        this.memberDetails.getAllPhonepals(url, body).subscribe(phonepalData => {
            this.length = phonepalData.totalRecords;
            this.phonepalData = phonepalData.list;
            this.dataSource.data = this.phonepalData;
            this.isLoadingResults = false;
        }, (error) => {
            this.isLoadingResults = false;
        })
    }

    // Based on user action, allow user to Edit / Assign / Unassign / View History of Member
    action(action: any) {
        console.log(action.nameIcon, action.phonepalName);
        if (action.nameIcon == "edit") {
            this.openDialog(editDialogueComponent, "500px", action.phonepalName);
        } else if (action.nameIcon == "link") {
            this.openDialog(memberAssignDialogueComponent, "1200px", action.phonepalName);
        } else if (action.nameIcon == "link_off") {
            this.unAssignMember(action.phonepalName);
        } else if (String(action.nameIcon).trim() == "history") {
            sessionStorage.setItem('phonepalID', action.phonepalName);
            this.router.navigateByUrl('/connector/phonepal/phonepalcalloutcome');
        }
    }

    // Method to unassign a member
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

    openDialog(dialogPopup: any, width: any, phonepalalias: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = width;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            dataKey: phonepalalias
        }
        this.dialog.open(dialogPopup, dialogConfig);
    }

    // Perform unsubscribe before Angular destroys the component
    ngOnDestroy() {
        this.iconSubscription.unsubscribe();
        this.updateSubscription.unsubscribe();
        this.rowopenphonepalSubscription.unsubscribe();
        this.memberDataInformation.unsubscribe();
    }
}



