import { NgModule } from '@angular/core';
import { CaseManagerRoutingModule } from './casemanager-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkDetailMemberRowDirective } from './Directives/cdk-detail-memberrow.directive';
import { datatablelistMemberComponent } from './components/data_tablelist_member/data-tablelist-member.component';
import { CaseManagerComponent } from './components/caseManagerPage/casemanagerpage.component';
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
import { editDialogueComponent } from './components/edit-dialogue/edit_dialogue.component';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TextMaskModule } from 'angular2-text-mask';
import { memberrefrerralDialogueComponent } from './components/member-referral-dialoge/member-referral-dialoge';
import { CaseManagerDashboardComponent } from './components/Dashboard/dashboard.component';
import { ProfileComponentCasemanager } from './components/Profile/profile.component';
import { historyDialogueComponent } from './components/referral-history-dialogue/history_dialogue.component';


@NgModule({
  declarations: [
    datatablelistMemberComponent,
    CdkDetailMemberRowDirective,
    editDialogueComponent,
    memberrefrerralDialogueComponent,
    CaseManagerComponent,
    CaseManagerDashboardComponent,
    ProfileComponentCasemanager,
    historyDialogueComponent
  ],
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
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
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    CaseManagerRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    SharedModule,
    MatTooltipModule,
    MatDialogModule,
    MatGridListModule,
    FlexLayoutModule,
    TextMaskModule,
    MatStepperModule
  ],
  exports: [],
  providers: [],
  entryComponents: [editDialogueComponent, memberrefrerralDialogueComponent, historyDialogueComponent]
})

export class CaseManagerModule { }