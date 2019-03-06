import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import {AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import 'rxjs/add/operator/map';
import decode from 'jwt-decode';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { enrollmentDialogComponent } from '../../shared/components/enrollment-dialog/enrollment-dialog.component';
import { SharedService } from '../../shared/services/shared.service';
import { Subscription } from 'rxjs';
import { getUser } from '../../shared/services/userDetailsService';
import { Router } from '@angular/router';
import { UrlconstantsService } from '../../shared/services/urlconstants.service';
import { getDomainTitle } from '../../core/utilities/utilityHelper';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingpageComponent implements OnInit, AfterViewInit {
  @ViewChild('themeId') themeId: ElementRef;
  private readonly SHRINK_TOP_SCROLL_POSITION = 30;
  shrinkToolbar = false;
  isEnrolled: boolean = false;
  theme = "landingpageTheme";
  isEnrolledSubscription: Subscription;
  owntheme = "landingpageowncomponentsTheme";
  role: any;
  isLoadingResults: boolean;
  urlConstants = this.urlConstantService.getUrls();
  phonepalCount:number;
  memberCount:number;
  callDuration: number;
  titleText: string;
  videoURL: string;
  twitter:string = "https://twitter.com/CareMoreHealth";
  instagram:string = "https://www.instagram.com/caremorehealth/?hl=en";
  facebook:string = "https://www.facebook.com/CareMoreHealth/";
  linkedIn:string="https://www.linkedin.com/company/caremore-health/";
  domainText: string;

  constructor(private scrollDispatcher: ScrollDispatcher, private router: Router,
    private ngZone: NgZone, private dialog: MatDialog, private userDetailsServive: getUser, private messageService: SharedService, private urlConstantService: UrlconstantsService) {
    this.userDetailsServive.getUserAvailable().subscribe(data => {
      this.isEnrolled = data
    })

    let url1 = this.urlConstants.getMemberCount;
    let url2 = this.urlConstants.getPhonepalCount.replace('{roleDesc}','phonepal')
    let url3 = this.urlConstants.allCallDuration;
    this.userDetailsServive.getCounts(url1, url2, url3).subscribe(data=>{
      this.memberCount = data[0];
      this.phonepalCount = data[1]
      this.callDuration = data[2].totalCallDuration;
    })
  }
  imageUrl: string;
  imageUrl_dark: any;

  ngOnInit() {
    this.scrollDispatcher.scrolled()
      .map((event: CdkScrollable) => this.getScrollPosition(event))
      .subscribe(scrollTop => this.ngZone.run(() => this.shrinkToolbar = scrollTop > this.SHRINK_TOP_SCROLL_POSITION ? true : false));
    // Display title, image as well as video based on domain
    this.titleText = getDomainTitle();
    if(this.titleText === "Togetherness"){
      this.videoURL = "../../../assets/video/TogethernessVideo.mp4";
      this.imageUrl = "../../../assets/images/logo.png";
      this.domainText = "Caremore";
    }else if(this.titleText === "Member Connect"){
      this.videoURL = "../../../assets/video/MemberConnectVideo.mp4";
      this.imageUrl = "../../../assets/images/anthem-logo.png";
      this.twitter = null;
      this.instagram =null;
      this.facebook="https://www.facebook.com/AnthemBlueCrossBlueShield/";
      this.linkedIn="https://www.linkedin.com/company/anthem/";
      this.domainText = "Anthem";
    }else{
      this.videoURL ="../../../assets/video/TogethernessVideo.mp4";
      this.imageUrl = "../../../assets/images/logo.png";
      this.domainText = "Caremore";
    }
  }

  ngAfterViewInit(){
    this.themeId.nativeElement.play();
  }

  getScrollPosition(event) {
    if(this.titleText === "Togetherness"){
      this.imageUrl_dark = new Image();
      this.imageUrl_dark = "../../../assets/images/logo_dark.png" 
    }else if(this.titleText === "Member Connect"){
      this.imageUrl_dark = new Image();
      this.imageUrl_dark = "../../../assets/images/anthemlogo_dark.png"
    }else{
      this.imageUrl_dark = new Image();
      this.imageUrl_dark = "../../../assets/images/logo_dark.png"
    }
    if (event) {
      return event.getElementRef().nativeElement.scrollTop;
    } else {
      return window.pageYOffset;
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "900px";
    // Calling next to emit value from the observer
    this.messageService.setEnrollDialogue(true);
    this.dialog.open(enrollmentDialogComponent, dialogConfig);
  }

  // Route the logged in user based on user role
  getAvailabilityAndRoute() {
    this.isLoadingResults = true;
    this.userDetailsServive.getJwt().subscribe(jwt => {
      sessionStorage.setItem('jwt', jwt.token);
      const token = sessionStorage.getItem('jwt');
      const tokenPayload = decode(token);
      this.role = tokenPayload.scopes;
      if (this.role == "ROLE_phonepal") {
        this.isLoadingResults = false;
        this.router.navigateByUrl('phonepal')
      } else if (this.role == "ROLE_connector") {
        this.router.navigateByUrl('connector')
        this.isLoadingResults = false;
      } else if (this.role == "ROLE_casemanager") {
        this.router.navigateByUrl('casemanager')
        this.isLoadingResults = false;
      }else if (this.role == "ROLE_admin") {
        this.router.navigateByUrl('admin')
        this.isLoadingResults = false;
      }
    })
  }

}
