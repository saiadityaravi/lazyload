import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/Profile/profile.component';
import { PhonepalComponent } from './components/phonepal-page/phonepal.component';
import { AuthGuard } from '../core/services/auth-guard.service'
import { PageContentComponent } from './components/page-content/page-content.component';
import { IsAvailable } from '../core/services/isAvailable.service';

const routes: Routes = [
  {
    path: "",
    data: {
      breadcrumb: {
        desc: "Home"
      }
    },
    component: PhonepalComponent,
    children: [
      {
        path: "",
        canActivate:[IsAvailable],
        data: {
          breadcrumb: {
            desc: ""
          }
        },
        component: PageContentComponent
      },
      {
         path: "profile",
    data: {
      breadcrumb: {
        desc: "profile"
      },
    },
    component: ProfileComponent
      }
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhonepalRoutingModule { }