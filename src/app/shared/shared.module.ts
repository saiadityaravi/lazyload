import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// Importing the dialog for the material
// Importing Router Module because we are using routerLink in the header
import { RouterModule } from "@angular/router";
import { enrollmentDialogComponent } from './components/enrollment-dialog/enrollment-dialog.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedService } from './services/shared.service';
import { PhonepalProfileComponent } from './components/phonepal_profile/phonepal-profile.component';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { PieChartComponent } from './charts/pie/pie.chart.directive';
import { DonutChartComponent } from './charts/donut/donut.chart.directive';
// Importing material components
import {
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSpinner
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimepickerModule } from 'ngx-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';

// Importing shared layout components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageContentComponent } from '../phonePal/components/page-content/page-content.component';
import { DialogMemberInteractionComponent } from '../phonePal/components/dialog-member-interaction/dialog-member-interaction.component';
import { InteractionComponent } from './components/interaction-outcome/interaction-outcome.component';

// Importing reusable pipes as well as services
import { KeysPipe } from './pipes/keys.pipe';
import { GroupByPipe } from './pipes/group-by.pipe';
import { BreadcrumsComponent } from './components/breadcrumb/breadcrumb.component';
import { spinnerService } from './services/spinner.service';
import { UrlconstantsService } from './services/urlconstants.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { connectorServices } from './services/connector.services';
import { dateFormat } from './pipes/date.pipe';
import { TruncatePipe } from './pipes/stringTruncate.pipe';
import { timerDialogue } from './components/timerDialogue/timerDialogue.component';
import { ContactFormat } from './pipes/formatContact.pipe';
import { TruncatePipeComment } from './pipes/commentTruncate.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatIconModule,
        BsDatepickerModule.forRoot(),
        TextMaskModule,
        MatToolbarModule,
        HttpModule,
        MatButtonModule,
        MatCardModule,
        MatMenuModule,
        MatCardModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatToolbarModule,
        MatTabsModule,
        MatDatepickerModule,
        MatRadioModule,
        MatNativeDateModule,
        MatCheckboxModule,
        FilterPipeModule,
        MatProgressSpinnerModule,
        TimepickerModule.forRoot(),
        OverlayModule
    ],
    declarations: [
        enrollmentDialogComponent,
        PhonepalProfileComponent,
        HeaderComponent,
        FooterComponent,
        PageContentComponent,
        PageNotFoundComponent,
        DialogMemberInteractionComponent,
        InteractionComponent,
        KeysPipe,
        GroupByPipe,
        BreadcrumsComponent,
        dateFormat,
        TruncatePipe,
        ContactFormat,
        timerDialogue,
        TruncatePipeComment,
        PieChartComponent,
        DonutChartComponent
    ],
    providers: [SharedService, spinnerService, UrlconstantsService, connectorServices, DatePipe, ContactFormat, TruncatePipeComment],
    exports: [
        enrollmentDialogComponent,
        PhonepalProfileComponent,
        HeaderComponent,
        FooterComponent,
        PageContentComponent,
        PageNotFoundComponent,
        DialogMemberInteractionComponent,
        InteractionComponent,
        MatButtonModule,
        MatDialogModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatToolbarModule,
        MatTabsModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        MatNativeDateModule,
        MatCheckboxModule,
        TimepickerModule,
        FilterPipeModule,
        BreadcrumsComponent,
        dateFormat,
        TruncatePipe,
        timerDialogue,
        ContactFormat,
        TruncatePipeComment,
        PieChartComponent,
        DonutChartComponent
        
    ],
    entryComponents: [
        enrollmentDialogComponent,
        DialogMemberInteractionComponent,
        timerDialogue
    ]
})
export class SharedModule { }