import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from '../components/table/table.component';
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [ MatTableModule, MatSortModule, CommonModule],
    declarations: [TableComponent],
    exports: [ MatTableModule, MatSortModule, TableComponent]
  })
  export class SharedModule {}