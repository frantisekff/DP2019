import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyalphCipher } from './polyalphabetic-cipher-enc-dec/polyalphCipherEncDec.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule} from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';

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
    MatTableModule,
    MatButtonToggleModule,
    MatIconModule

  ]
})
export class PolyalphCipherModule { }
