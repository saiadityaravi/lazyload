import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  RoleGuardService as RoleGuard
} from '../core/services/roleguard.service';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponentadmin } from './components/Profile/profile.component';
import { AdminDashboardComponent } from './components/Dashboard/dashboard.component';
import { Memberpagecomponent } from './components/memberpage-component/memberpage.component';
import { datatablelistassociatesComponent } from './components/data_tablelist_associates/data-tablelist-associates.component';
import { datatablelistMemberComponent } from './components/data_tablelist_member/data-tablelist-member.component';



const routes: Routes = [
  {
    path: "",
    data: {
      breadcrumb: {
        desc: "Home"
      },
     canActivate: [RoleGuard],
      expectedRole: 'Role_admin'
    },
    component: AdminComponent ,
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            desc: ""
          }
        },
        component: AdminDashboardComponent
      },
      {
        path: "connectors",
        data: {
          breadcrumb: {
            desc: 'Connectors'
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
            component: datatablelistassociatesComponent,
            }
        ]
      },
      {
        path: "casemanagers",
        data: {
          breadcrumb: {
            desc: 'Casemanagers'
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
            component: datatablelistassociatesComponent,
            }
        ]
      },
      {
        path: "member",
        data: {
          breadcrumb: {
            desc: "Members"
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
            }
        ]
      },
      {
        path: "profile",
        data: {
          breadcrumb: {
            desc: "Profile"
          }
        },
        component: ProfileComponentadmin
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

// Admin Routing Module
export class adminRoutingModule { }