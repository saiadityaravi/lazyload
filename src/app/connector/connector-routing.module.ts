import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { connectorComponent } from './components/connectorPage/connectorpage.component';
import { datatablelistMemberComponent } from './components/data_tablelist_member/data-tablelist-member.component';
import { datatablelistPhonepalComponent } from './components/data_tablelist_phonepal/data-tablelist-phonepal.component';
import { ConnectorDashboardComponent } from './components/Dashboard/dashboard.component';
import {
  RoleGuardService as RoleGuard
} from '../core/services/roleguard.service';
import { ProfileComponentconnector } from './components/Profile/profile.component';
import { PageContentComponent } from '../phonePal/components/page-content/page-content.component';
import { Memberpagecomponent } from './components/memberpage-component/memberpage.component';
import { IsAvailable } from '../core/services/isAvailable.service';



const routes: Routes = [
  {
    path: "",
    data: {
      breadcrumb: {
        desc: "Home"
      },
      canActivate: [RoleGuard],
      expectedRole: 'Role_connector'
    },
    component: connectorComponent,
    children: [
      {
        path: "",
        canActivate:[IsAvailable],
        data: {
          breadcrumb: {
            desc: ""
          }
        },
        component: ConnectorDashboardComponent
      },
      {
        path: "phonepal",
        canActivate:[IsAvailable],
        data: {
          breadcrumb: {
            desc: 'phonepal'
          }
        },
        component: Memberpagecomponent,
        children:[
          {
            path: "",
            data: {
              breadcrumb: {
                desc: ""
              }
            },
            component: datatablelistPhonepalComponent,
            },
            {
              path: "phonepalcalloutcome",
              data: {
                breadcrumb: {
                  desc: "Phonepal call outcome"
                }
              },
              component: PageContentComponent
            },
        ]
      },
      {
        path: "member",
        canActivate:[IsAvailable],
        data: {
          breadcrumb: {
            desc: "Member"
          }
        },
        component: Memberpagecomponent,
        children:[
          {
            path: "",
            data: {
              breadcrumb: {
                desc: ""
              }
            },
            component: datatablelistMemberComponent,
            },
          {
            path: "membercalloutcome",
            data: {
              breadcrumb: {
                desc: "Member call outcome"
              }
            },
            component: PageContentComponent
          },
        ]
      },
      {
        path: "profile",
        data: {
          breadcrumb: {
            desc: "profile"
          }
        },
        component: ProfileComponentconnector
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class connectorRoutingModule { }