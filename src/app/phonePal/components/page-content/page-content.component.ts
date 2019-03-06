import { Component, OnInit, Inject } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { MemberInfo } from '../../model/member-info.model';
import { MemberNotes } from '../../model/member-notes.model';
import { DataService } from '../../service/data.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogMemberInteractionComponent } from '../dialog-member-interaction/dialog-member-interaction.component';
import decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';

@Component({
  selector: 'phonepal-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss']
})

export class PageContentComponent implements OnInit {
  private alias: string;
  userRole: string;
  private resData: string;
  public memberInformation: MemberInfo;
  public nextScheduledCallDate: any;
  public phonepalStatus: string;
  public phonepalAvailability: boolean;
  isLoadingResults: boolean= false;
  memberNotesList: Array<MemberNotes> = [];

  constructor(private urlConstantService: UrlconstantsService, private toastr: ToastrService,private router: Router, private dataService: DataService, private dialog: MatDialog, private activatedRoute: ActivatedRoute) {
    this.memberInformation = new MemberInfo();
    const token = sessionStorage.getItem('jwt');
    const tokenPayload = decode(token);
    this.userRole = tokenPayload.scopes;
    this.alias = tokenPayload.sub;
    let path = this.activatedRoute.snapshot.url[0] ? this.activatedRoute.snapshot.url[0].path : null;
    if(path=="membercalloutcome"){
      this.memberInformation.memberId = sessionStorage.getItem('memberInteractionID')
      this.getMemberDetails();
      this.getMemberNotes();
      this.getNextScheduledDate();
    }else if(path==null){
      this.alias = sessionStorage.getItem('alias');
      this.phonepalPage();
    }else if(path=="phonepalcalloutcome"){
      this.alias = sessionStorage.getItem('phonepalID')
      this.phonepalPage();
    }
  }

  ngOnInit() {
    // 1. Get alias from Session Storage
    // Refresh page content when dialog box is closed
    this.dialog.afterAllClosed.subscribe(() => {
      this.isLoadingResults = true;
      this.getMemberNotes();
      this.getNextScheduledDate();
      this.isLoadingResults = false;
    });
  }

  phonepalPage(){
    this.isLoadingResults = true;
    // 2. Make service call to GET /togetherness/assignMember/{alias} to retrieve MemberID
    let url = this.urlConstantService.getUrls().getMemberId.replace('{primaryAlias}',this.alias);
    this.dataService.get_member_id(url).subscribe((res : string) => {
      this.resData = res;
      if((this.resData['memberId'] != null) && (this.resData['memberId'] != undefined)){
        this.memberInformation.memberId = this.resData['memberId'];
      }

      // 3. Once MemberId is retrieved, get Member Details and Member Comments by passing memberId
      // API call to get Member Details
      // Check whether memberId is null or undefined
      this.getMemberDetails();

      // API call to get Member Comments
      // Check whether memberId is null or undefined
      this.getMemberNotes();
      this.getNextScheduledDate();
      this.isLoadingResults = false;
    },
    error => {
      this.isLoadingResults = false;
      console.error("Error Accessing Member Id!!!");
    });
  }

  // Function to retrieve phonepal interaction details
  getMemberNotes(){
    if((this.memberInformation.memberId != null) && (this.memberInformation.memberId != undefined)){
      let url = this.urlConstantService.getUrls().getMemberNotes.replace('{memberId}',this.memberInformation.memberId);
      this.dataService.get_member_notes(url).subscribe((res : MemberNotes[]) => {
        this.memberNotesList = res;
      },
      error => {
        console.error("Error Accessing Member Notes!!!");
      });
    }
  }

  // Retrieve next scheduled phone call date
  getNextScheduledDate(){
    let url = this.urlConstantService.getUrls().getNextScheduledCallDate.replace('{memberId}/{callerId}',this.memberInformation.memberId+'/'+this.alias);
    if((this.memberInformation.memberId != null) && (this.memberInformation.memberId != undefined)){
      this.dataService.get_next_scheduled_date(url).subscribe((res) => {
        if(res){
          this.nextScheduledCallDate = res;
        }
      },
      error => {
        console.error("Error Accessing Next Scheduled Date!!!");
      });
    }
  }

