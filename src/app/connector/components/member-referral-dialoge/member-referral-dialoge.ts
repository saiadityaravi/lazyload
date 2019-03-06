import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-member_referral_dialoge',
  templateUrl: './member-referral-dialoge.html',
  styleUrls: ['./member-referral-dialoge.scss'],
  encapsulation: ViewEncapsulation.None
})
export class memberrefrerralDialogueComponent implements OnInit {
    memberForm: FormGroup;
    searchForm: FormGroup;
    theme= 'profilepagetheme';
    theme2= 'togethernessapptheme'
    secondFormGroup: FormGroup;
    genders = ['Male', 'Female', 'Other','Refuse to disclose'];
    languages: string[] = ['English', 'Spanish','Other'];
  constructor(private messageService: SharedService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<memberrefrerralDialogueComponent>, private overlayContainer: OverlayContainer){
      
  }
  
  ngOnInit() {
    this.searchForm = this.fb.group({
        memberSeach: ['']
    })
    this.secondFormGroup = this.fb.group({

    });
    this.memberForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        gender: [''],
        dob: ['',Validators.required],
        address: [''],
        languages: [[]],
        city:[''],
        state:[''],
        zip:[''],
        phonenumber:[''],
    })
  }

  searchMember(value: any){
    console.log(value);
    
  }

  close(){
    this.dialogRef.close();
  }


}





