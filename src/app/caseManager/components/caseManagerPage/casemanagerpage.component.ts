import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-casemanager',
  templateUrl: './casemanagerpage.component.html',
  styleUrls: ['./casemanagerpage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CaseManagerComponent implements OnInit {
  // Define the theme class for casemanager page
  theme = 'profilepagetheme';
  titleText: string;
  
  constructor(){
  }
  // Casemanager landing page
  ngOnInit() {
    this.titleText = getDomainTitle();
  }

}
