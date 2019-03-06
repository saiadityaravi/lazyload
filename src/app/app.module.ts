import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CoreRoutingModule } from './core/core-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getUser } from './shared/services/userDetailsService';
import {MatProgressSpinnerModule } from '@angular/material';
import { UserIdleModule } from 'angular-user-idle'

// Trying to initialize application
export function init_app(getUser: getUser) {
  return () => getUser.initializeApp();
}

// Get user details and set whether user is enrolled as phonepal or not
export function getUserDetails(getUser: getUser) {
  return () => getUser.getUserDetails();
}

// Make API call to LDAP server and get the alias of the user
export function getAlias(getUser: getUser) {
  return () => getUser.getAlias();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    CoreRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    UserIdleModule.forRoot({
      idle: 60 * 30, 
      timeout: 60 * 5, 
      ping: 60 * 2, 
    }),
  ],
  providers: [
    getUser,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [getUser], multi: true },
    { provide: APP_INITIALIZER, useFactory: getAlias, deps: [getUser], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
