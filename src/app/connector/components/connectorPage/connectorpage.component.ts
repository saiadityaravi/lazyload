import { Component, OnInit, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-connector',
  templateUrl: './connectorpage.component.html',
  styleUrls: ['./connectorpage.component.scss'],
})

// Connector page Component
export class connectorComponent implements OnInit {
  theme = 'profilepagetheme';
  isLoadingResults: boolean;
  titleText: string;
  constructor(private messageService: SharedService) {
  }

  // Initialize component and subscribe to the subject to create an observer
  ngOnInit() {
    this.titleText = getDomainTitle();
    this.messageService.showSpinner.subscribe(show => {
      if (show) {
        this.isLoadingResults = true;
      } else {
        this.isLoadingResults = false;
      }
    })
  }

}
