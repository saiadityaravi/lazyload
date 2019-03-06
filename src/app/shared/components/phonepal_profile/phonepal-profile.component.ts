import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PhonepalEnroll } from '../../models/phonepalEnroll.model';
import { ValidationService } from '../../../core/utilities/validation.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { DatePipe } from '@angular/common';
import { getUser } from '../../services/userDetailsService';
import { UrlconstantsService } from '../../services/urlconstants.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import decode from 'jwt-decode';
import { distinctUntilChanged } from 'rxjs/operators';
import { getformatedDate } from '../../../core/utilities/utilityHelper';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
    selector: 'app-phonepal-profile',
    templateUrl: './phonepal-profile.component.html',
    styleUrls: ['./phonepal-profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PhonepalProfileComponent implements OnInit {
    enrollSubscription: Subscription;
    enrollDialogueSubscripton: Subscription;
    updateProfileSubscription: Subscription;
    addAssociateSubscription: Subscription;
    ldapAssociationSubscription: Subscription;
    bsConfig: Partial<BsDatepickerConfig>;
    enrollForm: FormGroup;
    vacationStartDt: any = "";
    vacationEndDate: any = "";
    phonepalEnrollmodel = new PhonepalEnroll();
    minDate: Date;
    isLoadingResults: boolean = false;
    isLoadingResults1: boolean = false;
    maxDate: Date;
    today: any;
    todayFormatted: string;
    isDisabled: boolean = true;
    minDateAvailablity: Date;
    updateAssicateId: any;
    updateVacationId: any;
    nomination: any;
    welcomeEmail: any;
    trainingCompletionDt: any;
    nominationApprovalDt: any;
    public arrayVal;
    public arrayState: any[] = [];
    public arrayTimeZone: any[] = [];
    public arrayLanguage: any[] = [];
    role:any = null;
    isDate: boolean = false;
    public mask = {
        guide: false,
        showMask: false,
        mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    };
    constructor(
        private toastr: ToastrService, private fb: FormBuilder, private activatedRoute: ActivatedRoute, private route: Router, public messageService: SharedService, private userDetails: getUser, private urlconstants: UrlconstantsService
    ) {
        let dropdownurl = this.urlconstantsService.getLookUpValues;
        this.bsConfig = Object.assign({}, { showWeekNumbers: false, containerClass: "theme-default", rangeInputFormat: 'MM/DD/YYYY', });
        let path = this.activatedRoute.snapshot.url[0] ? this.activatedRoute.snapshot.url[0].path : null;
        if (path == "profile") {
            this.getPhonepalData(sessionStorage.getItem('alias'));
        }

        this.minDateAvailablity = new Date();
        this.minDateAvailablity.setDate(this.minDateAvailablity.getDate());

    }
    urlconstantsService = this.urlconstants.getUrls();
    getLdapUrl = this.urlconstantsService.getLdapUserData.replace('{alias}', sessionStorage.getItem('alias'));

  /**
   * Function to get Search associate data
   *
   * @param alias
   */
    getPhonepalData(alias) {
        this.messageService.setshowSpinner(true);
        let body = `{
            "alias":"${alias}",
            "pageSize": ${1},
            "pageNumber": ${0}
        }`
        let url = this.urlconstantsService.getAllPhonepals;
        this.userDetails.searchAssociate(url, body).subscribe(profileData => {
            this.disableStartDatePicker(new Date(profileData.list[0].availabilityStartDt.toString().substring(0, profileData.list[0].availabilityStartDt.toString().indexOf(" ")).replace(/-/g, '\/')));
            this.messageService.setshowSpinner(false);
            this.updateAssicateId = profileData.list[0].id;
            this.updateVacationId = profileData.list[0].associateVacation != null ? profileData.list[0].associateVacation[0].id : "";
            this.nomination = profileData.list[0].nominationDt;
            this.welcomeEmail = profileData.list[0].welcomeEmailDt;
            this.nominationApprovalDt = profileData.list[0].nominationApprovalDt;
            this.trainingCompletionDt = profileData.list[0].trainingCompletionDt;
            this.isDisabled = false;
            this.messageService.setDateMessage(profileData.list[0].status, profileData.list[0].nominationDt, profileData.list[0].welcomeEmailDt, profileData.list[0].trainingCompletionDt, profileData.list[0].nominationApprovalDt)
            this.enrollForm.patchValue({
                alias: profileData.list[0].alias,
                firstName: profileData.list[0].firstName,
                language_array: profileData.list[0].language,
                lastName: profileData.list[0].lastName,
                email: profileData.list[0].email,
                city: profileData.list[0].city,
                state: profileData.list[0].state,
                phoneNumber: this.getFormattedPhonenumber(profileData.list[0].phoneNumber),
                timezone: profileData.list[0].timezone,
                availabilityStartDt: new Date(profileData.list[0].availabilityStartDt.toString().substring(0, profileData.list[0].availabilityStartDt.toString().indexOf(" ")).replace(/-/g, '\/')),
                availabilityEndDate: new Date(profileData.list[0].availabilityEndDate.toString().substring(0, profileData.list[0].availabilityEndDate.toString().indexOf(" ")).replace(/-/g, '\/')),
                vacationDt: profileData.list[0].associateVacation ? (profileData.list[0].associateVacation[0].vacationStartDt ? [new Date(profileData.list[0].associateVacation[0].vacationStartDt.substring(0, profileData.list[0].associateVacation[0].vacationStartDt.indexOf(" ")).replace(/-/g, '\/')), new Date(profileData.list[0].associateVacation[0].vacationEndDt.substring(0, profileData.list[0].associateVacation[0].vacationEndDt.indexOf(" ")).replace(/-/g, '\/'))] : "") : "",
            })
        }, (error) => {
            this.messageService.setshowSpinner(false);
        })
    }

    ngOnInit() {
        this.enrollForm = this.fb.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            alias: [null],
            email: [null, [Validators.required, ValidationService.validateEmail()]],
            city: [null, Validators.required],
            state: [null, Validators.required],
            language_array: [[], Validators.required],
            timezone: [null, Validators.required],
            phoneNumber: [null, [Validators.required, Validators.minLength(14)]],
            availabilityStartDt: [null, Validators.required],
            availabilityEndDate: [null, [Validators.required, ValidationService.validateRange()]],
            vacationDt: [null]
        })
        
        // Subscribe to the Subject to create an observer
        this.enrollSubscription = this.messageService.enrollMessage.subscribe(data => {
            if (data)
                this.enrollPhonepal();
        })

        /**
         * Observable to add associates from admin screen
         *
         */
        this.addAssociateSubscription = this.messageService.addAssociate$.subscribe(data => {
            if (data)
                this.addAssociate();
        })

        this.enrollForm.controls.availabilityStartDt.valueChanges.pipe(distinctUntilChanged()).subscribe(date => {
            this.enrollForm.controls.vacationDt.patchValue(null);
            this.enrollForm.controls.availabilityEndDate.patchValue(null);
        })

        this.enrollForm.controls.availabilityEndDate.valueChanges.pipe(distinctUntilChanged()).subscribe(date => {
            this.enrollForm.controls.vacationDt.patchValue(null);
        })

        // Subscribe to the Subject to create an observer
        this.enrollDialogueSubscripton = this.messageService.enrollDialogueForm.subscribe(open => {
            if (open) {
                this.isLoadingResults = true;
                this.userDetails.getUserLdap(this.getLdapUrl).subscribe(data => {
                    this.isLoadingResults = false;
                    this.enrollForm.controls.alias.patchValue(data[0].userName)
                    this.enrollForm.controls.firstName.patchValue(data[0].firstName)
                    this.enrollForm.controls.lastName.patchValue(data[0].lastName)
                    this.enrollForm.controls.email.patchValue(data[0].email)
                    this.enrollForm.controls.city.patchValue(data[0].city == null ? "" : data[0].city)
                    this.enrollForm.controls.state.patchValue(data[0].state == null ? "" : data[0].state)
                    if (data[0].phoneNumber != null) {
                        var formattedContact = "";
                        var cleaned = ('' + data[0].phoneNumber).replace(/\D/g, '')
                        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
                        formattedContact = '(' + match[1] + ') ' + match[2] + '-' + match[3];
                        this.enrollForm.controls.phoneNumber.patchValue(formattedContact);
                    } else {
                        this.enrollForm.controls.phoneNumber.patchValue("");
                    }
                },(error)=>{
                    this.isLoadingResults = false;
                })
            }
        })
        
        // Subscribe to the Subject to create an observer
        this.messageService.phonepalProfile.subscribe(data => {
            this.enrollForm.reset();
        })

        // Subscribe to the Subject to create an observer
        this.updateProfileSubscription = this.messageService.updateProile.pipe(distinctUntilChanged()).subscribe(isUpdated => {
            if (isUpdated) {
                if (!this.enrollForm.controls.availabilityStartDt.dirty) {
                    this.enrollForm.controls.availabilityStartDt.disable({ onlySelf: true, emitEvent: false });
                    this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                }
                if (!this.enrollForm.controls.availabilityEndDate.dirty) {
                    this.enrollForm.controls.availabilityEndDate.disable({ onlySelf: true, emitEvent: false });
                    this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                }
                if (!this.enrollForm.controls.vacationDt.dirty) {
                    this.enrollForm.controls.vacationDt.disable({ onlySelf: true, emitEvent: false });
                    this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                }
                if (this.enrollForm.valid && this.enrollForm.dirty) {
                    this.setPhonepalData();
                    let url = this.urlconstantsService.updateAssociateProfile;
                    this.messageService.setUpdateProfile(false)
                    this.userDetails.updatePhonepal(url, 'put', this.phonepalEnrollmodel).subscribe(data => {
                        this.messageService.setEnroolMessage(false);
                        this.messageService.setshowSpinner(false);
                        if (!this.enrollForm.controls.availabilityStartDt.dirty) {
                            this.enrollForm.controls.availabilityStartDt.enable({ onlySelf: true, emitEvent: false });
                            this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                        }
                        if (!this.enrollForm.controls.availabilityEndDate.dirty) {
                            this.enrollForm.controls.availabilityEndDate.enable({ onlySelf: true, emitEvent: false });
                            this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                        }
                        if (!this.enrollForm.controls.vacationDt.dirty) {
                            this.enrollForm.controls.vacationDt.enable({ onlySelf: true, emitEvent: false });
                            this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                        }
                        this.route.navigateByUrl('/phonepal/profile');
                        this.getPhonepalData(sessionStorage.getItem('alias'));
                        this.toastr.success('Successfully updated');
                    }, (error) => {
                        this.toastr.warning('Oops!! something went wrong. Please try again');
                        this.messageService.setshowSpinner(false);
                        this.messageService.setUpdateProfile(false)
                    })
                } else {
                    if (!this.enrollForm.controls.availabilityStartDt.dirty) {
                        this.enrollForm.controls.availabilityStartDt.enable({ onlySelf: true, emitEvent: false });
                        this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                    }
                    if (!this.enrollForm.controls.availabilityEndDate.dirty) {
                        this.enrollForm.controls.availabilityEndDate.enable({ onlySelf: true, emitEvent: false });
                        this.enrollForm.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                    }
                    if (!this.enrollForm.controls.vacationDt.dirty) {
                        this.enrollForm.controls.vacationDt.enable({ onlySelf: true, emitEvent: false });
                        this.enrollForm.controls.vacationDt.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                    }
                    this.messageService.setUpdateProfile(false)
                    if (this.enrollForm.dirty) {
                        this.toastr.warning('Oops!! something went wrong. Please try again');
                    }
                    this.messageService.setshowSpinner(false);
                    this.markFormGroupTouched(this.enrollForm);
                }
            }
        })

        /**
         *Patch ldap details while admin trying to add casemanager or connector 
         */
      this.ldapAssociationSubscription = this.messageService.ldapData.subscribe(userDate=>{
          this.role = userDate.role;
             this.enrollForm.controls.alias.patchValue(userDate.data.userName)
             this.enrollForm.controls.firstName.patchValue(userDate.data.firstName)
             this.enrollForm.controls.lastName.patchValue(userDate.data.lastName)
             this.enrollForm.controls.email.patchValue(userDate.data.email)
             this.enrollForm.controls.city.patchValue(userDate.data.city == null ? "" : userDate.data.city)
             this.enrollForm.controls.state.patchValue(userDate.data.state == null ? "" : userDate.data.state)
             if (userDate.data.phoneNumber != null) {
                 var formattedContact = "";
                 var cleaned = ('' + userDate.data.phoneNumber).replace(/\D/g, '')
                 var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
                 formattedContact = '(' + match[1] + ') ' + match[2] + '-' + match[3];
                 this.enrollForm.controls.phoneNumber.patchValue(formattedContact);
             } else {
                 this.enrollForm.controls.phoneNumber.patchValue("");
             }
        })
        this.getTodayDate();
        this.dropDownValues();
    }

    // Get phone number in US format
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

    // Populate combox values
    dropDownValues() {
        let dropdownurl = this.urlconstants.getUrls().getLookUpValues;
        let url = dropdownurl + "?clientId=1";
        this.messageService.getDropDownValues(url).subscribe(profileData => {
          this.arrayVal = profileData;
          let num:number = 0;
          let i:number;
          for(i = num;i<=this.arrayVal.length;i++) {
            for (let key in profileData[i]) {
              if(key === "State"){
                let mainObj = profileData[i];
                this.arrayState = ddlArray(mainObj);
              } else if (key === "Language") {
                let mainObj = profileData[i];
                this.arrayLanguage = ddlArray(mainObj);
              } else if (key === "TimeZone") {
                let mainObj = profileData[i];
                this.arrayTimeZone = ddlArray(mainObj);
            }
            }
          }
        }, (error) => {
          this.messageService.setshowSpinner(false);
        });
    }

    disableStartDatePicker(startDate) {

        if ((new Date().toDateString() > startDate.toDateString())) {
            this.isDate = true;
        }
    }

    ngOnDestroy() {
        this.enrollDialogueSubscripton.unsubscribe();
        this.enrollSubscription.unsubscribe();
        this.updateProfileSubscription.unsubscribe();
        this.addAssociateSubscription.unsubscribe();
        this.ldapAssociationSubscription.unsubscribe();
    }

    // Get min and max date
    public getmaxAndMinDate() {
        if (this.enrollForm.controls.availabilityStartDt.value != null && this.enrollForm.controls.availabilityEndDate.value != null) {
            this.minDate = new Date(this.enrollForm.controls.availabilityStartDt.value);
            this.maxDate = new Date(this.enrollForm.controls.availabilityEndDate.value);
            this.isDisabled = false;
        } else {
            this.isDisabled = true;
        }
    }

    // Phonepal vacation start and end date
    public vacationDates() {
        if (this.enrollForm.controls.vacationDt.value) {
            let vacationDate = this.enrollForm.controls.vacationDt.value;
            this.vacationStartDt = getformatedDate(vacationDate[0]);
            this.vacationEndDate = getformatedDate(vacationDate[1]);
        } else {
            this.vacationStartDt = "";
            this.vacationEndDate = "";
        }
    }

    // Get today's date in yyyy-MM-dd hh:mm:ss.000 format
    getTodayDate() {
        this.today = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-dd');
        return this.todayFormatted = this.today + " 00:00:00.000"
    }

    // Display error message if firstName field is empty
    getErrorMessagefirstName() {
        return this.enrollForm.controls.firstName.hasError('required') ? 'First Name is required' : null;
    }

    // Display error message if lastName field is empty
    getErrorMessagelastName() {
        return this.enrollForm.controls.lastName.hasError('required') ? 'Last Name is required' : null;
    }

    // Display error message if email field is empty
    getErrorMessageEmail() {
        return this.enrollForm.controls.email.hasError('required') ? ' Email ID is required' : 'please provide valid Email ID';
    }

    // Display error message if city field is empty
    getErrorMessageCity() {
        return this.enrollForm.controls.city.hasError('required') ? ' City is required' : null;
    }

    // Display error message if state field is empty
    getErrorMessageState() {
        return this.enrollForm.controls.state.hasError('required') ? ' State is required ' : null;
    }

    // Display error message if language field is empty
    getErrorMessageLanguage() {
        return this.enrollForm.controls.language_array.hasError('required') ? ' Language is required' : null;
    }

    // Display error message if timezone field is empty
    getErrorMessageTimezone() {
        return this.enrollForm.controls.timezone.hasError('required') ? 'Time zone is required' : null;
    }

    // Display error message if phoneNumber field is empty
    getErrorMessagePhonenumber() {
        return this.enrollForm.controls.phoneNumber.hasError('required') ? ' Phone number is required' : 'Provide valid phone number';
    }

    // Display error message if availabilityStartDt field is empty
    getErrorMessageAvailabilityStart() {
        return this.enrollForm.controls.availabilityStartDt.hasError('required') ? '  Availability start date is required' : null;
    }

    // Display error message if availabilityEndDate field is empty
    getErrorMessageAvailabilityEnd() {
        return this.enrollForm.controls.availabilityEndDate.hasError('required') ? '  Availability end date is required' : 'Minimum Availablity should be 6 months';
    }

    // Display error message if vacationDt field is empty
    getErrorMessageVacation() {
        return this.enrollForm.controls.vacationDt.hasError('required') ? ' Vacation is required' : null;
    }

    // Set phonepal information
    setPhonepalData() {
        this.vacationDates();
        if (sessionStorage.getItem('jwt')) {
            const token = sessionStorage.getItem('jwt');
            const tokenPayload = decode(token);
            this.phonepalEnrollmodel.roleDesc = tokenPayload.scopes.substring(tokenPayload.scopes.indexOf('_') + 1, tokenPayload.scopes.length);
        }
        this.phonepalEnrollmodel.id = this.updateAssicateId;
        this.phonepalEnrollmodel.firstName = this.enrollForm.controls.firstName.value;
        this.phonepalEnrollmodel.lastName = this.enrollForm.controls.lastName.value;
        this.phonepalEnrollmodel.email = this.enrollForm.controls.email.value;
        this.phonepalEnrollmodel.alias = this.enrollForm.controls.alias.value;
        this.phonepalEnrollmodel.state = this.enrollForm.controls.state.value;
        this.phonepalEnrollmodel.city = this.enrollForm.controls.city.value;
        this.phonepalEnrollmodel.language = this.enrollForm.controls.language_array.value;
        this.phonepalEnrollmodel.availabilityStartDt = getformatedDate(this.enrollForm.controls.availabilityStartDt.value);;
        this.phonepalEnrollmodel.availabilityEndDate = getformatedDate(this.enrollForm.controls.availabilityEndDate.value);;
        this.phonepalEnrollmodel.phoneNumber = this.enrollForm.controls.phoneNumber.value;
        this.phonepalEnrollmodel.timezone = this.enrollForm.controls.timezone.value;
        this.phonepalEnrollmodel.officeLocation = this.enrollForm.controls.state.value;
        this.phonepalEnrollmodel.updatedDt = this.todayFormatted;
        this.phonepalEnrollmodel.nominationDt = this.nomination;
        this.phonepalEnrollmodel.status = "";
        this.phonepalEnrollmodel.source = getDomainTitle()=="Togetherness"?"caremore":"anthem";
        this.phonepalEnrollmodel.welcomeEmailSentDt = this.welcomeEmail;
        this.phonepalEnrollmodel.trainingCompletionDt = this.trainingCompletionDt;
        this.phonepalEnrollmodel.nominationApprovalDt = this.nominationApprovalDt;
        this.phonepalEnrollmodel.updatedBy = sessionStorage.getItem('alias');
        this.phonepalEnrollmodel.updatedDt = this.getTodayDate();
        if (this.updateVacationId == "" && this.vacationStartDt != "") {
            this.phonepalEnrollmodel.associateVacation = [{
                alias: this.enrollForm.controls.alias.value,
                vacationStartDt: this.vacationStartDt == "" ? null : this.vacationStartDt,
                vacationEndDt: this.vacationEndDate == "" ? null : this.vacationEndDate,
                clientId: 1,
                subClientId: 1000,
                createdDt: this.todayFormatted,
                createdBy: this.enrollForm.controls.alias.value,
                updatedDt: '',
                updatedBy: ''
            }]
        } else if (this.updateVacationId != "" && this.vacationStartDt != "") {
            this.phonepalEnrollmodel.associateVacation = [{
                id: this.updateVacationId,
                alias: this.enrollForm.controls.alias.value,
                vacationStartDt: this.vacationStartDt == "" ? null : this.vacationStartDt,
                vacationEndDt: this.vacationEndDate == "" ? null : this.vacationEndDate,
                clientId: 1,
                subClientId: 1000,
                createdDt: '',
                createdBy: '',
                updatedDt: this.todayFormatted,
                updatedBy: this.enrollForm.controls.alias.value
            }]
        } else if (this.updateVacationId != "" && this.vacationStartDt == "") {
            this.phonepalEnrollmodel.associateVacation = [{
                id: this.updateVacationId,
                alias: this.enrollForm.controls.alias.value,
                clientId: 1,
                subClientId: 1000,
                createdDt: "",
                createdBy:"",
                updatedDt: this.todayFormatted,
                updatedBy: this.enrollForm.controls.alias.value
            }]
        }
    }

    // Method to enroll phonepal
    enrollPhonepal() {
        this.isLoadingResults = true;
        if (this.enrollForm.valid) {
            this.phonepalEnrollmodel.firstName = this.enrollForm.controls.firstName.value;
            this.phonepalEnrollmodel.lastName = this.enrollForm.controls.lastName.value;
            this.phonepalEnrollmodel.email = this.enrollForm.controls.email.value;
            this.phonepalEnrollmodel.alias = this.enrollForm.controls.alias.value;
            this.phonepalEnrollmodel.state = this.enrollForm.controls.state.value;
            this.phonepalEnrollmodel.city = this.enrollForm.controls.city.value;
            this.phonepalEnrollmodel.language = this.enrollForm.controls.language_array.value;
            this.phonepalEnrollmodel.availabilityStartDt = getformatedDate(this.enrollForm.controls.availabilityStartDt.value);;
            this.phonepalEnrollmodel.availabilityEndDate = getformatedDate(this.enrollForm.controls.availabilityEndDate.value);;
            this.phonepalEnrollmodel.phoneNumber = this.enrollForm.controls.phoneNumber.value;
            this.phonepalEnrollmodel.timezone = this.enrollForm.controls.timezone.value;
            this.phonepalEnrollmodel.status = "Pending";
            this.phonepalEnrollmodel.officeLocation = this.enrollForm.controls.state.value;
            this.phonepalEnrollmodel.nominationDt = this.todayFormatted;
            this.phonepalEnrollmodel.welcomeEmailSentDt = this.todayFormatted;
            this.phonepalEnrollmodel.clientId = 1;
            this.phonepalEnrollmodel.source = getDomainTitle()=="Togetherness"?"caremore":"anthem";
            this.phonepalEnrollmodel.subClientId = 1000;
            this.phonepalEnrollmodel.createdBy = this.enrollForm.controls.alias.value;
            this.phonepalEnrollmodel.createdDt = this.todayFormatted;
            if (this.enrollForm.controls.vacationDt.value != null) {
                this.phonepalEnrollmodel.associateVacation = [{
                    alias: this.enrollForm.controls.alias.value,
                    vacationStartDt: this.vacationStartDt = "" ? null : this.vacationStartDt,
                    vacationEndDt: this.vacationEndDate = "" ? null : this.vacationEndDate,
                    clientId: 1,
                    subClientId: 1000,
                    createdDt: this.todayFormatted,
                    createdBy: this.enrollForm.controls.alias.value,
                    updatedDt: null,
                    updatedBy: null
                }]
            } else {
                this.phonepalEnrollmodel.associateVacation = null;
            }
            let url = this.urlconstantsService.enrollPhonepal;
            this.userDetails.enrollPhonepal(url, 'post', this.phonepalEnrollmodel).subscribe(data => {
                sessionStorage.setItem('jwt', data.token)
                this.messageService.setEnroolMessage(false);
                this.isLoadingResults = false
                this.route.navigateByUrl('/phonepal/profile')
            }, (error) => {
                this.isLoadingResults = false
            })
        } else {
            this.isLoadingResults = false;
            this.markFormGroupTouched(this.enrollForm);
        }
    }

    /**
     * add Associate from admin screen(casemanager or connectors)
     * @param null 
     */
    addAssociate(){
        this.isLoadingResults1 = true;
        if (this.enrollForm.valid) {
            this.phonepalEnrollmodel.firstName = this.enrollForm.controls.firstName.value;
            this.phonepalEnrollmodel.lastName = this.enrollForm.controls.lastName.value;
            this.phonepalEnrollmodel.email = this.enrollForm.controls.email.value;
            this.phonepalEnrollmodel.alias = this.enrollForm.controls.alias.value;
            this.phonepalEnrollmodel.state = this.enrollForm.controls.state.value;
            this.phonepalEnrollmodel.city = this.enrollForm.controls.city.value;
            this.phonepalEnrollmodel.roleDesc = this.role;
            this.phonepalEnrollmodel.language = this.enrollForm.controls.language_array.value;
            this.phonepalEnrollmodel.availabilityStartDt = getformatedDate(this.enrollForm.controls.availabilityStartDt.value);;
            this.phonepalEnrollmodel.availabilityEndDate = getformatedDate(this.enrollForm.controls.availabilityEndDate.value);;
            this.phonepalEnrollmodel.phoneNumber = this.enrollForm.controls.phoneNumber.value;
            this.phonepalEnrollmodel.timezone = this.enrollForm.controls.timezone.value;
            this.phonepalEnrollmodel.status = "Approved";
            this.phonepalEnrollmodel.officeLocation = this.enrollForm.controls.state.value;
            this.phonepalEnrollmodel.nominationDt = this.todayFormatted;
            this.phonepalEnrollmodel.welcomeEmailSentDt = this.todayFormatted;
            this.phonepalEnrollmodel.clientId = 1;
            this.phonepalEnrollmodel.source = getDomainTitle()=="Togetherness"?"caremore":"anthem";
            this.phonepalEnrollmodel.subClientId = 1000;
            this.phonepalEnrollmodel.createdBy = this.enrollForm.controls.alias.value;
            this.phonepalEnrollmodel.createdDt = this.todayFormatted;
            if (this.enrollForm.controls.vacationDt.value != null) {
                this.phonepalEnrollmodel.associateVacation = [{
                    alias: this.enrollForm.controls.alias.value,
                    vacationStartDt: this.vacationStartDt = "" ? null : this.vacationStartDt,
                    vacationEndDt: this.vacationEndDate = "" ? null : this.vacationEndDate,
                    clientId: 1,
                    subClientId: 1000,
                    createdDt: this.todayFormatted,
                    createdBy: this.enrollForm.controls.alias.value,
                    updatedDt: null,
                    updatedBy: null
                }]
            } else {
                this.phonepalEnrollmodel.associateVacation = null;
            }
            let url = this.urlconstantsService.enrollPhonepal;
            this.userDetails.enrollPhonepal(url, 'post', this.phonepalEnrollmodel).subscribe(data => {
                this.isLoadingResults1 = false
                this.toastr.success("Successfully added " + this.role );
                this.messageService.setaddedAssociate(true);
            }, (error) => {
                this.isLoadingResults1 = false
            })
        } else {
            this.messageService.setaddedAssociate(false);
            this.isLoadingResults1 = false;
            this.markFormGroupTouched(this.enrollForm);
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
}