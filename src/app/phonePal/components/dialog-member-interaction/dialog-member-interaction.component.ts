import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataService } from '../../service/data.service';
import { errorMessages } from '../../../core/utilities/generic-validations';
import { DatePipe } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import decode from 'jwt-decode';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { SharedService } from '../../../shared/services/shared.service';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { MemberDialog } from '../../model/member-dialog.model';

export interface CallStatus {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-member-interaction',
  templateUrl: './dialog-member-interaction.component.html',
  styleUrls: ['./dialog-member-interaction.component.scss']
})
export class DialogMemberInteractionComponent implements OnInit {
  isLoadingResults:boolean= false;
  date;
  nextCallDate;
  modifiedScheduledDate;
  alias: string;
  userRole:string;
  interactionForm: FormGroup;
  errors = errorMessages;
  isChecked: string = "false";
  modifiedCallDt: string = "";
  theme = "memberdialogtheme";
  minDate = new Date();
  public arrayVal;
  public arrayCallOutcome: any[] = [];
  public memberDialogModel: MemberDialog;
  public urlConstants: any;

  public mask = {
    guide: false,
    showMask: false,
    mask: [/\d/, /\d/, ':', /\d/, /\d/]
  };

  constructor(private urlConstantService: UrlconstantsService, private sharedServcice: SharedService, private overlayContainer: OverlayContainer,public datepipe: DatePipe, private formBuilder: FormBuilder, private dataService: DataService, public dialogRef: MatDialogRef<DialogMemberInteractionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm();
    this.memberDialogModel = new MemberDialog();
    this.alias = sessionStorage.getItem('alias');
    const token = sessionStorage.getItem('jwt');
    const tokenPayload = decode(token);
    let temp = tokenPayload.scopes; 
    this.userRole = temp.split('_')[1];
    this.overlayContainer.getContainerElement().classList.add("togethernessapptheme");
  }

  ngOnInit() {
   
    if(this.data.isreadOnly == true){
      this.interactionForm.get('callDuration').clearValidators();
      this.interactionForm.get('callDuration').updateValueAndValidity();
      this.interactionForm.get('callStatus').clearValidators();
      this.interactionForm.get('callStatus').updateValueAndValidity();

      if((this.data.paramObject.nextScheduledCallDt != null) && (this.data.paramObject.nextScheduledCallDt != undefined)){
        this.modifiedScheduledDate = new Date(this.data.paramObject.nextScheduledCallDt.toString().substring(0, this.data.paramObject.nextScheduledCallDt.toString().indexOf(" ")).replace(/-/g, '\/'));
      }else{
        this.modifiedScheduledDate = "";
      }

      this.interactionForm.patchValue({
        nextCallDate: this.modifiedScheduledDate,
        callStatus: this.data.paramObject.callStatus,
        callDuration: this.data.paramObject.callDuration
      })
    }
        this.dropDownValues();
  }

  // Populate combobox options
  dropDownValues(){
    let dropdownurl = this.urlConstantService.getUrls().getLookUpValues;
    let url = dropdownurl + "?clientId=1";
    this.sharedServcice.getDropDownValues(url).subscribe(profileData => {
      this.arrayVal = profileData;
      let num:number = 0;
      let i:number;
      for(i = num;i<=this.arrayVal.length;i++) {
        for (let key in profileData[i]) {
          if(key === "CallOutcome"){
            let mainObj = profileData[i];
            this.arrayCallOutcome = ddlArray(mainObj);
          }
        }
      }
    }, (error) => {
      this.sharedServcice.setshowSpinner(false);
    });
  }

