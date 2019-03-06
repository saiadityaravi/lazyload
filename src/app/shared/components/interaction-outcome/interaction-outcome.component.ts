import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators} from '@angular/forms';
import { UrlconstantsService } from '../../services/urlconstants.service';
import { SharedService } from '../../../shared/services/shared.service';
import { ddlArray } from '../../../core/utilities/utilityHelper';
import { InteractionOutcome } from '../../models/interaction-outcome.model';
import decode from 'jwt-decode';
// import { stringify } from '@angular/core/src/render3/util';
// import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'interaction-outcome',
  templateUrl: './interaction-outcome.component.html',
  styleUrls: ['./interaction-outcome.component.scss']
})
export class InteractionComponent implements OnInit {
  @Input() paramObject: any;
  @Input() group: FormGroup;
  @Input() isreadOnly: boolean;
  test:any;
  public role: string;
  public arrayVal;
  public arrayLoneliness: any[] = [];
  public arraySocialization: any[] = [];
  public arrayMood: any[] = [];
  public arrayIsolationScore: any[] = [];
  public arrayRiskstratification: any[] = [];
  public arrayLS1: any[] = [];
  public arrayLS2: any[] = [];
  public arrayLS3: any[] = [];
  public arrayPHQ2_Little: any[] = [];
  public arrayPHQFeelingdown: any[] = [];
  public arrayPhysicalActivityFrequency:any[] = [];
  public interactionOutcome: InteractionOutcome;
  public isOtherCareChecked: boolean = false;
  public isOtherBarrierChecked: boolean = false;
  public isOtherProgramChecked: boolean = false;
  public isOtherActivityChecked: boolean = false;
  public isOtherCommunityChecked: boolean = false;
  public str: string;
  public subStr: string;
  public startIndex: any;
  public tempIndex: any;
  public nextIndex: any;

  constructor(private urlconstants: UrlconstantsService, private sharedServcice: SharedService) {
    const token = sessionStorage.getItem('jwt');
    const tokenPayload = decode(token);
    this.role = tokenPayload.scopes;
    this.interactionOutcome = new InteractionOutcome();
  }

