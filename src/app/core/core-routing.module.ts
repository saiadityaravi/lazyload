import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingpageComponent } from '../landingpage/landingpage/landingpage.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import {
  RoleGuardService as RoleGuard
} from '../core/services/roleguard.service';
import {
  AuthGuard
} from '../core/services/auth-guard.service';
import { IsLoggedIn } from './services/loggedin.service';
/**
 * Main Routes of the application 
 *  1. Contain the login route (Eager Loding)
 *  2. Contain the routes for the connector Module (Lazy Loaded)
 *  3. Contain the routes for the case manager Module (Lazy Loaded)
 *  4. Contain the routes for the phonepal Module (Lazy Loaded)
 *  In the future please add the routes of the future modules
 */
const routes: Routes = [
  {
    path: "",
    component: LandingpageComponent,
    pathMatch: "full",
    resolve: [IsLoggedIn]
  },
  {
    path: "phonepal",
    data: {
      breadcrumb: {
        desc: ""
      },
      expectedRole: 'ROLE_phonepal'
    },
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: "../phonePal/phonepal.module#PhonepalModule"
  },
  {
    path: "casemanager",
    data: {
      breadcrumb: {
        desc: ""
      },
      expectedRole: 'ROLE_casemanager'
    },
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: "../caseManager/casemanager.module#CaseManagerModule"
  },
  {
    path: "connector",
    data: {
      breadcrumb: {
        desc: ""
      },
      expectedRole: 'ROLE_connector'
    },
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: "../connector/connector.module#connectorModule"
  },
  {
    path: "admin",
    data: {
      breadcrumb: {
        desc: ""
      },
      expectedRole: 'ROLE_admin'
    },
    canActivate: [AuthGuard, RoleGuard],
    loadChildren: "../admin/admin.module#adminModule"
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class CoreRoutingModule { }