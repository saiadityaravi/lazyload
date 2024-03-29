import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {
    constructor(public jwtHelper: JwtHelperService) { }
    // ...
    public isAuthenticated(): boolean {
        const token = sessionStorage.getItem('jwt');
        // Check whether the token is expired and return
        // true or false
       if(token){
           return true;
       }else{
           false;
       }
    }
}