  ngOnInit() {
    if(this.isreadOnly == true){
      // New Code Added
      // Barriers
      this.interactionOutcome.modelFinance = this.paramObject.barriers.includes("Finance");
      this.interactionOutcome.modelDepression = this.paramObject.barriers.includes("Depression");
      this.interactionOutcome.modelGrief = this.paramObject.barriers.includes("Grief");
      this.interactionOutcome.modelPain = this.paramObject.barriers.includes("Pain");
      this.interactionOutcome.modelBarrierTransport = this.paramObject.barriers.includes("Transportation");
      if (this.paramObject.barriers !== undefined || this.paramObject.barriers.length != 0) {
        this.str = this.paramObject.barriers.join('|');
        if(this.str.indexOf("Other Barriers")){
          this.startIndex = this.str.indexOf("Other Barriers");
          this.tempIndex = this.str.indexOf("|", this.startIndex);
          if(this.tempIndex == -1){
            this.nextIndex = this.paramObject.barriers.join('|').length;
          }else{
            this.nextIndex = this.tempIndex;
          }
          this.subStr = this.str.substring(this.startIndex, this.nextIndex);
          this.interactionOutcome.vBarrierOther = this.subStr;
          if ((this.interactionOutcome.vBarrierOther != null) && (this.interactionOutcome.vBarrierOther != undefined) && (this.interactionOutcome.vBarrierOther != "")) {
            this.interactionOutcome.modelOtherBarriers = true;
            this.interactionOutcome.vBarrierTextField = this.interactionOutcome.vBarrierOther.includes(":") ? this.interactionOutcome.vBarrierOther.split(":")[1]: "";
          }
        }else{
          this.interactionOutcome.modelOtherBarriers = false;
        }
      }

      // Physical Activity
      this.interactionOutcome.modelGymnasium = this.paramObject.physicalActivity.includes("Gymnasium");
      this.interactionOutcome.modelJogging = this.paramObject.physicalActivity.includes("Jogging");
      this.interactionOutcome.modelNifty = this.paramObject.physicalActivity.includes("Nifty After Fifty");
      this.interactionOutcome.modelWalking = this.paramObject.physicalActivity.includes("Walking");
      if (this.paramObject.physicalActivity !== undefined || this.paramObject.physicalActivity.length != 0) {
        this.str = this.paramObject.physicalActivity.join('|');
        if(this.str.indexOf("Other Activities")){
          this.startIndex = this.str.indexOf("Other Activities");
          this.tempIndex = this.str.indexOf("|", this.startIndex);
          if(this.tempIndex == -1){
            this.nextIndex = this.paramObject.physicalActivity.join('|').length;
          }else{
            this.nextIndex = this.tempIndex;
          }
          this.subStr = this.str.substring(this.startIndex, this.nextIndex);
          this.interactionOutcome.vPhysicalOther = this.subStr;
          if ((this.interactionOutcome.vPhysicalOther != null) && (this.interactionOutcome.vPhysicalOther != undefined) && (this.interactionOutcome.vPhysicalOther != "")) {
            this.interactionOutcome.modelOtherActivities = true;
            this.interactionOutcome.vPhysicalTextField = this.interactionOutcome.vPhysicalOther.includes(":") ? this.interactionOutcome.vPhysicalOther.split(":")[1]: "";
          }
        }else{
          this.interactionOutcome.modelOtherActivities = false;
        }
      }

      // Anthem Programs
      this.interactionOutcome.modelMedication = this.paramObject.anthemPrograms.includes("Medication Issues");
      this.interactionOutcome.modelStarHeidis = this.paramObject.anthemPrograms.includes("Star/Heidis");
      this.interactionOutcome.modelPCP = this.paramObject.anthemPrograms.includes("PCP");
      this.interactionOutcome.modelCriticalCare = this.paramObject.anthemPrograms.includes("Critical Care Connection");
      this.interactionOutcome.modelMemberServices = this.paramObject.anthemPrograms.includes("Member Services");
      this.interactionOutcome.modelBehaviorHealth = this.paramObject.anthemPrograms.includes("Behavior Health");
      this.interactionOutcome.modelMyAdvocate = this.paramObject.anthemPrograms.includes("My Advocate");
      if (this.paramObject.anthemPrograms !== undefined || this.paramObject.anthemPrograms.length != 0) {
        this.str = this.paramObject.anthemPrograms.join('|');
        if(this.str.indexOf("Other Programs")){
          this.startIndex = this.str.indexOf("Other Programs");
          this.tempIndex = this.str.indexOf("|", this.startIndex);
          if(this.tempIndex == -1){
            this.nextIndex = this.paramObject.anthemPrograms.join('|').length;
          }else{
            this.nextIndex = this.tempIndex;
          }
          this.subStr = this.str.substring(this.startIndex, this.nextIndex);
          this.interactionOutcome.vProgramsOther = this.subStr;
          if ((this.interactionOutcome.vProgramsOther != null) && (this.interactionOutcome.vProgramsOther != undefined) && (this.interactionOutcome.vProgramsOther != "")) {
            this.interactionOutcome.modelOtherPrograms = true;
            this.interactionOutcome.vProgramsTextField = this.interactionOutcome.vProgramsOther.includes(":") ? this.interactionOutcome.vProgramsOther.split(":")[1]: "";
          }          
        }else{
          this.interactionOutcome.modelOtherPrograms = false;
        }
      }

      // Care Coordination
      this.interactionOutcome.modelCarePCP = this.paramObject.careCoordination.includes("Care PCP");
      this.interactionOutcome.modelCaseMangerText = this.paramObject.careCoordination.includes("Case-Manger Text");
      this.interactionOutcome.modelContactedReferral = this.paramObject.careCoordination.includes("Contacted referral source-text");
      this.interactionOutcome.modelTransferredMember = this.paramObject.careCoordination.includes("Transferred member to Member service");
      if (this.paramObject.careCoordination !== undefined || this.paramObject.careCoordination.length != 0) {
        this.str = this.paramObject.careCoordination.join('|');
        if(this.str.indexOf("Other Care Coordination")){
          this.startIndex = this.str.indexOf("Other Care Coordination");
          this.tempIndex = this.str.indexOf("|", this.startIndex);
          if(this.tempIndex == -1){
            this.nextIndex = this.paramObject.careCoordination.join('|').length;
          }else{
            this.nextIndex = this.tempIndex;
          }
          this.subStr = this.str.substring(this.startIndex, this.nextIndex);
          this.interactionOutcome.vCareOther = this.subStr;
          if ((this.interactionOutcome.vCareOther != null) && (this.interactionOutcome.vCareOther != undefined) && (this.interactionOutcome.vCareOther != "")) {
            this.interactionOutcome.modelOtherCare = true;
            this.interactionOutcome.vCareTextField = this.interactionOutcome.vCareOther.includes(":") ? this.interactionOutcome.vCareOther.split(":")[1]: "";
          }
        }else{
          this.interactionOutcome.modelOtherCare = false;
        }
      }

      // Community Resources
      this.interactionOutcome.modelTransportation = this.paramObject.communityResources.includes("Transportation");
      this.interactionOutcome.modelSeniorsCenter = this.paramObject.communityResources.includes("Seniors Center");
      this.interactionOutcome.modelHomeMaintenance = this.paramObject.communityResources.includes("Home Maintenance");
      this.interactionOutcome.modelSupportGroups = this.paramObject.communityResources.includes("Support Groups");
      this.interactionOutcome.modelCommunityNo = this.paramObject.communityResources.includes("Community - No");
      this.interactionOutcome.modelMeals = this.paramObject.communityResources.includes("Meals On wheels");
      this.interactionOutcome.modelSeniorCenterWithoutWalls = this.paramObject.communityResources.includes("Senior Center Without Walls");
      this.interactionOutcome.modelHousing = this.paramObject.communityResources.includes("Housing");
      this.interactionOutcome.modelCommunityYes = this.paramObject.communityResources.includes("Community - Yes");
      this.interactionOutcome.modelOtherCommunity = this.paramObject.communityResources.includes("Other Community");
      if (this.paramObject.communityResources !== undefined || this.paramObject.communityResources.length != 0) {
        this.str = this.paramObject.communityResources.join('|');
        if(this.str.indexOf("Other Community")){
          this.startIndex = this.str.indexOf("Other Community");
          this.tempIndex = this.str.indexOf("|", this.startIndex);
          if(this.tempIndex == -1){
            this.nextIndex = this.paramObject.communityResources.join('|').length;
          }else{
            this.nextIndex = this.tempIndex;
          }
          this.subStr = this.str.substring(this.startIndex, this.nextIndex);
          this.interactionOutcome.vCommunityOther = this.subStr;
          if ((this.interactionOutcome.vCommunityOther != null) && (this.interactionOutcome.vCommunityOther != undefined) && (this.interactionOutcome.vCommunityOther != "")) {
            this.interactionOutcome.modelOtherCommunity = true;
            this.interactionOutcome.vCommunityTextField = this.interactionOutcome.vCommunityOther.includes(":") ? this.interactionOutcome.vCommunityOther.split(":")[1]: "";
          }
        }else{
          this.interactionOutcome.modelOtherCommunity = false;
        }
      }
      // New Code Added

        this.group.patchValue({
          callSummary: this.paramObject.callSummary,
          notesConcerns: this.paramObject.anyConcern,
          loneliness: this.paramObject.loneliness,
          socialization: this.paramObject.socialization,
          physicalActivityFrequency: this.paramObject.physicalActivityFrequency,
          mood: this.paramObject.mood,
          isolationScore: this.paramObject.isolationScore,
          riskStratification: this.paramObject.riskStratification,

          LS1LackCompanionship: this.paramObject.ls1FeelLackOfCompanionship,
          LS2FeelIsolated: this.paramObject.ls2FeelIsolated,
          LS3HowOften: this.paramObject.ls3HowOftenDoYouFeelLeftOut,

          phq2LittleInterest: this.paramObject.phq2LittleIntrestDoingThings,
          phq2FeelingDown: this.paramObject.phq2FeelingDepressd
      });

      this.group.get('notesConcerns').disable();
      this.group.get('callSummary').disable();
    }

    this.dropDownValues();
  }

