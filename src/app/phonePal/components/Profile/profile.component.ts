import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import 'rxjs/add/operator/map';
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  theme = 'profilepagetheme';
  nominationDt: any;
  welcomedate: any;
  trainingCompletionDt: any;
  nominationApprovalDt: any;
  isLoadingResults:boolean;
  titleText: string;

  statusText:any;
  status:any;
  constructor(private messageService: SharedService) {
  }
  ngOnInit() {
    this.titleText = getDomainTitle();
    // Subscribe to the Subject to create an observer
    this.messageService.dateMessage.subscribe(dates => {
      this.nominationDt = dates.nominationDt;
      this.welcomedate = dates.welcomeEmailDt;
      this.status = dates.status;
      if(dates.status=="Pending"){
        this.statusText = "Your status is pending, please contact connector or update availability.";
      }else if(dates.status == "Approved"){
        this.statusText = " Your status is Approved.";
      }else{
        this.statusText = " Your status is Denied, please contact connector.";
      }
      this.trainingCompletionDt = dates.nominationApprovalDt == null ? "TBD" : dates.trainingCompletionDt;
      this.nominationApprovalDt = dates.nominationApprovalDt == null ? "TBD" : dates.nominationApprovalDt;
    })

    this.messageService.showSpinner.subscribe(show=>{
      if(show){
        this.isLoadingResults=true;
      }else{
        this.isLoadingResults=false;
      }
    })
  }
 
  updateProfile(){
    this.messageService.setUpdateProfile(true);
  }

}
