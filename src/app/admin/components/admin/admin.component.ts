import { Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import { SharedService } from '../../../shared/services/shared.service';
import { getDomainTitle } from '../../../core/utilities/utilityHelper';

@Component({
  selector: 'app-connector',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})

// Admin Component
export class AdminComponent implements OnInit {
  theme = 'profilepagetheme';
  isLoadingResults: boolean;
  titleText: string;
  constructor(private messageService: SharedService) {
  }

  // Initialize the component and subscribe to the subject to create an observer
  ngOnInit() {
    this.titleText = getDomainTitle();
    // Subscribe to the Subject to create an observer
    this.messageService.showSpinner.subscribe(show => {
      if (show) {
        this.isLoadingResults = true;
      } else {
        this.isLoadingResults = false;
      }
    })
  }

}