	createForm() {
		this.interactionForm = this.formBuilder.group({
			callDuration: ['', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(128)
      ]],
			callStatus: ['', [
				Validators.required
      ]],
			nextCallDate: ['', []],
      chkIsCritical: ['',[]],
      loneliness: ['',[]],
      socialization: ['',[]],
      physicalActivityFrequency:['',[]],
      mood: ['',[]],
      isolationScore: ['',[]],
      riskStratification: ['',[]],
      finance: ['',[]],
      depression: ['',[]],
      grief: ['',[]],
      pain: ['',[]],
      transportation: ['',[]],
      otherBarriers: ['',[]], // Checkbox Other Barriers
      otherBarrierText:['',[]], // TextField Other Barriers
      gym: ['',[]],
      jogging: ['',[]],
      niftyAfterFifty: ['',[]],
      walking: ['',[]],
      otherActivities: ['',[]], // Checkbox Other Activities
      otherActivityText:['',[]], // TextField Other Activities
      medicationIssues: ['',[]],
      starHeidis: ['',[]],
      pcp: ['',[]],
      criticalCare: ['',[]],
      memberServices: ['',[]],
      behaviorHealth: ['',[]],
      myAdvocate: ['',[]],
      otherPrograms: ['',[]], // Checkbox Other Programs
      otherProgramText: ['',[]], // TextField Other Programs
      carePCP: ['',[]],
      caseManager: ['',[]],
      contactedReferral: ['',[]],
      transferredMember: ['',[]],
      otherCare: ['',[]], // Checkbox Other Care
      otherCareText:['',[]], // TextField Other Care
      LS1LackCompanionship: ['',[]],
      LS2FeelIsolated: ['',[]],
      LS3HowOften: ['',[]],
      phq2LittleInterest: ['',[]],
      phq2FeelingDown: ['',[]],
      communityTransportation: ['',[]],
      seniorsCenter: ['',[]],
      homeMaintenance: ['',[]],
      supportGroups: ['',[]],
      communityNo: ['',[]],
      mealsOnWheels: ['',[]],
      seniorCenterWithoutWalls: ['',[]],
      housing: ['',[]],
      communityYes: ['',[]],
      otherCommunity: ['',[]], // Checkbox Other Community
      otherCommunityText:['',[]], // TextField Other Community
      notesConcerns: ['',[]],
      callSummary: ['',[]]
		});
  }

  // Submit member interaction details
  onFormSubmit(){
    this.isLoadingResults = true;
    this.date=new Date();
    let callDate =this.datepipe.transform(this.date, 'yyyy-MM-dd hh:mm:ss.sss');
    let valueToSplit = callDate;
    let dateTime = valueToSplit.split(" ");
    this.modifiedCallDt = dateTime[0] + " 00:00:00.000";
    this.nextCallDate = this.interactionForm.get('nextCallDate').value;
    let nextScheduledCallDate = this.datepipe.transform(this.nextCallDate, 'yyyy-MM-dd hh:mm:ss.sss');

    // Anthem Programs
    if(this.interactionForm.get('medicationIssues').value === true){
      this.memberDialogModel.vMedicationIssues = "Medication Issues";
    }
    if(this.interactionForm.get('starHeidis').value === true){
      this.memberDialogModel.vStarHeidis = "Star/Heidis";
    }
    if(this.interactionForm.get('pcp').value === true){
      this.memberDialogModel.vPCP = "PCP";
    }
    if(this.interactionForm.get('criticalCare').value === true){
      this.memberDialogModel.vCriticalCare = "Critical Care Connection";
    }
    if(this.interactionForm.get('memberServices').value === true){
      this.memberDialogModel.vMemberServices = "Member Services";
    }
    if(this.interactionForm.get('behaviorHealth').value === true){
      this.memberDialogModel.vBehaviorHealth = "Behavior Health";
    }
    if(this.interactionForm.get('myAdvocate').value === true){
      this.memberDialogModel.vMyAdvocate = "My Advocate";
    }
    if(this.interactionForm.get('otherPrograms').value === true){
      this.memberDialogModel.vOtherPrograms = "Other Programs";
    }

    // Barriers
    if(this.interactionForm.get('finance').value === true){
      this.memberDialogModel.vFinance = "Finance";
    }
    if(this.interactionForm.get('depression').value === true){
      this.memberDialogModel.vDepression = "Depression";
    }
    if(this.interactionForm.get('grief').value === true){
      this.memberDialogModel.vGrief = "Grief";
    }
    if(this.interactionForm.get('pain').value === true){
      this.memberDialogModel.vPain = "Pain";
    }
    if(this.interactionForm.get('transportation').value === true){
      this.memberDialogModel.vTransportation = "Transportation";
    }
    if(this.interactionForm.get('otherBarriers').value === true){
      this.memberDialogModel.vOtherBarriers = "Other Barriers";
    }

    // Care Coordination
    if(this.interactionForm.get('carePCP').value === true){
      this.memberDialogModel.vCarePCP = "Care PCP";
    }
    if(this.interactionForm.get('caseManager').value === true){
      this.memberDialogModel.vCaseManager = "Case-Manger Text";
    }
    if(this.interactionForm.get('contactedReferral').value === true){
      this.memberDialogModel.vContactedReferral = "Contacted referral source-text";
    }
    if(this.interactionForm.get('transferredMember').value === true){
      this.memberDialogModel.vTransferredMember = "Transferred member to Member service";
    }
    if(this.interactionForm.get('otherCare').value === true){
      this.memberDialogModel.vOtherCare = "Other Care Coordination";
    }

    // Community Resources
    if(this.interactionForm.get('communityTransportation').value === true){
      this.memberDialogModel.vCommunityTransportation = "Transportation";
    }
    if(this.interactionForm.get('seniorsCenter').value === true){
      this.memberDialogModel.vSeniorsCenter = "Seniors Center";
    }
    if(this.interactionForm.get('homeMaintenance').value === true){
      this.memberDialogModel.vHomeMaintenance = "Home Maintenance";
    }
    if(this.interactionForm.get('supportGroups').value === true){
      this.memberDialogModel.vSupportGroups = "Support Groups";
    }
    if(this.interactionForm.get('communityNo').value === true){
      this.memberDialogModel.vCommunityNo = "Community - No";
    }
    if(this.interactionForm.get('mealsOnWheels').value === true){
      this.memberDialogModel.vMealsOnWheels = "Meals On wheels";
    }
    if(this.interactionForm.get('seniorCenterWithoutWalls').value === true){
      this.memberDialogModel.vSeniorCenterWithoutWalls = "Senior Center Without Walls";
    }
    if(this.interactionForm.get('housing').value === true){
      this.memberDialogModel.vHousing = "Housing";
    }
    if(this.interactionForm.get('communityYes').value === true){
      this.memberDialogModel.vCommunityYes = "Community - Yes";
    }
    if(this.interactionForm.get('otherCommunity').value === true){
      this.memberDialogModel.vOtherCommunity = "Other Community";
    }

    // Physical Activity
    if(this.interactionForm.get('gym').value === true){
      this.memberDialogModel.vGym = "Gymnasium";
    }
    if(this.interactionForm.get('jogging').value === true){
      this.memberDialogModel.vJogging = "Jogging";
    }
    if(this.interactionForm.get('niftyAfterFifty').value === true){
      this.memberDialogModel.vNiftyAfterFifty = "Nifty After Fifty";
    }
    if(this.interactionForm.get('walking').value === true){
      this.memberDialogModel.vWalking = "Walking";
    }
    if(this.interactionForm.get('otherActivities').value === true){
      this.memberDialogModel.vOtherActivities = "Other Activities";
    }



    var notes  = {
      "alias": this.alias,
      "anthemPrograms": [
        this.memberDialogModel.vMedicationIssues,
        this.memberDialogModel.vStarHeidis,
        this.memberDialogModel.vPCP,
        this.memberDialogModel.vCriticalCare,
        this.memberDialogModel.vMemberServices,
        this.memberDialogModel.vBehaviorHealth,
        this.memberDialogModel.vMyAdvocate,
        this.memberDialogModel.vOtherPrograms != undefined && this.memberDialogModel.vOtherPrograms != null ?  this.memberDialogModel.vOtherPrograms +":"+ this.interactionForm.get('otherProgramText').value : null,
      ],
      "anyConcern": this.interactionForm.get('notesConcerns').value,
      "barriers": [this.memberDialogModel.vFinance,
                  this.memberDialogModel.vDepression,
                  this.memberDialogModel.vGrief,
                  this.memberDialogModel.vPain,
                  this.memberDialogModel.vTransportation,
                  //this.vOtherBarriers +":"+ this.interactionForm.get('otherBarrierText').value],
                  this.memberDialogModel.vOtherBarriers != undefined && this.memberDialogModel.vOtherBarriers != null ?  this.memberDialogModel.vOtherBarriers +":"+ this.interactionForm.get('otherBarrierText').value : null
                ],
      "callDt": this.modifiedCallDt,
      "callDuration": this.interactionForm.get('callDuration').value,
      "callOutcome": "",
      "callStatus": this.interactionForm.get('callStatus').value,
      "callSummary": this.interactionForm.get('callSummary').value,
      "callerRoleDesc": this.userRole,
      "careCoordination": [this.memberDialogModel.vCarePCP,
                           this.memberDialogModel.vCaseManager,
                           this.memberDialogModel.vContactedReferral,
                           this.memberDialogModel.vTransferredMember,
                           //this.vOtherCare +":"+ this.interactionForm.get('otherCareText').value
                           this.memberDialogModel.vOtherCare != undefined && this.memberDialogModel.vOtherCare != null ?  this.memberDialogModel.vOtherCare +":"+ this.interactionForm.get('otherCareText').value : null
                          ],
      "clientId": 1,
      "comments": this.interactionForm.get('callSummary').value,
      "communityResources": [this.memberDialogModel.vSeniorsCenter,
                                  this.memberDialogModel.vHomeMaintenance,
                                  this.memberDialogModel.vSupportGroups,
                                  this.memberDialogModel.vCommunityNo,
                                  this.memberDialogModel.vSeniorCenterWithoutWalls,
                                  this.memberDialogModel.vHousing,
                                  this.memberDialogModel.vCommunityYes,
                                  this.memberDialogModel.vMealsOnWheels,
                                  this.memberDialogModel.vCommunityTransportation,
                                  //this.vOtherCommunity +":"+ this.interactionForm.get('otherCommunityText').value
                                  this.memberDialogModel.vOtherCommunity != undefined && this.memberDialogModel.vOtherCommunity != null ?  this.memberDialogModel.vOtherCommunity +":"+ this.interactionForm.get('otherCommunityText').value : null
      ],
      "createdDt": callDate,
      "createdBy": this.alias,
      "followupCallDt": "",
      "isolationScore": this.interactionForm.get('isolationScore').value,
      "ls3HowOftenDoYouFeelLeftOut": this.interactionForm.get('LS3HowOften').value,
      "loneliness": this.interactionForm.get('loneliness').value,
      "ls1FeelLackOfCompanionship": this.interactionForm.get('LS1LackCompanionship').value,
      "ls2FeelIsolated": this.interactionForm.get('LS2FeelIsolated').value,
      "memberId": this.data.memberId,
      "mood": this.interactionForm.get('mood').value,
      "physicalActivityFrequency": this.interactionForm.controls.physicalActivityFrequency.value,
      "nextScheduledCallDt": nextScheduledCallDate,
      
      "phq2FeelingDepressd": this.interactionForm.get('phq2FeelingDown').value,
      "phq2LittleIntrestDoingThings": this.interactionForm.get('phq2LittleInterest').value,
      "physicalActivity": [
        this.memberDialogModel.vGym,
        this.memberDialogModel.vJogging,
        this.memberDialogModel.vNiftyAfterFifty,
        this.memberDialogModel.vWalking,
        //this.vOtherActivities +":"+ this.interactionForm.get('otherActivityText').value
        this.memberDialogModel.vOtherActivities != undefined && this.memberDialogModel.vOtherActivities != null ?  this.memberDialogModel.vOtherActivities +":"+ this.interactionForm.get('otherActivityText').value : null
      ],
        
      "productType": "",
      "redFlag": this.interactionForm.get('chkIsCritical').value,
      "referralSource": "",
      "referralsForFollowupNeeded": this.interactionForm.get('contactedReferral').value,
      "riskStratification": this.interactionForm.get('riskStratification').value,
      "socialization": this.interactionForm.get('socialization').value,
      "subClientId": 1000,
      "typeOfCall": "",
      "updatedDt": callDate,
      "updatedBy": this.alias
    };
    
    let url = this.urlConstantService.getUrls().postMemberNotes;
    this.dataService.post_member_notes(url, JSON.stringify(notes)).subscribe(
      success => {
        this.dialogRef.close("Successfully posted data");
        this.isLoadingResults =false;
      },
      error => {
        this.isLoadingResults = false;
        this.dialogRef.close("Successfully posted data");
        console.log(error)
      }
    );
  }

  close() {
    this.dialogRef.close("Thanks for using me!");
  }

}