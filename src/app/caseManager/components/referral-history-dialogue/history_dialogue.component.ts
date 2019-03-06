import { Component, OnInit, ViewEncapsulation, NgZone, Inject, ViewChild } from '@angular/core';
import 'rxjs/add/operator/map';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-history_dialogue',
  templateUrl: './history_dialogue.component.html',
  styleUrls: ['./history_dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})

// Dialog component which displays the referral history details of a member
export class historyDialogueComponent implements OnInit {
  theme = 'profilepagetheme';
  theme2 = 'togethernessapptheme';

  memberData: memberHeader[];
  displayedColumns: string[] = ['refereeName', 'source', 'hasNooneToTalkTo', 'howOftenMemberLeaveHome', 'anySocialSupport','liveAlone', 'redFlag', 'createdDt', ];
  dataSource: MatTableDataSource<memberHeader> = new MatTableDataSource<memberHeader>(this.memberData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    public dialogRef: MatDialogRef<historyDialogueComponent>, private overlayContainer: OverlayContainer, @Inject(MAT_DIALOG_DATA) public referraldata: any) {
      this.dataSource.data = this.referraldata
    console.log(this.dataSource.data, this.referraldata);

  }

  ngOnInit() {
    // Initialise and apply theme for History Dialog
    if (this.overlayContainer.getContainerElement().classList.contains("landingpageowncomponentsTheme")) {
      this.overlayContainer.getContainerElement().classList.add(this.theme2)
      this.overlayContainer.getContainerElement().classList.add(this.theme);
    }
  }

  // Close the referral history dialog
  close() {
    this.dialogRef.close();
  }
  
  // Attach the datasource to the angular material paginator
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
}
}

// Member Header Interface
export interface memberHeader {
  hasNooneToTalkTo:any
  howOftenMemberLeaveHome:any
  redFlag:any
  refereeName:any
  createdDt:any
  source:any
  anySocialSupport:any,
  liveAlone:any
}
