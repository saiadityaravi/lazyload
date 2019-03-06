import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { SharedService } from "../../services/shared.service";

@Component({
    selector: "app-timer-dialogue",
    templateUrl: "./timerDialogue.component.html"
  })
// Dialog box to inform user regarding session active time and extend the same
  export class timerDialogue implements OnInit{
    constructor( @Inject(MAT_DIALOG_DATA) public data:any,
        public dialogRef: MatDialogRef<timerDialogue>, private messageService: SharedService) {}
      counter: any
        onNoClick(): void {
          this.dialogRef.close();
        }
        onOkClick(){
          this.dialogRef.close();
          // Calling next to emit value from the observer
          this.messageService.setStopTimer()
        }

        ngOnInit(){
           this.counter =  this.data.count
            console.log(this.data.count);
            
        }
  }