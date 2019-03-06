import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { MemberReferral } from '../../model/memberReferral.model';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { CaseManagerService } from '../../service/casemanager.data.service';
import decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import {getformatedDate} from '../../../core/utilities/utilityHelper'

@Component({
  selector: 'app-member_referral_dialoge',
  templateUrl: './member-referral-dialoge.html',
  styleUrls: ['./member-referral-dialoge.scss'],
  encapsulation: ViewEncapsulation.None
})

// Casemanager - Member Referral Dialog Component
export class memberrefrerralDialogueComponent implements OnInit {
  public memberDOB:any;
  public urlConstants: any;
  public email: string = "";
  public firstName: string = "";
  public phoneNumber: string = "";
  public maxDate: any;
  memberForm: FormGroup;
  referralForm: FormGroup;
  intermediateForm: FormGroup;
  healthInfoForm: FormGroup;
  memberSearchForm: FormGroup;
  memberReferralModel: MemberReferral;
  isLoadingResults: boolean = false;
  theme = 'profilepagetheme';
  theme2 = 'togethernessapptheme'
  public arrayVal;
  public arrayGender: any[] = [];
  public arrayLanguage: any[] = [];
  public arrayEthnicity: any[] = [];
  public arrayTimeZone: any[] = [];
  public arrayLeavesHome: any[] = [];
  public arrayReferralSource: any[] = [];
  public arrayState: any[] = [];

  public isLinear: boolean = true;
  public isOtherLanguage: boolean = false;
  public errorSelected: boolean = false;
  public genericSelected: boolean = false;
  constructor(private toastr: ToastrService, private datepipe: DatePipe, private dataService: CaseManagerService, private messageService: SharedService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<memberrefrerralDialogueComponent>, private overlayContainer: OverlayContainer, private urlConstantService: UrlconstantsService) {
    // Get Associate Profile data
    this.urlConstants = this.urlConstantService.getUrls();
    let url = this.urlConstants.getAssociateUrl.replace('{alias}', decode(sessionStorage.getItem('jwt')).sub);
    this.dataService.getAssociateProfile(url).subscribe(data => {
      if (data) {
        this.firstName = data.lastName + ', ' + data.firstName;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
      }
    }, (error) => {
      this.toastr.warning('Oops!! Something went wrong in fetching your profile information.');
    });
  }

