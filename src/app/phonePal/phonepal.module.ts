import { NgModule } from '@angular/core';
import { PhonepalRoutingModule } from './phonepal-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/Profile/profile.component';
import { CommonModule } from '@angular/common';
import { PhonepalComponent } from './components/phonepal-page/phonepal.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { IsAvailable } from '../core/services/isAvailable.service';
import { PageContentComponent } from './components/page-content/page-content.component';
@NgModule({
  declarations: [
    ProfileComponent,
    PhonepalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PhonepalRoutingModule,
    MatProgressSpinnerModule
  ],
  exports: [PageContentComponent],
  providers: [IsAvailable]
})

export class PhonepalModule { }