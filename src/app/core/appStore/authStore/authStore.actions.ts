/**
* The Actions used for the authorization in the application
*/

import { Action } from "@ngrx/store";

// Importing the User Model
import { User } from "../../models/user.model";

// Action Constants
export const TRY_LOGIN = "TRY_LOGIN";
export const LOGGED_IN = "LOGGED_IN";
export const LOGGED_OUT = "LOGGED_OUT";
export const SET_TOKEN = "SET_TOKEN";
export const AUTH_ERROR = "AUTH_ERROR";
export const SET_LOGGED_USER = "SET_LOGGED_USER";
export const REFRESH_TOKEN = "REFRESH_TOKEN";

/**
 * All Auth Actions in the Auth State Management
 */

// Action of Logged In
export class LoggedIn implements Action {
    readonly type = LOGGED_IN;
}

// Action of Logged Out
export class LoggedOut implements Action {
    readonly type = LOGGED_OUT;
}

// Action Emitted to Set the tokens in the auth Store
export class SetToken implements Action {
    readonly type = SET_TOKEN;

    constructor(public payload: { access_token: string, refresh_token?: string, access_token_exp?: string }) {}
}

// Action Emitted when the User tries to log in.
export class TryLogin implements Action {
    readonly type = TRY_LOGIN;

    constructor(public payload: { username: string, password: string }) {}
}

// Action Emitted when the Error occures while logging of the user
export class AuthError implements Action {
    readonly type = AUTH_ERROR;

    constructor(public payload: string) {}
}

// Action Emitted to set the logged In user
export class SetLoggedInUser implements Action {
    readonly type = SET_LOGGED_USER;

    constructor(public payload: User) {}
}

// Action Emitted to set the Refresh Token
export class RefreshToken implements Action {
    readonly type = REFRESH_TOKEN;

    constructor(public payload: { access_token: string, refresh_token?: string, access_token_exp?: string }) {}
}

// exporting all the actions
export type AuthActions = LoggedIn | LoggedOut | SetToken | SetLoggedInUser | AuthError | TryLogin | RefreshToken;