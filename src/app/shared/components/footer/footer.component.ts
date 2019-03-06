import { Component, OnInit } from '@angular/core';
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  titleText: string;
  footerText: string;
  constructor() { }

  // Initialize the footer component and set the footer text
  ngOnInit() {
    this.titleText = getDomainTitle();
    if(this.titleText == "Togetherness"){
      this.footerText = "Caremore Health";
    }else if(this.titleText == "Member Connect"){
      this.footerText = "Anthem Health Plan";
    }
  }

}