  // Populate select boxes based on the JSON response
  dropDownValues(){
    let dropdownurl = this.urlconstants.getUrls().getLookUpValues;
    let url = dropdownurl + "?clientId=1";
    this.sharedServcice.getDropDownValues(url).subscribe(profileData => {
      this.arrayVal = profileData;
      let num:number = 0;
      let i:number;
      for(i = num;i<=this.arrayVal.length;i++) {
        for (let key in profileData[i]) {
          if(key === "Loneliness"){
            let mainObj = profileData[i];
            this.arrayLoneliness = ddlArray(mainObj);
          } else if(key === "Socialization"){
            let mainObj = profileData[i];
            this.arraySocialization = ddlArray(mainObj);
          } else if(key === "Mood"){
            let mainObj = profileData[i];
            this.arrayMood = ddlArray(mainObj);
          } else if(key === "IsolationScore"){
            let mainObj = profileData[i];
            this.arrayIsolationScore = ddlArray(mainObj);
          } else if(key === "RiskStratification"){
            let mainObj = profileData[i];
            this.arrayRiskstratification = ddlArray(mainObj);
          } else if(key === "LS1"){
            let mainObj = profileData[i];
            this.arrayLS1 = ddlArray(mainObj);
          } else if(key === "LS2"){
            let mainObj = profileData[i];
            this.arrayLS2 = ddlArray(mainObj);
          } else if(key === "LS3"){
            let mainObj = profileData[i];
            this.arrayLS3 = ddlArray(mainObj);
          } else if(key === "PHQ2_Little interest"){
            let mainObj = profileData[i];
            this.arrayPHQ2_Little = ddlArray(mainObj);
          } else if(key === "PHQ2_Feelingdown"){
            let mainObj = profileData[i];
            this.arrayPHQFeelingdown = ddlArray(mainObj);
          } else if(key === "PhysicalActivity"){
            let mainObj = profileData[i];
            this.arrayPhysicalActivityFrequency = ddlArray(mainObj);
          }
        }
      }
    }, (error) => {
      this.sharedServcice.setshowSpinner(false);
    });
  }

