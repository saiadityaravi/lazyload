import { Injectable } from "@angular/core";

// Importing the Actions and Effects from the store library @ngrx/effects
import { Actions, Effect } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AppState } from "../app.state";

// Importing all the AuthActions from the Auth Actions file
import * as AuthActions from "./authStore.actions";

// Importing HTTPClient for the server call
import { HttpClient, HttpResponse } from "@angular/common/http";


// Importing the User Model from the main module
import { User } from "../../models/user.model"; 

// Importing Observable
import { Observable } from "rxjs/Observable"; 

// Importing the router
import { Router } from "@angular/router";



// Importing required operators from the rxjs
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/mergeMap";

/**
 * The Auth Effects class intercept the actions dispatched by the services or components
 * and provide the side effects like server calls and other side effects before it is fed to the reducer
 */

@Injectable() 
export class AuthEffects {
   
}