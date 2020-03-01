import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from '../components/table/table.component';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../components/graph/graph.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
    imports: [ MatTableModule, MatSortModule, CommonModule, HighchartsChartModule ],
    declarations: [TableComponent, GraphComponent],
    exports: [ MatTableModule, MatSortModule, TableComponent, GraphComponent, HighchartsChartModule ]
  })
  export class SharedModule {}