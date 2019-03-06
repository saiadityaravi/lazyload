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

// Casemanager - Profile component
export class ProfileComponentCasemanager implements OnInit {
  public theme: string = 'profilepagetheme';
  public nominationDt: any;
  public welcomedate: any;
  public trainingCompletionDt: any;
  public nominationApprovalDt: any;
  public isLoadingResults:boolean;
  constructor(private messageService: SharedService) {
  }

  // Initialize component and subscribe to the subject to create an observer
  ngOnInit() {
    this.messageService.dateMessage.subscribe(dates => {
      this.nominationDt = dates.nominationDt == null ? null : dates.nominationDt.toString().substring(0, dates.nominationDt.toString().indexOf(" "))
      this.welcomedate = dates.welcomeEmailDt == null ? null : dates.welcomeEmailDt.toString().substring(0, dates.welcomeEmailDt.toString().indexOf(" "))
      this.trainingCompletionDt = dates.trainingCompletionDt == null ? "TBD" : dates.trainingCompletionDt.toString().substring(0, dates.trainingCompletionDt.toString().indexOf(" "))
      this.nominationApprovalDt = dates.nominationApprovalDt == null ? "TBD" : dates.nominationApprovalDt.toString().substring(0, dates.nominationApprovalDt.toString().indexOf(" "))
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
    // Calling next to emit value from the observer
    this.messageService.setUpdateProfile(true);
  }

}
