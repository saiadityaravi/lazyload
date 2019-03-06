import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
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

@Component({
  selector: 'app-member-assign',
  templateUrl: './member-assign-dialogue.component.html',
  styleUrls: ['./member-assign-dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class memberAssignDialogueComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  memberData: memberHeader[];
  displayedColumns: string[] = ['selected', 'memberId', 'firstName', 'address', 'preferredLanguage', 'phoneNumber', 'memberTimeZone', 'ethnicity', 'gender'];
  dataSource: MatTableDataSource<memberHeader> = new MatTableDataSource<memberHeader>(this.memberData);
  memberAssignForm: FormGroup;
  memberAssign = new MemberAssign();
  genders = ['Male', 'Female', 'Other', 'Refuse to disclose'];
  selectedMember: memberHeader;
  memberSearch = new memberSearch();
  effectiveDate = new FormControl(new Date(), Validators.required);
  minDate = new Date();
  maxDate;
  public pageSize = 4;
  public pageNumber = 0;
  public memberToBeAssigned: any;
  public today: any;
  public assignButton: boolean = false;
  public todayFormatted: any;
  public isLoadingResults: boolean = false;
  public totalRecords;
  public arrayVal;
  public arrayState: any[] = [];
  public arrayGender: any[] = [];
  public arrayTimeZone: any[] = [];
  public arrayLanguage: any[] = [];
  public arrayPhonepalStatus: any[] = [];
  public arrayEthnicity: any[] = [];

  constructor(private messageService: SharedService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<memberAssignDialogueComponent>, private overlayContainer: OverlayContainer, private userDetails: getUser,
    private urlconstantService: UrlconstantsService, private memberDetails: connectorServices, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.overlayContainer.getContainerElement().classList.add("profilepagetheme");
  }

  urlConstants = this.urlconstantService.getUrls();
  ngOnInit() {
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
    let url = this.urlConstants.getAssociateUrl.replace('{alias}', this.data.dataKey)
    this.userDetails.getAssocaiteData(url).subscribe(data => {
      this.isLoadingResults = false;
      if (data) {
        let endDate = new Date(data.availabilityEndDate.toString().substring(0, data.availabilityEndDate.toString().indexOf(" ")).replace(/-/g, '\/'));
        let effective = new Date(data.availabilityStartDt.toString().substring(0, data.availabilityStartDt.toString().indexOf(" ")).replace(/-/g, '\/'));
        this.effectiveDate.patchValue(new Date(effective))
        this.minDate = new Date(effective);
        this.maxDate = new Date(endDate);
      }
    }, (error) => {
      this.isLoadingResults = false;
    })
  }
  radioChange(event: MatRadioChange) {
    this.memberToBeAssigned = event.value.memberId;
    this.memberAssign.memberId = this.memberToBeAssigned;
    this.memberAssign.effectiveDt = getformatedDate(this.effectiveDate.value);
    this.memberAssign.termDt = event.value.terminationDt;
    this.memberAssign.connectorId = sessionStorage.getItem('alias');
    this.memberAssign.createdBy = sessionStorage.getItem('alias');
    this.memberAssign.updatedDt = this.getTodayDate();
    this.memberAssign.primaryAlias = this.data.dataKey
    this.memberAssign.createdDt = this.getTodayDate();
    this.memberAssign.assignedDt = this.getTodayDate();
  }
  close() {
    this.dialogRef.close();
  }

  clear() {
    this.memberAssignForm.reset();
    this.memberAssignForm.updateValueAndValidity();
    this.dataSource.data = [];
  }

  getTodayDate() {
    this.today = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-dd');
    this.todayFormatted = this.today + " 00:00:00.000"
    return this.todayFormatted;
  }

  assignMember() {
    this.memberAssign.assignedDt = getformatedDate(this.effectiveDate.value);
    this.dialogRef.close();
    let body = this.memberAssign
    let url = this.urlConstants.assignAssociateMember;
    this.memberDetails.roleChange(url, body).subscribe(data => {
      if (data.errorCode == 500) {
        // Calling next to emit value from the observer
        this.messageService.updateStatusMessage(data.details);
      } else {
        // Calling next to emit value from the observer
        this.messageService.updateStatusMessage('assigmentsuccessful');
      }
    }, (error) => {
      // Calling next to emit value from the observer
      this.messageService.updateStatusMessage('assigmentfailed');
    })
  }

  pageEvent(event) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchMember(false)
  }

  searchMember(isSearch: boolean) {
    if (isSearch) {
      this.paginator.pageIndex = 0
      this.memberSearch.pageNumber = 0;
      this.memberSearch.pageSize = 4;
    } else {
      this.memberSearch.pageNumber = this.pageNumber;
      this.memberSearch.pageSize = this.pageSize;
    };
    this.memberSearch.address = {
      city: this.memberAssignForm.controls.city.value,
      state: this.memberAssignForm.controls.state.value
    }
    this.memberSearch.connectorAlias = sessionStorage.getItem('alias')
    this.memberSearch.ethnicity = this.memberAssignForm.controls.ethnicity.value;
    this.memberSearch.gender = this.memberAssignForm.controls.gender.value;
    this.memberSearch.preferredLanguage = this.memberAssignForm.controls.language.value != null ? this.memberAssignForm.controls.language.value.length > 0 ? this.memberAssignForm.controls.language.value : null : null;
    this.memberSearch.memberTimeZone = this.memberAssignForm.controls.timeZone.value != null ? this.memberAssignForm.controls.timeZone.value.length > 0 ? this.memberAssignForm.controls.timeZone.value : null : null;
    let body = this.memberSearch;
    this.isLoadingResults = true;
    let url = this.urlConstants.getMembersforphonepal;
    this.memberDetails.getMemberFilteredData(url, body).subscribe(memberData => {
      this.memberData = memberData.list;
      this.totalRecords = memberData.totalRecords;
      this.dataSource.data = this.memberData;
      this.isLoadingResults = false;
    }, (error) => {
      this.isLoadingResults = false;
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
