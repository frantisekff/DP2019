import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyalphCipher } from './polyalphabetic-cipher-component/polyalph-cipher.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { CdkStepperModule } from '@angular/cdk/stepper';
import {MatStepperModule} from '@angular/material/stepper';
import { TableComponent } from '../../components/table/table.component';
import { SharedModule } from '../../shared/shared.module';
import { PolyalphCipherService } from './polyalphabetic-cipher.service';

const polyalphRoutes: Routes = [
  { path: '', component: PolyalphCipher},
];

@NgModule({
  declarations: [
    PolyalphCipher
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(polyalphRoutes),
    MatInputModule,
    FormsModule,
    HighchartsChartModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    CdkStepperModule,
    MatStepperModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [PolyalphCipherService]
})
export class PolyalphCipherModule { }