  ngOnInit() {
    this.memberSearchForm = this.fb.group({
      memberID: ['', Validators.required]
    });

    this.referralForm = this.fb.group({
      refName: [''],
      refEmail: [''],
      refPhoneNumber: [''],
      refMemberNotes: [''],
      source: ['', Validators.required]
    });

    this.intermediateForm = this.fb.group({
      altPhoneNumber: [''],
      productPlan: ['', Validators.required],
      ethnicity: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      terminationDate: ['', Validators.required],
      pcpname: [''],
      timezone: ['', Validators.required]
    });

    this.healthInfoForm = this.fb.group({
      healthInfoHowOften: ['', []],
      healthInfoHasNoOne: ['', []],
      healthInfoLiveAlone: ['', []],
      healthInfoHasSupport: ['', []],
      healthInfoMemberCritical: ['', []],
      healthInfoStatusDate: [new Date()],
    });

    this.memberForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      languages: ['', Validators.required],
      otherLanguage: ['', []],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{1,5}$/)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.dropDownValues();
  }

  // Populate combo box using values from database
  dropDownValues(){
    let dropdownurl = this.urlConstantService.getUrls().getLookUpValues;
    let url = dropdownurl + "?clientId=1";
    this.messageService.getDropDownValues(url).subscribe(profileData => {
      this.arrayVal = profileData;
      let num:number = 0;
      let i:number;
      for(i = num;i<=this.arrayVal.length;i++) {
        for (let key in profileData[i]) {
          if(key === "Gender"){
            let mainObj = profileData[i];
            this.arrayGender = ddlArray(mainObj);
          } else if(key === "Language"){
            let mainObj = profileData[i];
            this.arrayLanguage = ddlArray(mainObj);
          } else if(key === "TimeZone"){
            let mainObj = profileData[i];
            this.arrayTimeZone = ddlArray(mainObj);
          } else if(key === "LeavesHome"){
            let mainObj = profileData[i];
            this.arrayLeavesHome = ddlArray(mainObj);
          } else if(key === "ReferralSource"){
            let mainObj = profileData[i];
            this.arrayReferralSource = ddlArray(mainObj);
          } else if(key === "State"){
            let mainObj = profileData[i];
            this.arrayState = ddlArray(mainObj);
          } else if(key === "Ethnicity"){
            let mainObj = profileData[i];
            this.arrayEthnicity = ddlArray(mainObj);
          }
        }
      }
    }, (error) => {
      this.messageService.setshowSpinner(false);
    });
  }

  // Get member data from EDH and Anthem
  fetchMemberDetailsandFillReferralForm(memberId: string) {
    let edhUrl = this.urlConstants.getCareMoreMemberData.replace('{memberId}', memberId);
    let antmUrl = this.urlConstants.getAnthemMemberData.replace('{memberId}', memberId);
    this.dataService.getCareMoreMemberInformation(edhUrl, antmUrl).subscribe((data) => {
      if (data != null && (data[0].memberId != null || data[1].memberId != null)) {
        let resource = data[0].memberId != null ? data[0] : data[1];
        this.memberForm.setValue({
          firstName: resource["firstName"] != null ? resource["firstName"] : "",
          lastName: resource["lastName"] != null ? resource["lastName"] : "",
          gender: resource["gender"],
          dob: resource["birthDate"] != null ? new Date(resource["birthDate"]).toISOString() : "",
          address: resource["address"]['address1'] + resource["address"]['address2'],
          languages: "",
          city: resource["address"]['city'] != null ? resource["address"]['city'] : "",
          state: resource["address"]['state'] != null ? resource["address"]['state'] : "",
          zip: resource["address"]['zipCode'] != null ? resource["address"]['zipCode'] : "",
          phoneNumber: resource["phoneNumber"] != null ? this.getFormattedPhonenumber(resource['phoneNumber']) : "",
          otherLanguage: ""
        });
        this.intermediateForm.setValue({
          altPhoneNumber: "",
          productPlan: resource["productPlan"],
          timezone: "",
          ethnicity: resource["ethnicity"],
          effectiveDate: resource["effectiveDt"] != null ? new Date(resource["effectiveDt"]).toISOString() : "",
          terminationDate: resource["terminationDt"] != null ? new Date(resource["terminationDt"]).toISOString() : "",
          pcpname: resource["memberPCPName"]
        });
        this.referralForm.setValue({
          refName: this.firstName,
          refEmail: this.email,
          refPhoneNumber:this.getFormattedPhonenumber(this.phoneNumber),
          refMemberNotes: "",
          source: "",
        });

        this.markFormGroupTouched(this.memberForm);
        this.markFormGroupTouched(this.intermediateForm);
        this.markFormGroupTouched(this.referralForm);
      } else {
        this.toastr.warning('Member with given ID does not exists. Check member id and try again.');
      }

    }, (error) => {
      this.toastr.warning('Oops!! Something went wrong in fetching member data, please try again.');
    });
  }

  // Format phone number to US format
  getFormattedPhonenumber(contact): any {
    if(contact.length>1) {
      var formattedContact = "";
      var cleaned = ('' + contact).replace(/\D/g, '')
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      formattedContact = '(' + match[1] + ') ' + match[2] + '-' + match[3];
      return formattedContact;
    }
    return "";
  }

  // Function to search member
  searchMember(fieldValue: any) {
    this.isLoadingResults = true;
    let edhMemberId = fieldValue.value;
    // Get member information using memberId
    let url = this.urlConstants.getMemberByMemberId.replace('{memberId}', edhMemberId);
    this.dataService.getMemberInformationByMemberID(url).subscribe(data => {
      if (data) {
        if (data.eligibilityStatus != "Denied") {
          this.isLoadingResults = false;
          this.toastr.warning("Member has already been referred");
        } else {
          this.fetchMemberDetailsandFillReferralForm(edhMemberId);
          this.isLoadingResults = false;
        }
      } else {
        this.fetchMemberDetailsandFillReferralForm(edhMemberId);
        this.isLoadingResults = false;
      }
    }, (error) => {
      this.isLoadingResults = false;
    });

  }

  // Add form validation to other language text field if Other Language option is selected
  languageSelected(languageVal) {
    if (languageVal == "Other") {
      this.isOtherLanguage = true;
      this.memberForm.controls["otherLanguage"].setValidators([Validators.required]);
      this.memberForm.controls["otherLanguage"].updateValueAndValidity();
    } else {
      this.isOtherLanguage = false;
      this.memberForm.controls["otherLanguage"].clearValidators();
      this.memberForm.controls["otherLanguage"].updateValueAndValidity();
    }
  }
  // Enable / Disable form validation based on text change in other language text field
  onLanguageChange(txtVal) {
    if (txtVal.length > 0) {
      this.memberForm.controls["otherLanguage"].clearValidators();
      this.memberForm.controls["otherLanguage"].updateValueAndValidity();
    } else {
      this.memberForm.controls["otherLanguage"].setValidators([Validators.required]);
      this.memberForm.controls["otherLanguage"].updateValueAndValidity();
    }
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

  // Text mask applied to angular material input to display US Phonenumber
  public mask = {
    guide: false,
    showMask: false,
    mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  };
  
  // Text mask applied to angular material input to display US zipcode
  public numberMask = {
    guide: false,
    showMask: false,
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/]
  };

  // Method to refer a new member to the togetherness program
  referMember() {
    if (this.memberSearchForm.valid && this.intermediateForm.valid && this.memberForm.valid && this.referralForm.valid) {
      var memberInformation = {
        "member": {
          "memberId": this.memberSearchForm.get('memberID').value,
          "title": "",
          "additionalComment": "",
          "memberPCPPhoneNum": "",
          "eligibilityStatus": "Pending",
          "firstName": this.memberForm.get('firstName').value,
          "lastName": this.memberForm.get('lastName').value,
          "gender": this.memberForm.get('gender').value,
          "birthDate": getformatedDate(this.memberForm.get('dob').value),
          "address": {
            "address1": this.memberForm.get('address').value,
            "address2": "",
            "city": this.memberForm.get('city').value,
            "state": this.memberForm.get('state').value,
            "zipCode": this.memberForm.get('zip').value
          },
          "phoneNumber": this.memberForm.get('phoneNumber').value,
          "preferredLanguage": this.memberForm.get('languages').value + (this.memberForm.get('languages').value == "Other" ? ":" + this.memberForm.get('otherLanguage').value : ""),
          "productPlan": this.intermediateForm.get('productPlan').value,
          "effectiveDt": getformatedDate(this.intermediateForm.get('effectiveDate').value),
          "terminationDt": getformatedDate(this.intermediateForm.get('terminationDate').value),
          "memberPCPName": this.intermediateForm.get('pcpname').value,
          "alternatePhoneNum": this.intermediateForm.get('altPhoneNumber').value,
          "memberTimeZone": this.intermediateForm.get('timezone').value,
          "ethnicity": this.intermediateForm.get('ethnicity').value,
          "memberReferral": {
            "alias": decode(sessionStorage.getItem('jwt')).sub,
            "contactNumber": this.referralForm.get('refPhoneNumber').value,
            "date": getformatedDate(Date.now()),
            "email": this.referralForm.get('refEmail').value,
            "memberId": this.memberSearchForm.get('memberID').value,
            "notes": this.referralForm.get('refMemberNotes').value,
            "refereeName": this.referralForm.get('refName').value,
            "source": this.referralForm.get('source').value,
            "clientId": 1,
            "subClientId": 1000,
            "createdBy": decode(sessionStorage.getItem('jwt')).sub,
            "createdDt": getformatedDate(Date.now()),
            "updatedBy": decode(sessionStorage.getItem('jwt')).sub,
            "updatedDt": getformatedDate(Date.now())
          },
          "memberHealthDetails": {
            "anySocialSupport": this.getControlValue(this.healthInfoForm.get('healthInfoHasSupport')),
            "clientId": 1,
            "hasNooneToTalkTo": this.getControlValue(this.healthInfoForm.get('healthInfoHasNoOne')),
            "healthStatusDt":this.healthInfoForm.get('healthInfoStatusDate').value!=null?  getformatedDate(this.getControlValue(this.healthInfoForm.get('healthInfoStatusDate'))):null,
            "howOftenMemberLeaveHome":this.getControlValue(this.healthInfoForm.get('healthInfoHowOften')),
            "liveAlone": this.getControlValue(this.healthInfoForm.get('healthInfoLiveAlone')),
            "memberId": this.memberSearchForm.get('memberID').value,
            "redFlag": false,
            "subClientId": 1000,
            "createdBy": decode(sessionStorage.getItem('jwt')).sub,
            "createdDt": getformatedDate(Date.now()),
            "updatedBy": decode(sessionStorage.getItem('jwt')).sub,
            "updatedDt": getformatedDate(Date.now())
          },
          "clientId": 1,
          "subClientId": 1000,
          "createdBy": decode(sessionStorage.getItem('jwt')).sub,
          "createdDt": getformatedDate(Date.now()),
          "updatedBy": decode(sessionStorage.getItem('jwt')).sub,
          "updatedDt": getformatedDate(Date.now())
        },
      }

      // Post member information data
      let url = this.urlConstants.saveMemberData;
      this.dataService.postMembersData(url, memberInformation.member).subscribe(
        success => {
          this.dialogRef.close();
          this.toastr.success('Member referred successfully')
        }, (error) => {
          this.isLoadingResults = false;
          this.dialogRef.close();
          this.toastr.warning('Oops!! Something went wrong with member data, please try again');
        });
    } else {
      this.markFormGroupTouched(this.memberForm);
      this.markFormGroupTouched(this.intermediateForm);
      this.markFormGroupTouched(this.memberSearchForm);
      this.markFormGroupTouched(this.referralForm);
    }
  }

  // Function to check whether the control value is not null or undefined
  private getControlValue(ctrl: any) {
    if ((ctrl.value != null) && (ctrl.value != undefined)) {
      return ctrl.value;
    } else {
      return "";
    }
  }


  // Close Member Referral dialog box
  close() {
    this.dialogRef.close();
  }

  // Display error message if MemberID field is empty
  getErrorMessageMemberID() {
    return this.memberSearchForm.controls.memberID.hasError('required') ? 'MemberID is required' : null;
  }

  // Display error message if firstName field is empty
  getErrorMessageFirstName() {
    return this.memberForm.controls.firstName.hasError('required') ? 'First Name is required' : null;
  }

  // Display error message if lastName field is empty
  getErrorMessageLastName() {
    return this.memberForm.controls.lastName.hasError('required') ? 'Last Name is required' : null;
  }

  // Display error message if dob field is empty
  getErrorMessageDOB() {
    return this.memberForm.controls.dob.hasError('required') ? ' Date of birth is required' : null;
  }
  
  // Display error message if gender field is empty
  getErrorMessageGender() {
    return this.memberForm.controls.gender.hasError('required') ? ' Gender is required' : null;
  }
  
  // Display error message if address field is empty
  getErrorMessageAddress() {
    return this.memberForm.controls.address.hasError('required') ? ' Address is required' : null;
  }
  
  // Display error message if city field is empty
  getErrorMessageCity() {
    return this.memberForm.controls.city.hasError('required') ? ' City is required' : null;
  }
  
  // Display error message if state field is empty
  getErrorMessageState() {
    return this.memberForm.controls.state.hasError('required') ? ' State is required ' : null;
  }
  
  // Display error message if zip field is empty
  getErrorMessageZip() {
    return this.memberForm.controls.zip.hasError('required') ? ' zip is required ' : "Zipcode is invalid";
  }
  
  // Display error message if languages field is empty
  getErrorMessageLanguage() {
    return this.memberForm.controls.languages.hasError('required') ? ' Language is required' : null;
  }
  
  // Display error message if phoneNumber field is empty
  getErrorMessagePhoneNumber() {
    return this.memberForm.controls.phoneNumber.hasError('required') ? ' Phone number is required' : 'Provide valid phone number';
  }
  
  // Display error message if refName field is empty
  getErrorMessageRefName() {
    return this.referralForm.controls.refName.hasError('required') ? 'First Name is required' : null;
  }
  
  // Display error message if refPhoneNumber field is empty
  getErrorMessageRefPhoneNumber() {
    return this.referralForm.controls.refPhoneNumber.hasError('required') ? ' Phone number is required' : 'Provide valid phone number';
  }
  
  // Display error message if refEmail field is empty
  getErrorMessageRefEmail() {
    return this.referralForm.controls.refEmail.hasError('required') ? ' Email ID is required' : 'Please provide valid Email ID';
  }

  // Display error message if productPlan field is empty
  getErrorMessageProductPlan() {
    return this.intermediateForm.controls.productPlan.hasError('required') ? ' Product Plan is required ' : null;
  }
  
  // Display error message if timezone field is empty
  getErrorMessageTimezone() {
    return this.intermediateForm.controls.timezone.hasError('required') ? ' Timezone is required ' : null;
  }
  
  // Display error message if ethnicity field is empty
  getErrorMessageEthnicity() {
    return this.intermediateForm.controls.ethnicity.hasError('required') ? ' Ethnicity is required ' : null;
  }
  
  // Display error message if effectiveDate field is empty
  getErrorMessageEffectiveDate() {
    return this.intermediateForm.controls.effectiveDate.hasError('required') ? ' EffDate is required ' : null;
  }
  
  // Display error message if terminationDate field is empty
  getErrorMessageTerminationDate() {
    return this.intermediateForm.controls.terminationDate.hasError('required') ? ' TerDate is required ' : null;
  }
  
  // Display error message if pcpname field is empty
  getErrorMessagePCPName() {
    return this.intermediateForm.controls.pcpname.hasError('required') ? ' PCP Name is required ' : null;
  }
  
  // Display error message if source field is empty
  getErrorMessageRefSource() {
    return this.referralForm.controls.source.hasError('required') ? ' Source is required ' : 'Please select source value';
  }
  
  // Display error message if otherLanguage field is empty
  getErrorMessageOtherLanguage() {
    return this.memberForm.controls.otherLanguage.hasError('required') ? ' *Other Required ' : null;
  }
}