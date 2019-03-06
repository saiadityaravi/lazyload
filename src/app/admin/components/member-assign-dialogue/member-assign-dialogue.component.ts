import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatSort, MatChipSelectionChange } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MemberAssign } from '../../models/memberAssign.model';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { connectorServices } from '../../../shared/services/connector.services';
import { MatRadioChange } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material'
import { memberSearch } from '../../../shared/models/memberSearch.model';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { getformatedDate } from '../../../core/utilities/utilityHelper';
import { getUser } from '../../../shared/services/userDetailsService';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-assign',
  templateUrl: './member-assign-dialogue.component.html',
  styleUrls: ['./member-assign-dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})

// Assign member Dialog component
export class memberAssignDialogueComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  memberData: memberHeader[];
  displayedColumns: string[] = ['selected', 'memberId', 'firstName', 'address', 'preferredLanguage', 'phoneNumber', 'memberTimeZone', 'ethnicity', 'gender'];
  dataSource: MatTableDataSource<memberHeader> = new MatTableDataSource<memberHeader>(this.memberData);
  memberAssignForm: FormGroup;
  memberAssign;
  genders = ['Male', 'Female', 'Other', 'Refuse to disclose'];
  selectedMember: memberHeader;
  memberSearch = new memberSearch();
  effectiveDate = new FormControl(new Date(), Validators.required);
  minDate = new Date();
  maxDate;
  public memberToBeAssigned: any;
  public today: any;
  public assignButton: boolean = false;
  public todayFormatted: any;
  public isLoadingResults: boolean = false;

  public arrayVal;
  public arrayState: any[] = [];
  public arrayGender: any[] = [];
  public arrayTimeZone: any[] = [];
  public arrayLanguage: any[] = [];
  public arrayPhonepalStatus: any[] = [];
  public arrayEthnicity: any[] = [];
  selection: SelectionModel<memberHeader> = new SelectionModel<memberHeader>(true, []);
  records: number;
  length: number;
  connectorName: string;
  pageNumber = 0;
  offset = 4;
  assignMemberArray: any[] = [];
  selectedMemberArray: any[] = [];

  constructor(private messageService: SharedService, private fb: FormBuilder, private toastr: ToastrService,
    public dialogRef: MatDialogRef<memberAssignDialogueComponent>, private overlayContainer: OverlayContainer, private userDetails: getUser,
    private urlconstantService: UrlconstantsService, private memberDetails: connectorServices, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.overlayContainer.getContainerElement().classList.add("profilepagetheme");
  }

  urlConstants = this.urlconstantService.getUrls();

  // Initialize component, form and subscribe to the subject to create an observer
  ngOnInit() {
    this.selection.isSelected = this.isChecked.bind(this);
    this.selection.onChange.subscribe(data => {
      if (data.added.length >= 1) {
        this.selectedMemberArray.push(data.added[0])
      } else {
        data.removed.forEach(element => {
          console.log(this.selectedMemberArray.findIndex(x => x.memberId === element.memberId));

          this.selectedMemberArray.splice(this.selectedMemberArray.findIndex(x => x.memberId === element.memberId), 1)
        });
      }
      if (this.selectedMemberArray.length >= 1) {
        this.memberToBeAssigned = true;
      } else {
        this.memberToBeAssigned = false;
      }
      this.records = this.selectedMemberArray.length
    })
    this.getDates()
    this.memberAssignForm = this.fb.group({
      gender: [null],
      language: [null],
      timeZone: [null],
      ethnicity: [null],
      city: [null],
      state: [null]
    })
    this.effectiveDate.valueChanges.subscribe(effDt => {
      if (effDt) {
        this.assignButton = false;
      } else {
        this.assignButton = true;
      }
    });

    this.dropDownValues();
  }
  isChecked(row: any): boolean {
    const found = this.selectedMemberArray.find(el => el.memberId === row.memberId);
    if (found) {
      return true;
    }
    return false;
  }

  // Populate the dropdowns based on the data from database
  dropDownValues() {
    let dropdownurl = this.urlconstantService.getUrls().getLookUpValues;
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
          } else if (key === "Gender") {
            let mainObj = profileData[i];
            this.arrayGender = ddlArray(mainObj);
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
  getDates() {
    this.isLoadingResults = true;
    // Get associate profile data
    let url = this.urlConstants.getAssociateUrl.replace('{alias}', this.data.dataKey)
    this.userDetails.getAssocaiteData(url).subscribe(data => {
      this.isLoadingResults = false;
      if (data) {
        let endDate = new Date(data.availabilityEndDate.toString().substring(0, data.availabilityEndDate.toString().indexOf(" ")).replace(/-/g, '\/'));
        let effective = new Date(data.availabilityStartDt.toString().substring(0, data.availabilityStartDt.toString().indexOf(" ")).replace(/-/g, '\/'));
        this.effectiveDate.patchValue(new Date(effective))
        this.minDate = new Date(effective);
        this.maxDate = new Date(endDate);
        this.connectorName = data.firstName + ' ' + data.lastName;
      }
    }, (error) => {
      this.isLoadingResults = false;
    })
  }

  // Close Member Assign Dialog
  close() {
    this.dialogRef.close();
  }

  // Reset Form
  clear() {
    this.memberAssignForm.reset();
    this.memberAssignForm.updateValueAndValidity();
    this.memberToBeAssigned = false;
    this.dataSource.data = [];
  }

  // Function to retrieve date in yyyy-MM-dd 00:00:00.000 format
  getTodayDate() {
    this.today = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-dd');
    this.todayFormatted = this.today + " 00:00:00.000"
    return this.todayFormatted;
  }

  // Post Assigned Members Details for Connector
  assignMember() {
    console.log();
    this.isLoadingResults = true;
    this.selectedMemberArray.forEach(element => {
      this.memberAssign = new MemberAssign();
      let memberData: any = element
      this.memberAssign.memberId = memberData.memberId;;
      this.memberAssign.effectiveDt = getformatedDate(this.effectiveDate.value);
      this.memberAssign.termDt = memberData.terminationDt;
      this.memberAssign.connectorAlias = this.data.dataKey;
      this.memberAssign.createdBy = sessionStorage.getItem('alias');
      this.memberAssign.updatedDt = this.getTodayDate();
      this.memberAssign.primaryAlias = null
      this.memberAssign.createdDt = this.getTodayDate();
      this.memberAssign.assignedDt = getformatedDate(this.effectiveDate.value);
      this.assignMemberArray.push(this.memberAssign)
    });
    let body = this.assignMemberArray
    let url = this.urlConstants.assignConnector;
    this.memberDetails.assignAssociateMember(url, body).subscribe(data => {
      this.assignMemberArray = [];
      if (data.errorCode == 500) {
        this.isLoadingResults = false;
        this.toastr.warning(data.details)
        this.messageService.updateStatusMessage(data.details);
      } else {
        this.dialogRef.close();
        this.isLoadingResults = false;
        this.toastr.success(this.records + ' Member(s) were assigned successfully to connector ' + this.connectorName)
        this.messageService.updateStatusMessage('assigmentsuccessful');
      }
    }, (error) => {
      this.isLoadingResults = false;
      this.toastr.warning('Opps!! something went wrong');
      this.messageService.updateStatusMessage('assigmentfailed');
    })
  }

  /**
   * Function invoked when user clicks on page number / change page size
   *
   * @param event - Page event from angular material paginator component
   */
  onPaginateChange(event) {
    this.searchMember(event.pageIndex, event.pageSize, false)
  }

  // Get Search Member Not Assigned Data
  searchMember(pageIndex, offset, search) {
    if (search) {
      this.selection.clear();
    }
    this.markFormGroupTouched(this.memberAssignForm);
    this.memberSearch.address = {
      city: this.memberAssignForm.controls.city.value ? this.memberAssignForm.controls.city.value : null,
      state: this.memberAssignForm.controls.state.value ? this.memberAssignForm.controls.state.value : null
    }
    this.memberSearch.ethnicity = this.memberAssignForm.controls.ethnicity.value;
    this.memberSearch.gender = this.memberAssignForm.controls.gender.value;
    this.memberSearch.pageNumber = pageIndex;
    this.memberSearch.pageSize = offset;
    this.memberSearch.preferredLanguage = this.memberAssignForm.controls.language.value != null ? this.memberAssignForm.controls.language.value.length > 0 ? this.memberAssignForm.controls.language.value : null : null;
    this.memberSearch.memberTimeZone = this.memberAssignForm.controls.timeZone.value != null ? this.memberAssignForm.controls.timeZone.value.length > 0 ? this.memberAssignForm.controls.timeZone.value : null : null;
    let body = this.memberSearch;
    this.isLoadingResults = true;
    let url = this.urlConstants.searchMemberNotAssigned;
    this.memberDetails.getMemberFilteredData(url, body).subscribe(memberData => {
      this.length = memberData.totalRecords;
      this.memberData = memberData.list;
      this.dataSource.data = this.memberData;
      this.isLoadingResults = false;
    }, (error) => {
      this.isLoadingResults = false;
    })
  }

  // Lifecycle hook that is called after Angular has fully initialized a component's view
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  /**
   * Function to mark all controls in a form group as touched
   *
   * @param formGroup ++++ The form group to touch
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
    * Function to check whether an object is empty or not
    * 
    * @param obj - Object to be checked
    */
  isEmptyObject(obj) {
    if (obj && (Object.keys(obj).length === 0) == null) {
      return false
    } else if (obj && (Object.keys(obj).length === 0) == false) {
      return true;
    }
    return (obj && (Object.keys(obj).length === 0));
  }

  // Display error message if Effective date field is empty
  getErrorMessageDate() {
    return this.effectiveDate.hasError('required') ? 'Effective date  is required' : null;
  }

  // Display error message if status field is empty
  getErrorMessageStatus() {
    return this.memberAssignForm.controls.status.hasError('required') ? 'status is required' : null;
  }
}

// Member header Interface
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
