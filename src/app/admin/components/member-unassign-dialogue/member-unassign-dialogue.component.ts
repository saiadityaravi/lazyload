import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatSort, MatChipSelectionChange } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MemberUnAssign } from '../../models/memberUnAssign.model';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { connectorServices } from '../../../shared/services/connector.services';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material'
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { getUser } from '../../../shared/services/userDetailsService';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { memberFiltered } from '../../models/memberFilter.model';

@Component({
  selector: 'app-member-unassign',
  templateUrl: './member-unassign-dialogue.component.html',
  styleUrls: ['./member-unassign-dialogue.component.scss'],
})

// Member Unassign Dialog Component
export class memberUnassignDialogueComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  memberData: memberHeader[];
  displayedColumns: string[] = ['selected', 'memberId', 'firstName', 'address', 'preferredLanguage', 'phoneNumber', 'memberTimeZone', 'ethnicity', 'gender'];
  dataSource: MatTableDataSource<memberHeader> = new MatTableDataSource<memberHeader>(this.memberData);
  memberunassignForm: FormGroup;
  memberunassign;
  genders = ['Male', 'Female', 'Other', 'Refuse to disclose'];
  selectedMember: memberHeader;
  memberSearch = new memberFiltered();
  effectiveDate = new FormControl(new Date(), Validators.required);
  minDate = new Date();
  maxDate;
  public memberToBeunassigned: any;
  public today: any;
  public unassignButton: boolean = false;
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
  unassignMemberArray: any[] = [];
  selectedMemberArray: any[] = [];

  constructor(private messageService: SharedService, private fb: FormBuilder, private toastr: ToastrService,
    public dialogRef: MatDialogRef<memberUnassignDialogueComponent>, private overlayContainer: OverlayContainer, private userDetails: getUser,
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
        this.memberToBeunassigned = true;
      } else {
        this.memberToBeunassigned = false;
      }
      this.records = this.selectedMemberArray.length
    })
    this.getDates()
    this.memberunassignForm = this.fb.group({
      gender: [null],
      language: [null],
      timeZone: [null],
      ethnicity: [null],
      city: [null],
      state: [null]
    })
    this.effectiveDate.valueChanges.subscribe(effDt => {
      if (effDt) {
        this.unassignButton = false;
      } else {
        this.unassignButton = true;
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

  // Get associate profile data
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
        this.connectorName = data.firstName + ' ' + data.lastName;
      }
    }, (error) => {
      this.isLoadingResults = false;
    })
  }

  // Close Dialog box
  close() {
    this.dialogRef.close();
  }

  // Reset Form
  clear() {
    this.memberunassignForm.reset();
    this.memberunassignForm.updateValueAndValidity();
    this.memberToBeunassigned = false;
    this.dataSource.data = [];
  }

  // Function to retrieve date in yyyy-MM-dd 00:00:00.000 format
  getTodayDate() {
    this.today = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-dd');
    this.todayFormatted = this.today + " 00:00:00.000"
    return this.todayFormatted;
  }

  // Function to unassign member
  unassignMember() {
    this.isLoadingResults = true;
    this.selectedMemberArray.forEach(element => {
      this.memberunassign = new MemberUnAssign();
      let memberData: any = element
      this.memberunassign.memberId = memberData.memberId;;
      this.memberunassign.connectorAlias = this.data.dataKey;
      this.unassignMemberArray.push(this.memberunassign)
    });
    let body = this.unassignMemberArray
    let url = this.urlConstants.unassignConnector;
    this.memberDetails.unassignAssociateMember(url, body).subscribe(data => {
      this.unassignMemberArray
      if (data.errorCode == 500) {
        this.isLoadingResults = false;
        this.toastr.warning(data.details)
        this.messageService.updateStatusMessage(data.details);
      } else {
        this.dialogRef.close();
        this.isLoadingResults = false;
        this.toastr.success(this.records + ' Member(s) were unassigned successfully to connector ' + this.connectorName)
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

  // Get Search Member Data
  searchMember(pageIndex, offset, search) {
    if (search) {
      this.selection.clear();
    }
    this.markFormGroupTouched(this.memberunassignForm);
    this.memberSearch.address = {
      city: this.memberunassignForm.controls.city.value ? this.memberunassignForm.controls.city.value : null,
      state: this.memberunassignForm.controls.state.value ? this.memberunassignForm.controls.state.value : null
    }
    this.memberSearch.ethnicity = this.memberunassignForm.controls.ethnicity.value;
    this.memberSearch.gender = this.memberunassignForm.controls.gender.value;
    this.memberSearch.pageNumber = pageIndex;
    this.memberSearch.pageSize = offset;
    this.memberSearch.preferredLanguage = this.memberunassignForm.controls.language.value != null ? this.memberunassignForm.controls.language.value.length > 0 ? this.memberunassignForm.controls.language.value : null : null;
    this.memberSearch.memberTimeZone = this.memberunassignForm.controls.timeZone.value != null ? this.memberunassignForm.controls.timeZone.value.length > 0 ? this.memberunassignForm.controls.timeZone.value : null : null;
    this.memberSearch.connectorAlias = this.data.dataKey; 
    let body = this.memberSearch;
    this.isLoadingResults = true;
    let url = this.urlConstants.searchMemberUrl;
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
    // Add sorting state to tabular data
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

  // Display error message if Status field is empty
  getErrorMessageStatus() {
    return this.memberunassignForm.controls.status.hasError('required') ? 'status is required' : null;
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
