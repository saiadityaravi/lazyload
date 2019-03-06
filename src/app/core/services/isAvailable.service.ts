import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UrlconstantsService } from '../../shared/services/urlconstants.service';
import { connectorServices } from '../../shared/services/connector.services';
import { Observable } from 'rxjs';


@Injectable()

// IsAvailable service that can be injected in components
export class IsAvailable implements CanActivate {
    urlConstants: any;
    alias: any;
    isAvailable: boolean;
    constructor(
        private router: Router, private urlConstantService: UrlconstantsService, private connectorServices: connectorServices) {
        this.urlConstants = this.urlConstantService.getUrls();
        this.alias = sessionStorage.getItem('alias');

    }
    canActivate(): Observable<boolean> {
        let url = this.urlConstants.getAllPhonepals;
        let body = `{
            "alias": "${this.alias}",
            "pageSize": ${1},
            "pageNumber": ${0}
        }`
        return this.connectorServices.getAllPhonepals(url, body).map(data => {
           if(data.list[0].roleDesc == "phonepal"){
            if (data.list[0].availabilityFlag && (data.list[0].status == "Approved") && (data.list[0].actions[4].iconName=='link_off'))  //Checking whether user loggged-In or not
            {
                return true;
            }else{
                this.router.navigate(["/phonepal/profile"]);
                return false;
            }
           }else if(data.list[0].roleDesc == "connector"){
            if (data.list[0].status == "Approved")//Checking whether user loggged-In or not
            {
                return true;
            }else{
                this.router.navigate(["/connector/profile"]);
                return false;
            }
           }
        }).catch(() => {
            this.router.navigate(["/"]);
            return Observable.of(false);
        });
    }
}
