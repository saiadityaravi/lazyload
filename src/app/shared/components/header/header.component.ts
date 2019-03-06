import { Component, OnInit, Inject } from '@angular/core';
import decode from 'jwt-decode';
import { User } from '../../../phonePal/model/user.model';
import { DataService } from '../../../phonePal/service/data.service';
import { Router } from '@angular/router';
import { getUser } from '../../services/userDetailsService';
import { UrlconstantsService } from '../../services/urlconstants.service';
import { SharedService } from '../../services/shared.service';
import { MatDialog,  MatDialogConfig } from '@angular/material';
import { UserIdleService } from 'angular-user-idle';
import { timerDialogue } from '../timerDialogue/timerDialogue.component';
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  filterargs = { "logged_in": "true" };
  private userList: Array<User> = [];
  role: string;
  alias: string;
  isOpened: boolean = false;
  theme = "memberdialogtheme";
  timerHasStarted: boolean = false;
  name: string;
  associateRole:string;
  createdDate:any;
  titleText: string;
  domainText: string;

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  constructor(private userIdle: UserIdleService, public dialog: MatDialog, private messageService: SharedService, private dataService: DataService, private router: Router, private getuserDetails: getUser, private urlconstantsService: UrlconstantsService) {
    const token = sessionStorage.getItem('jwt');
    const tokenPayload = decode(token);
    this.role = tokenPayload.scopes;
    this.alias = tokenPayload.sub;
  }
  urlconstants = this.urlconstantsService.getUrls();

  ngOnInit() {
    // Get associate profile data and also watch user idle time
    let url = this.urlconstants.getAssociateUrl.replace('{alias}', this.alias)
    this.getuserDetails.getAssocaiteData(url).subscribe(associateData => {
      this.name = associateData.firstName + " " + associateData.lastName;
      this.createdDate = associateData.createdDt;
      let temp = this.role.split('_')[1]; 
      this.associateRole = temp.charAt(0).toUpperCase() + temp.slice(1);
    })
    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe((count) => {
      if (count==1) {
        this.openDialog(count);
      }

    });
    
    // Subscribe to the Subject to create an observer
    this.messageService.stopTimer.subscribe(() => {
      this.userIdle.stopTimer();
    })

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      console.log("Inside the timeout");
      this.dialog.closeAll();
      sessionStorage.removeItem('jwt');
      this.router.navigate(["/"]);
      console.log("After rerouting making it to stop watching");
      this.userIdle.stopWatching();
   
    });

    // Display Caremore / Anthem text based on domain
    this.titleText = getDomainTitle();
    if(this.titleText == "Togetherness"){
      this.domainText = "Caremore";
    }else if(this.titleText == "Member Connect"){
      this.domainText = "Anthem";
    }
  }

  // Stop timer
  stop() {
    this.userIdle.stopTimer();
  }

  // Stop user idle service.
  stopWatching() {
    this.userIdle.stopWatching();
  }

  //Start watching for user inactivity.
  startWatching() {
    this.userIdle.startWatching();
  }

  // Reset timer
  restart() {
    this.userIdle.resetTimer();
  }

  openDialog(counter: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '450px';
    dialogConfig.height = '150px';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      data: { count: counter }
      }
    this.dialog.open(timerDialogue, dialogConfig);
  }

  // Function to signout, set jwt as empty and navigate to landing page
  signout() {
    sessionStorage.setItem('jwt', '');
    var alias = sessionStorage.getItem('alias');
    sessionStorage.clear();
    sessionStorage.setItem('alias', alias)
    this.router.navigate(['/'])
  }

}

