import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import 'rxjs/add/operator/map';
import { NgxUiLoaderService } from 'ngx-ui-loader'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponentconnector implements OnInit {
  theme = 'profilepagetheme';
  nominationDt: any;
  welcomedate: any;
  trainingCompletionDt: any;
  nominationApprovalDt: any;
  isLoadingResults:boolean;
  status:string;
  statusText:string;
  constructor(private messageService: SharedService) {
  }
  ngOnInit() {
    // Subscribe to the Subject to create an observer
    this.messageService.dateMessage.subscribe(dates => {
      this.nominationDt = dates.nominationDt == null ? null : dates.nominationDt.toString().substring(0, dates.nominationDt.toString().indexOf(" "))
      this.welcomedate = dates.welcomeEmailDt == null ? null : dates.welcomeEmailDt.toString().substring(0, dates.welcomeEmailDt.toString().indexOf(" "))
      this.trainingCompletionDt = dates.trainingCompletionDt == null ? "TBD" : dates.trainingCompletionDt.toString().substring(0, dates.trainingCompletionDt.toString().indexOf(" "))
      this.nominationApprovalDt = dates.nominationApprovalDt == null ? "TBD" : dates.nominationApprovalDt.toString().substring(0, dates.nominationApprovalDt.toString().indexOf(" "))
    })

      this.messageService.dateMessage.subscribe(dates => {
        this.nominationDt = dates.nominationDt;
        this.welcomedate = dates.welcomeEmailDt;
        this.status = dates.status;
        if(dates.status=="Pending"){
          this.statusText = "Your status is pending, please contact admin";
        }else if(dates.status == "Approved"){
          this.statusText = " Your status is Approved.";
        }else{
          this.statusText = " Your status is Denied, please contact admin.";
        }
        console.log(this.statusText);
        
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
