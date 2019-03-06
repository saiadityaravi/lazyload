import { NgModule } from '@angular/core';
import { connectorRoutingModule } from './connector-routing.module';
import { SharedModule } from '../shared/shared.module';
import { datatablelistPhonepalComponent } from './components/data_tablelist_phonepal/data-tablelist-phonepal.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkDetailPhonepalRowDirective } from './Directives/cdk-detail-phonepalrow.directive';
import { CdkDetailMemberRowDirective } from './Directives/cdk-detail-memberrow.directive';
import { datatablelistMemberComponent } from './components/data_tablelist_member/data-tablelist-member.component';
import { connectorComponent } from './components/connectorPage/connectorpage.component';
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
import { ConnectorDashboardComponent } from './components/Dashboard/dashboard.component';
import { ProfileComponentconnector } from './components/Profile/profile.component';
import { memberAssignDialogueComponent } from './components/member-assign-dialogue/member-assign-dialogue.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Memberpagecomponent } from './components/memberpage-component/memberpage.component';
import { notesDialogueComponent } from './components/notes-dialogue/notes_dialogue.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { IsAvailable } from '../core/services/isAvailable.service';


@NgModule({
  declarations: [
    datatablelistPhonepalComponent,
    datatablelistMemberComponent,
    CdkDetailPhonepalRowDirective,
    CdkDetailMemberRowDirective,
    editDialogueComponent,
    memberrefrerralDialogueComponent,
    connectorComponent,
    ConnectorDashboardComponent,
    ProfileComponentconnector,
    memberAssignDialogueComponent,
    Memberpagecomponent,
    notesDialogueComponent

  ],
  imports: [
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
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    connectorRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatGridListModule,
    FlexLayoutModule,
    TextMaskModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [],
  providers: [DatePipe, IsAvailable],
  entryComponents: [editDialogueComponent, memberrefrerralDialogueComponent, memberAssignDialogueComponent, notesDialogueComponent]
})

export class connectorModule { }