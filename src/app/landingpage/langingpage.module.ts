import { NgModule } from '@angular/core';
import { LandingpageComponent } from './landingpage/landingpage.component'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        ScrollDispatchModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        CommonModule,
        MatIconModule,
        SharedModule],
    declarations: [LandingpageComponent],
    exports: [LandingpageComponent],
    providers: [],
})

export class landingpageModule { }