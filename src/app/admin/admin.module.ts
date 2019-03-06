import { NgModule } from '@angular/core';
import { adminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { datatablelistassociatesComponent } from './components/data_tablelist_associates/data-tablelist-associates.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { datatablelistMemberComponent } from './components/data_tablelist_member/data-tablelist-member.component';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { ObserversModule } from '@angular/cdk/observers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatGridListModule, MatStepperModule, MatProgressSpinnerModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/Dashboard/dashboard.component';
import { Memberpagecomponent } from './components/memberpage-component/memberpage.component';
import { ProfileComponentadmin } from './components/Profile/profile.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { addAssociate } from './components/add-associate-dialoge/add-associate-dialoge';
import { memberAssignDialogueComponent } from '../admin/components/member-assign-dialogue/member-assign-dialogue.component';
import { ConfirmDialogue } from './components/confirmDialogue/confirmDialogue.component';
import { memberUnassignDialogueComponent } from './components/member-unassign-dialogue/member-unassign-dialogue.component';
import { FullCalendarModule } from 'ng-fullcalendar';

// Admin Module

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    Memberpagecomponent,
    datatablelistassociatesComponent,
    datatablelistMemberComponent,
    ProfileComponentadmin,
    addAssociate,
    memberAssignDialogueComponent,
    ConfirmDialogue,
    memberUnassignDialogueComponent
  ],
  imports: [
    FullCalendarModule,
    ReactiveFormsModule,
    FormsModule,
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,
    CommonModule,
    MatTableModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatGridListModule,
    FlexLayoutModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    adminRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [],
  providers: [DatePipe],
  entryComponents: [addAssociate, memberAssignDialogueComponent, ConfirmDialogue, memberUnassignDialogueComponent]
})

// Admin Module
export class adminModule { }