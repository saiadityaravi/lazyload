import { state } from "@angular/core/src/animation/dsl";
import { AuthState } from "./authStore.state";
import * as AuthActions from "./authStore.actions"
import { User } from "../../models/user.model";
export const coreInitialState:AuthState={
    access_token: null,
    refresh_token: null,
    loggedIn: false,
    user: null,
    error: null
}

export function authReducer(state = coreInitialState, action: AuthActions.AuthActions): AuthState {
    switch(action.type) {
        case AuthActions.LOGGED_IN:
            // console.log("Inside the reducer and Action is: logged in");
            return Object.assign({}, state, {
                loggedIn: true
            });
        case AuthActions.LOGGED_OUT:
            // removing the local storage access_token information to the initial state
            return Object.assign({}, state, {
                loggedIn: false
            });
        case AuthActions.SET_TOKEN:
            // console.log("Inside the reducer and Action is: set token");
            return Object.assign({}, state, {
                access_token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
                access_token_exp: action.payload.access_token_exp
            });
        case AuthActions.SET_LOGGED_USER:
            // console.log("Inside the reducer and Action is: set logged user");            
            return Object.assign({}, state, {
                user: { ...state.user, ...action.payload }
            });
        case AuthActions.AUTH_ERROR: 
            // console.log("Inside the reducer and Action is: auth error");
            return Object.assign({}, state, {
                error: action.payload
            });
        case AuthActions.TRY_LOGIN:
            // console.log("Inside the reducer and Action is: try login");
            const newUser = new User();
            newUser.username = action.payload.username;
            newUser.password = action.payload.password;
            return Object.assign({}, state, {
                user: newUser
            });

        // default case will return the state from the local storage
        default:
            return state;
    }

}