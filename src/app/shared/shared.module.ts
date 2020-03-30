import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from '../components/table/table.component';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../components/graph/graph.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { KatexModule } from 'ng-katex';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CdkStepperModule } from '@angular/cdk/stepper';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';

@NgModule({
  imports: [
    MatTableModule,
    MatSortModule,
    CommonModule,
    HighchartsChartModule,
    KatexModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    CdkStepperModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
  ],
  declarations: [TableComponent, GraphComponent, SideNavbarComponent],
  exports: [
    MatTableModule,
    MatSortModule,
    TableComponent,
    GraphComponent,
    SideNavbarComponent,
    HighchartsChartModule,
    KatexModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    CdkStepperModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSidenavModule
  ]
})
export class SharedModule {}
