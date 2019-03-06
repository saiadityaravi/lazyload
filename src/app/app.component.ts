import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { getDomainTitle } from './core/utilities/utilityHelper';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public currentAddress: any;
  public constructor(private titleService: Title, private router: Router ) { 
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoadingResults = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isLoadingResults = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  
  // Initialize the component and set application title
  ngOnInit() {
    let domainName = getDomainTitle();
    this.setTitle(domainName);
  }

  // Function to set application title based on domain
  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }  
  title = 'app';
  isLoadingResults = false;
  
  // Perform sessionstorage cleanup before Angular destroys the component
  ngOnDestroy() {
    sessionStorage.clear();
  }
}