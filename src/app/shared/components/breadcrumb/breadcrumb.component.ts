import { Component, OnInit, OnDestroy } from '@angular/core';

// Router imports 
import { Router, ActivatedRoute, ActivationEnd, ActivatedRouteSnapshot, RouterEvent } from "@angular/router";

// Import breadcrumb interface
import { BreadCrumb } from "./breadcrumb";

// Importing the Behavior Subject
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";

// Importing all the operators
import "rxjs/add/operator/filter";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/combineLatest";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumsComponent implements OnInit {


    public breadcrumbs$: BehaviorSubject<BreadCrumb[]> = new BehaviorSubject<BreadCrumb[]>([]);

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {

        // getting the breadcrumb information from the router events
        this._router.events.filter((event) => {
            return event instanceof ActivationEnd;
        })
            .map((route: ActivatedRoute) => {
                return route.snapshot;
            })
            .distinctUntilChanged((routeSnapshot1: ActivatedRouteSnapshot, routeSnapshot2: ActivatedRouteSnapshot) => {
                return routeSnapshot1.routeConfig.path == routeSnapshot2.routeConfig.path;
            })
            .map((activateRoute: ActivatedRouteSnapshot) => {
                return this.buildBreadCrumb(activateRoute);
            })
            .subscribe((breadcrumbArray: BreadCrumb[]) => {
                this.breadcrumbs$.next(breadcrumbArray);
            });

    }

    ngOnInit() {
    }

    /**
     * the function to build the breadcrumbs
     * @param activatedRouteSnapshot the snapshot of the activatedRouteSnapshot
     * @param url the url of the route 
     * @param breadcrumbs the initial breadcrumb
     */
    buildBreadCrumb(activatedRouteSnapshot: ActivatedRouteSnapshot, url: string = "", breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
        // if(activatedRouteSnapshot.routeConfig.data){

        // }
        const description = activatedRouteSnapshot.routeConfig.data ? activatedRouteSnapshot.routeConfig.data.breadcrumb["desc"] : "";
        const path = activatedRouteSnapshot.routeConfig ? activatedRouteSnapshot.routeConfig.path : "";

        let nextURL;
        let breadcrumb;
        let nextBreadcrumb;
        if(description==""){
            nextURL = `/${url}${path}`;
            nextBreadcrumb = breadcrumbs;
        }else{
            nextURL = `${url}${path}/`;
            breadcrumb = {
                desc: description,
                URL: nextURL
            };
    
            nextBreadcrumb = [...breadcrumbs, breadcrumb];
        }

        if (activatedRouteSnapshot.firstChild) {
            return this.buildBreadCrumb(activatedRouteSnapshot.firstChild, nextURL, nextBreadcrumb);
        }
        return nextBreadcrumb;
    }

}