  // Retrieve member details
  getMemberDetails(){
    if((this.memberInformation.memberId != null) && (this.memberInformation.memberId != undefined)){
      let url = this.urlConstantService.getUrls().getMemberInfo.replace('{memberId}',this.memberInformation.memberId);
      this.dataService.get_member_info(url).subscribe((res) => {
        if(res){
          if((res['firstName'] != null) && (res['firstName'] != undefined)){
            this.memberInformation.firstName = res['firstName'];
          }else{
            this.memberInformation.firstName = "N/A";
          }

          if((res['lastName'] != null) && (res['lastName'] != undefined)){
            this.memberInformation.lastName = res['lastName'];
          }else{
            this.memberInformation.lastName = "N/A";
          }

          if((res['memberId'] != null) && (res['memberId'] != undefined)){
            this.memberInformation.memberId = res['memberId'];
          }else{
            this.memberInformation.memberId = "N/A";
          }

          if((res['effectiveDt'] != null) && (res['effectiveDt'] != undefined)){
            this.memberInformation.effectiveDt = res['effectiveDt'];
          }else{
            this.memberInformation.effectiveDt = "N/A";
          }

          if((res['terminationDt'] != null) && (res['terminationDt'] != undefined)){
            this.memberInformation.terminationDt = res['terminationDt'];
          }else{
            this.memberInformation.terminationDt = "N/A";
          }

          if((res['address'] !== null) && (res['address'] !== undefined)){
            if((res['address'].city != null) && (res['address'].city != undefined)){
              this.memberInformation.city = res['address'].city;
            }else{
              this.memberInformation.city = "N/A";
            }

            if((res['address'].state != null) && (res['address'].state != undefined)){
              this.memberInformation.state = res['address'].state;
            }else{
              this.memberInformation.state = "N/A";
            }
          }

          if((res['birthDate'] != null) && (res['birthDate'] != undefined)){
            this.memberInformation.birthDate = res['birthDate'];
          }else{
            this.memberInformation.birthDate = "N/A";
          }

          if((res['gender'] != null) && (res['gender'] != undefined)){
            this.memberInformation.gender = res['gender'];
          }else{
            this.memberInformation.gender = "N/A";
          }

          if((res['memberTimeZone'] != null) && (res['memberTimeZone'] != undefined)){
            this.memberInformation.memberTimeZone = res['memberTimeZone'];
          }else{
            this.memberInformation.memberTimeZone = "N/A";
          }

          if((res['preferredLanguage'] != null) && (res['preferredLanguage'] != undefined)){
            this.memberInformation.preferredLanguage = res['preferredLanguage'];
          }else{
            this.memberInformation.preferredLanguage = "N/A";
          }

          if((res['additionalComment'] != null) && (res['additionalComment'] != undefined)){
            this.memberInformation.additionalComment = res['additionalComment'];
          }else{
            this.memberInformation.additionalComment = "N/A";
          }

          if((res['phoneNumber'] != null) && (res['phoneNumber'] != undefined)){
            this.memberInformation.phoneNumber = res['phoneNumber'];
          }else{
            this.memberInformation.phoneNumber = "N/A";
          }
        }
      },
      error => {
        console.error("Error Accessing (Page Content) Member Information!!!");
      });
    }
  }

  openDialog(param: any) {
    const dialogConfig = new MatDialogConfig();
    if(param.isreadOnly == true){
      let url = this.urlConstantService.getUrls().getCallOutCome.replace('{id}',param.paramObject.id);
      this.dataService.get_call_outcome(url).subscribe((res) => {
        param.paramObject = res;
        dialogConfig.data = param;
        this.dialog.open(DialogMemberInteractionComponent, dialogConfig);
      },
      error => {
        console.error("Error Accessing Member Call Outcome!!!");
      });
    }else{
      dialogConfig.data = param;
      this.dialog.open(DialogMemberInteractionComponent, dialogConfig);
    }
  }

}