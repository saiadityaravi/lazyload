import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-edit_dialogue',
  templateUrl: './edit_dialogue.component.html',
  styleUrls: ['./edit_dialogue.component.scss'],
  encapsulation: ViewEncapsulation.None
})

// Edit Dialog Component to edit user status and approved date
export class editDialogueComponent implements OnInit {
 editForm: FormGroup;
 // Define the theme class for the edit dialog
 theme= 'profilepagetheme';
 theme2= 'togethernessapptheme'
 statusDisabled: boolean = true;
 statusValues=['Approved', 'Denied', 'Pending']
  constructor(private messageService: SharedService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<editDialogueComponent>, private overlayContainer: OverlayContainer){
      
  }
  
  ngOnInit() {
      // Initialize dialog and apply theme
      this.editForm=this.fb.group({
        trainingDate : ['', Validators.required],
        status: ['']
      })

      this.editForm.controls.trainingDate.valueChanges.subscribe(data=>{
        if(data!==null){
          this.statusDisabled = false;
          this.editForm.controls.status.reset();
        }
      })
      console.log( this.overlayContainer.getContainerElement().classList.contains("landingpageowncomponentsTheme"));
      
      if(this.overlayContainer.getContainerElement().classList.contains("landingpageowncomponentsTheme")){
        this.overlayContainer.getContainerElement().classList.add(this.theme2)
        this.overlayContainer.getContainerElement().classList.add(this.theme);

        console.log( this.overlayContainer.getContainerElement().classList);
    }
  }

  // Close edit dialog box
  close(){
    this.dialogRef.close();
  }

  // Edit User Status and Approved Date  
  updateStatus(){
    this.markFormGroupTouched(this.editForm);
    if(this.editForm.valid){
      this.dialogRef.close();
      // Calling next to emit value from the observer
      this.messageService.updateStatusMessage(this.editForm.value)
    }
  }

  /**
   * Function to mark all controls in a form group as touched
   *
   * @param formGroup ++++ The form group to touch
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            this.markFormGroupTouched(control);
        }
    });
}

// Display error message if Approval date field is empty
getErrorMessageDate() {
  return this.editForm.controls.trainingDate.hasError('required') ? 'Approval date  is required' : null;
}

// Display error message if Status field is empty
getErrorMessageStatus() {
  return this.editForm.controls.status.hasError('required') ? 'status is required' : null;
}

}


