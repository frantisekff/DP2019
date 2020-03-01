import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SortTable } from 'src/app/models/common.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() columnNames: string[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() defaultSort: SortTable;
  @ViewChild('sort', { static: true }) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;

  }

}
