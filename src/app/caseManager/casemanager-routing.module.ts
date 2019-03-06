import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseManagerComponent } from './components/caseManagerPage/casemanagerpage.component';
import { datatablelistMemberComponent } from './components/data_tablelist_member/data-tablelist-member.component';
import { CaseManagerDashboardComponent } from './components/Dashboard/dashboard.component';
import { ProfileComponentCasemanager } from './components/Profile/profile.component';

// Child routes which can be accessed and viewed within casemanager route
const routes: Routes = [
  {
    path: "",
    data: {
      breadcrumb: {
        desc: "Home"
      }
    },
    component: CaseManagerComponent,
    children: [
      {
        path: "",
        data: {
          breadcrumb: {
            desc: ""
          }
        },
        component: CaseManagerDashboardComponent
      },
      {
        path: "member",
        data: {
          breadcrumb: {
            desc: "Member"
          }
        },
        component: datatablelistMemberComponent
      },
      {
        path: "profile",
        data: {
          breadcrumb: {
            desc: "profile"
          }
        },
        component: ProfileComponentCasemanager
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseManagerRoutingModule { }