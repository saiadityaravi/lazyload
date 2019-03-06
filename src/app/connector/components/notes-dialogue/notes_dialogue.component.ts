import { Component, OnInit, ViewEncapsulation, NgZone, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { getUser } from '../../../shared/services/userDetailsService';
import { connectorServices } from '../../../shared/services/connector.services';
import { DataService } from '../../../phonePal/service/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notes_dialogue',
  templateUrl: './notes_dialogue.component.html',
  styleUrls: ['./notes_dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class notesDialogueComponent implements OnInit {
  public theme: string = 'profilepagetheme';
  public theme2: string = 'togethernessapptheme';
  public notesDisplay: any;
  public isLoadingResults:boolean= false;

  constructor(private messageService: SharedService,private toaster: ToastrService , private urlConstantService: UrlconstantsService, private userDetails: getUser,
    public dialogRef: MatDialogRef<notesDialogueComponent>, private dataService: DataService, private overlayContainer: OverlayContainer, @Inject(MAT_DIALOG_DATA) public data: any, private connectorServices: connectorServices) {
  }

  urlConstants = this.urlConstantService.getUrls();
  
  ngOnInit() {
    this.isLoadingResults = true;
    if (this.overlayContainer.getContainerElement().classList.contains("landingpageowncomponentsTheme")) {
      this.overlayContainer.getContainerElement().classList.add(this.theme2)
      this.overlayContainer.getContainerElement().classList.add(this.theme);
    }
    let url = this.urlConstants.memberNotesUrl.replace('{memberId}', this.data.dataKey)
    this.connectorServices.getMemberNotes(url).subscribe(res => {
      this.isLoadingResults =false
      this.notesDisplay = res.notes;
    },(error)=>{
      this.isLoadingResults = false;
      this.toaster.warning("Oops!! something went wrong with notes")
    })
  }

  close() {
    this.dialogRef.close();
  }
}
