import { NgModule, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from "@angular/common";

import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { Router, ActivatedRoute } from "@angular/router";

// Importing Browser Animations Module
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";

// the application routing 
import { CoreRoutingModule } from './core-routing.module';

// Material Imports for the Auth Dialog 
import { MatDialog, MatDialogConfig } from "@angular/material";

// Importing Shared Module
import { SharedModule } from "../shared/shared.module";

//Importing toaster
import { ToastrModule } from 'ngx-toastr'; 
// Importing the Store Dependencies
import {
    StoreModule,
    Store,
} from "@ngrx/store";


// Importing the app reducer
import { appReducer } from "./appStore/app.reducer";

// Importing the Effects Module
import { EffectsModule } from "@ngrx/effects";
import { AuthEffects } from "./appStore/authStore/authStore.effect";

// Environment Variable
import { environment } from "../../environments/environment";

// Importing services for the module
import { AuthorizationService } from "./services/authorization.service";
import { AuthGuard } from "./services/auth-guard.service";

// Importing HTTP Interceptors
import { AuthInterceptor } from "./interceptors/auth.interceptor";

// Importing the pipes for the template
import { AppState } from './appStore/app.state';




import { Subscription } from "rxjs/Subscription";


import "rxjs/add/observable/interval";
import { ValidationService } from './utilities/validation.service';
import { landingpageModule } from '../landingpage/langingpage.module';

// Importing Dummy DataService from phonepal Service
import { DataService } from '../phonePal/service/data.service';
import { RoleGuardService } from './services/roleguard.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { IsLoggedIn } from './services/loggedin.service';
import { CaseManagerService } from '../caseManager/service/casemanager.data.service';

export function tokenGetter() {
    return sessionStorage.getItem('access_token');
}

@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        SharedModule,
        landingpageModule,
        ToastrModule.forRoot(),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter
            }
        }),
        /**
         * calling the StoreModule forRoot and passing the appReducer which contains
         * all the reducers for the application. Now only putting 
         *  1. auth, 
         *  2. connector,
         *  3. phonepal,
         *  4. casemanager
         */
        StoreModule.forRoot(appReducer),

        /**
         * Effects Module for taking care of the side effects in the application
         */
        EffectsModule.forRoot([AuthEffects]),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        AuthorizationService,
        RoleGuardService,
        AuthService,
        AuthGuard,
        IsLoggedIn,
        ValidationService,
        DataService,
        CaseManagerService
    ],

})
export class CoreModule {

    private globalTimer: Subscription;

    constructor(
        private _store: Store<AppState>,

    ) {
        // calling the subscription function for the store
        this.subscribeToStore();
    }


    /**
     * Subscribe to the store. Function will run whenever the App State changes
     * it is helpful in maintaining the state while the refresh.
     */
    subscribeToStore() {
        this._store.subscribe((appState: AppState) => {
            if (sessionStorage.getItem("app-state")) {
                sessionStorage.removeItem("app-state");
            }
            sessionStorage.setItem("app-state", JSON.stringify(appState));
        });
    }
}