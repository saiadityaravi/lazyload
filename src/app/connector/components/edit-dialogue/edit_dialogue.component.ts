import { Component, OnInit, ViewEncapsulation, NgZone, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { getUser } from '../../../shared/services/userDetailsService';
import { connectorServices } from '../../../shared/services/connector.services';
import { AssociateTrainingStatus } from '../../models/associateTrainingStatus.model';
import { DatePipe } from '@angular/common';
import { associateStatus } from '../../models/associateStatus.model';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { getformatedDate } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-edit_dialogue',
  templateUrl: './edit_dialogue.component.html',
  styleUrls: ['./edit_dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})

// Connector - Dialog box to Edit User Status and Approved Date
export class editDialogueComponent implements OnInit {
  editForm: FormGroup;
  date = new Date();
  maxDate = new Date(this.date);  
  associateTrainingStatus = new AssociateTrainingStatus();
  associateStatus = new associateStatus();
  isLoadingResults: boolean = false;
  public theme: string = 'profilepagetheme';
  public theme2: string = 'togethernessapptheme';
  public statusDisabled: boolean = true;
  public id: any;
  public today:any;
  public todayFormatted:any;
  public arrayVal;
  public arrayPhonePalStatus: any[] = [];

  constructor(private messageService: SharedService, private fb: FormBuilder, private urlConstantService: UrlconstantsService, private userDetails: getUser,
    public dialogRef: MatDialogRef<editDialogueComponent>, private overlayContainer: OverlayContainer, @Inject(MAT_DIALOG_DATA) public data: any, private connectorServices: connectorServices) {

  }
  urlConstants = this.urlConstantService.getUrls();

  // Initialize component, form and subscribe to the subject to create an observer
  ngOnInit() {
    this.editForm = this.fb.group({
      trainingDate: [null],
      status: [null, Validators.required]
    })

    if (this.overlayContainer.getContainerElement().classList.contains("landingpageowncomponentsTheme")) {
      this.overlayContainer.getContainerElement().classList.add(this.theme2)
      this.overlayContainer.getContainerElement().classList.add(this.theme);
    }
    let url = this.urlConstants.getAssociateUrl.replace('{alias}', this.data.dataKey)
    this.userDetails.getAssocaiteData(url).subscribe(data => {
      this.id = data.id;
    })

    this.editForm.controls.status.valueChanges.subscribe(status => {
      if (status == "Approved") {
        this.editForm.controls.trainingDate.setValidators([Validators.required]);
        this.editForm.controls.trainingDate.updateValueAndValidity();
      } else {
        this.editForm.controls.trainingDate.clearValidators();
        this.editForm.controls.trainingDate.updateValueAndValidity();
      }
    });
    this.dropDownValues();
  }

  // Populate combobox values
  dropDownValues(){
    let dropdownurl = this.urlConstantService.getUrls().getLookUpValues;
    let url = dropdownurl + "?clientId=1";
    this.messageService.getDropDownValues(url).subscribe(profileData => {
      this.arrayVal = profileData;
      let num:number = 0;
      let i:number;
      for(i = num;i<=this.arrayVal.length;i++) {
        for (let key in profileData[i]) {
          if(key === "PhonepalStatus"){
            let mainObj = profileData[i];
            this.arrayPhonePalStatus = ddlArray(mainObj);
          }
        }
      }
    }, (error) => {
      this.messageService.setshowSpinner(false);
    });
  }

  close() {
    this.dialogRef.close();
  }

  // Update Associate status and training status
  updateStatus() {
    this.markFormGroupTouched(this.editForm);
    if (this.editForm.valid && this.editForm.dirty) {
      let url1 = this.urlConstants.associateTrainingStatus;
      this.associateTrainingStatus.id = this.id;
      this.associateTrainingStatus.alias = this.data.dataKey;
      this.associateTrainingStatus.trainingCompletionDt = this.editForm.controls.trainingDate.value == null ? null : getformatedDate(this.editForm.controls.trainingDate.value);
      let body1 = this.associateTrainingStatus;
      let url2 = this.urlConstants.associateStatus;
      this.associateStatus.id = this.id;
      this.associateStatus.alias = this.data.dataKey;
      this.associateStatus.status = this.editForm.controls.status.value;
      this.associateStatus.approvedById = sessionStorage.getItem('alias');
      this.associateStatus.updatedBy = sessionStorage.getItem('alias');
      this.associateStatus.updatedDt = this.getTodayDate();
      let body2 = this.associateStatus;
      this.isLoadingResults = true;
      this.connectorServices.updateAssociateTrainingStatus(url1, body1, url2, body2).subscribe(data => {
        this.dialogRef.close();
        // Calling next to emit value from the observer
        this.messageService.updateStatusMessage('updateSuccess');
        this.isLoadingResults = false;
      }, (error) => {
        this.dialogRef.close();
        this.isLoadingResults = false;
        // Calling next to emit value from the observer
        this.messageService.updateStatusMessage('updateFail');
      })
    }
  }

  // DIsplay today's date in yyyy-MM-dd hh:mm:ss.000 format
  getTodayDate():string{
    this.today = new DatePipe('en-US').transform(Date.now(), 'yyyy-MM-dd');
    this.todayFormatted = this.today + " 00:00:00.000"
    return this.todayFormatted;
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

  // Display error message if trainingDate field is empty
  getErrorMessageDate() {
    return this.editForm.controls.trainingDate.hasError('required') ? 'Training completion date  is required' : null;
  }

  // Display error message if status field is empty
  getErrorMessageStatus() {
    return this.editForm.controls.status.hasError('required') ? 'status is required' : null;
  }

}


