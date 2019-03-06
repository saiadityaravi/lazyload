import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getUser } from '../../../shared/services/userDetailsService';
import { SharedService } from '../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add_associate',
  templateUrl: './add-associate-dialoge.html',
  styleUrls: ['./add-associate-dialoge.scss'],
  encapsulation: ViewEncapsulation.None
})

// Add Associate dialog component
export class addAssociate implements OnInit {
  theme2 = "togethernessapptheme"
  theme = 'profilepagetheme';
  enrollSubscription: Subscription;
  searchAlais: FormGroup;
  role: any;
  urlConstants: any;
  isLoadingResults: boolean = false;
  constructor(private toastr: ToastrService, private messageService: SharedService, private ldapDetails: getUser, private dialogRef: MatDialogRef<addAssociate>, private urlConstantsService: UrlconstantsService, private fb: FormBuilder) {
    this.urlConstants = this.urlConstantsService.getUrls();
    this.messageService.getRole().subscribe(data => {
      this.role = data;
    })
  }

  // Initialize component
  ngOnInit() {
    this.searchAlais = this.fb.group({
      alias: [null, Validators.required]
    });
    // Subscribe to the Subject to create an observer
    this.enrollSubscription = this.messageService.getaddedAssociate().subscribe(data=>{
      if(data){
        this.dialogRef.close();
      }
    })
  }

  // Close the add associate dialog box
  close() {
    this.dialogRef.close(false);
  }

  // Display error message if username field is empty
  getErrorMessagealias() {
    return this.searchAlais.controls.alias.hasError('required') ? 'username  is required' : null;
  }


  // Get LDAP sign in details
  searchAlias() {
    this.isLoadingResults = true;
    let url = this.urlConstants.getLdapUserData.replace('{alias}', this.searchAlais.controls.alias.value);
    this.ldapDetails.searchAssociateExists(this.searchAlais.controls.alias.value).subscribe(bool => {
      if (!bool) {
        this.ldapDetails.getUserLdap(url).subscribe(data => {
          this.messageService.setLdapData(data[0], this.role);
          this.isLoadingResults = false;
        }, (error) => {
          this.isLoadingResults = false;
          this.toastr.warning("Unable find user with "+ this.searchAlais.controls.alias.value + " user name")
        })
      } else {
        this.isLoadingResults = false;
        this.toastr.warning(this.searchAlais.controls.alias.value + " is already enrolled")
      }
    })
  }

  // Trigger an event that all subscribers will listen too
  add(){
    // Generate an event so that subscribers will listen
    this.messageService.setaddAssociate(true);
  }

  // Perform unsubscribe before Angular destroys the component
  ngOnDestroy(){
    // Unsubscribe to the Subject
    this.enrollSubscription.unsubscribe()
  }
}