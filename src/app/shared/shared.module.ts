import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from '../components/table/table.component';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../components/graph/graph.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { KatexModule } from 'ng-katex';

@NgModule({
    imports: [ MatTableModule, MatSortModule, CommonModule, HighchartsChartModule, KatexModule ],
    declarations: [TableComponent, GraphComponent],
    exports: [ MatTableModule, MatSortModule, TableComponent, GraphComponent, HighchartsChartModule, KatexModule ]
  })
  export class SharedModule {}