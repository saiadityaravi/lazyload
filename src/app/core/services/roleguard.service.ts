import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
@Injectable()
// Role Guard service that can be injected in components
export class RoleGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        // on the data property
        const expectedRole = route.data.expectedRole;
        const token = sessionStorage.getItem('jwt');
        // decode the token to get its payload
        const tokenPayload = decode(token);
        if (!this.auth.isAuthenticated() || tokenPayload.scopes !== expectedRole) {
            return false;
        }
        return true;
    }
}