  // Function to check whether other checkbox fields are checked or not and based on the same, enable / disable form validation
  toggleCheckBox(prop, e){
    if(prop.indexOf('isOtherBarrierChecked') > -1){
      if(e.checked){
        this.isOtherBarrierChecked = true;
        this.group.controls["otherBarrierText"].setValidators([Validators.required]);
        this.group.controls["otherBarrierText"].updateValueAndValidity();
      } else {
        this.isOtherBarrierChecked = false;
        this.group.controls["otherBarrierText"].clearValidators();
        this.group.controls["otherBarrierText"].updateValueAndValidity();
      }
    }
    if(prop.indexOf('isOtherActivityChecked') > -1){
      if(e.checked){
        this.isOtherActivityChecked = true;
        this.group.controls["otherActivityText"].setValidators([Validators.required]);
        this.group.controls["otherActivityText"].updateValueAndValidity();
      } else {
        this.isOtherActivityChecked = false;
        this.group.controls["otherActivityText"].clearValidators();
        this.group.controls["otherActivityText"].updateValueAndValidity();
      }
    }
    if(prop.indexOf('isOtherProgramChecked') > -1){
      if(e.checked){
        this.isOtherProgramChecked = true;
        this.group.controls["otherProgramText"].setValidators([Validators.required]);
        this.group.controls["otherProgramText"].updateValueAndValidity();
      } else {
        this.isOtherProgramChecked = false;
        this.group.controls["otherProgramText"].clearValidators();
        this.group.controls["otherProgramText"].updateValueAndValidity();
      }
    }
    if(prop.indexOf('isOtherCareChecked') > -1){
      if(e.checked){
        this.isOtherCareChecked = true;
        this.group.controls["otherCareText"].setValidators([Validators.required]);
        this.group.controls["otherCareText"].updateValueAndValidity();
      } else {
        this.isOtherCareChecked = false;
        this.group.controls["otherCareText"].clearValidators();
        this.group.controls["otherCareText"].updateValueAndValidity();
      }
    }
    if(prop.indexOf('isOtherCommunityChecked') > -1){
      if(e.checked){
        this.isOtherCommunityChecked = true;
        this.group.controls["otherCommunityText"].setValidators([Validators.required]);
        this.group.controls["otherCommunityText"].updateValueAndValidity();
      } else {
        this.isOtherCommunityChecked = false;
        this.group.controls["otherCommunityText"].clearValidators();
        this.group.controls["otherCommunityText"].updateValueAndValidity();
      }
    }
  }

}