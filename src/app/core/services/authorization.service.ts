/**
 * Authorization service that will be able to handle
 * 1. Login to handle POST request, parse the payload and storing into the sessionStorage
 * 2. Logout functionality
 * 3. Refresh Token functionality
*/

// Importing core libraries
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

// Importing the Store 
import { Store } from "@ngrx/store";
import { AppState } from "../appStore/app.state"; 
import * as AuthActions from "../appStore/authStore/authStore.actions"; 

// Observable Operators
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import  "rxjs/add/observable/of";
import { tap, delay } from 'rxjs/operators';




@Injectable()
export class AuthorizationService {

    private loginURL: string = '';
    private fetchUserURL: string = '';

    private loggedIn: boolean = true;

    constructor(
        private _httpService: HttpClient,
        private _store: Store<AppState>) { }

    // handling the login of user and we will allow only the connector
    public login(username: string, password: string) {
    
        console.log("Inside the login function");
        const body = {
            "username": username,
            "password": password
        };

        this._store.dispatch(new AuthActions.TryLogin(body));
        return this.loggedIn = true;
    }

    // function for the logout
    public logout() {
        this.loggedIn = false;
    }

    // handle the session information like handling the session info
    private handleSession(res): Observable<any> {
        return Observable.create((observer) => {
            observer.next("sai");
        });
    }

    // function to check whether the user is logged in or not
    public isLoggedIn() {
        return this.loggedIn;
    }

    // function to handle and get a new access token from refresh token
    private getNewAccessToken() {

    }

    // fetching user after user has logged in and get the data of first name and last name
    fetchUserAfterLogin():Observable<any> {
        return this._httpService.get(this.fetchUserURL).map((data: any) => {
            return { "first_name": data.first_name, "last_name": data.last_name };
        });
    }
}

