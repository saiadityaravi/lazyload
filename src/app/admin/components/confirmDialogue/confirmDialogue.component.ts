import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { SharedService } from "../../../shared/services/shared.service";
import { UrlconstantsService } from "../../../shared/services/urlconstants.service";
import { getUser } from "../../../shared/services/userDetailsService";
import { Rolechange } from '../../models/associateRoleChane.model'
import { connectorServices } from "../../../shared/services/connector.services";
import { ToastrService } from "ngx-toastr";
import { SattusChange } from "../../models/associateStatusChange.model";
@Component({
  selector: "app-timer-dialogue",
  templateUrl: "./confirmDialogue.component.html"
})

// Confirm Dialogue component
export class ConfirmDialogue implements OnInit {
  title: string;
  isLoadingResults: boolean = false;
  role: string;
  status: string;
  name: string;
  memberAssignedFlag: boolean;
  memberReferredFlag: boolean;
  roleChange = new Rolechange();
  associteStatus = new SattusChange();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private urlconstantService: UrlconstantsService, private userDetails: getUser, private connectorService: connectorServices,
    public dialogRef: MatDialogRef<ConfirmDialogue>, private messageService: SharedService, private toaster: ToastrService) {
    this.getUserDetails();

  }
  urlConstants = this.urlconstantService.getUrls();
  counter: any

  // Close dialog when user click No button
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  ngOnInit() {

  }

  // Get associate profile data
  getUserDetails() {
    this.isLoadingResults = true;
    let url = this.urlConstants.getAssociateUrl.replace('{alias}', this.data.dataKey)
    this.userDetails.getAssocaiteData(url).subscribe(data => {
      this.isLoadingResults = false;
      if (data) {
        this.name = data.lastName + ", " + data.firstName;
        this.role = data.roleDesc;
        this.status = data.status;
        this.memberAssignedFlag = data.memberAssignedFlag
        this.memberReferredFlag = data.memberReferredFlag;
        this.title = this.data.action.includes('exchange') ? ("Are you sure to switch roles for " + this.name + " from " + this.role.charAt(0).toUpperCase() + this.role.slice(1) + " to " + (this.role.includes("casemanager") ? "Connector" : "CaseManager")) : ("Are you sure to switch status  for " + this.name + " from " + this.status + " to " + (this.status.includes("Approved") ? "Pending" : "Approved"))
      }
    }, (error) => {
      this.isLoadingResults = false;
    })
  }

  // Get confirmation from user to switch roles / change status
  onOkClick() {
    if(this.data.action.includes('exchange')){
      let url = this.urlConstants.roleChnage;
      this.roleChange.alias = this.data.dataKey;
      this.roleChange.roleDesc = this.role.includes("casemanager") ? "connector" : "casemanager";
      let body = this.roleChange;
      console.log(body);
      this.connectorService.roleChange(url, body).subscribe(data => {
      if (data) {
        this.toaster.success('Role change is successfull');
      this.messageService.setStatus(true);
      this.dialogRef.close();
      }
      else {
        this.toaster.warning(data);
        this.dialogRef.close();
      }
    },(error)=>{
      this.toaster.warning("Can't switch roles if Connector has members assigned ");
      this.dialogRef.close();
    })
    }else{
      let url = this.urlConstants.associateStatus;
      this.associteStatus.alias = this.data.dataKey;
      this.associteStatus.status = this.status.includes("Approved") ? "Pending" : "Approved";
      let body = this.associteStatus;
      console.log(body);
      this.connectorService.roleChange(url, body).subscribe(data => {
      if (data) {
        this.toaster.success('status change is successfull');
        this.messageService.setRoleAssociate(true);
        this.dialogRef.close();
      }
      else {
        this.toaster.warning(data);
        this.dialogRef.close();
      }
    },(error)=>{
      this.toaster.warning("Oops!! something went wrong with status change ");
      this.dialogRef.close();
    })
    }
  }
}

