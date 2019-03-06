import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { SharedService } from '../../services/shared.service';
import { OverlayContainer } from '@angular/cdk/overlay';


@Component({
    selector: 'app-enrollment-dialog',
    templateUrl: './enrollment-dialog.component.html',
    styleUrls: ['./enrollment-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class enrollmentDialogComponent implements OnInit {
    theme= "landingpageTheme"
    constructor(
       private overlayContainer: OverlayContainer,  private dialogRef: MatDialogRef<enrollmentDialogComponent>, public messageService: SharedService
    ) {
    }

    ngOnInit() {
        // Initialize and apply theme for phonepal enrollment
        if(this.overlayContainer.getContainerElement().classList.contains("togethernessapptheme")){
            this.overlayContainer.getContainerElement().classList.remove("togethernessapptheme")
            this.overlayContainer.getContainerElement().classList.add(this.theme);
        }
        // Subscribe to the Subject to create an observer
        this.messageService.enrollMessage.subscribe(data=>{
            if(!data){
                this.close()
            }
        })
    }

    close() {
        this.dialogRef.close(false);
    }

    enrollPhonepal() {
        // Calling next to emit value from the observer
        this.messageService.setEnroolMessage(true);
    }

}