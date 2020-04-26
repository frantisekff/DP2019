import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { SortTable } from "src/app/models/common.model";
import { Subscription, Subscribable, Subscriber, Observable } from "rxjs";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() columnNames: string[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() defaultSort: SortTable;
  @Input() ready: Observable<boolean>;
  @Input() fullWidth: boolean = true;
  @Input() stickyColumns?: { stickyStart: string; stickyEnd: string; stickyHeader: boolean };

  @ViewChild("sort", { static: true }) sort: MatSort;
  private readySubscription: Subscription;

  constructor() {}

  ngOnInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
    this.readySubscription = this.ready.subscribe((data) => {
      if (data === true && this.dataSource) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  isStickyStart(column: string): boolean {
    if (!this.stickyColumns) {
      return false;
    }
    return this.stickyColumns.stickyStart === column ? true : false;
  }

  isStickyEnd(column: string): boolean {
    if (!this.stickyColumns) {
      return false;
    }
    return this.stickyColumns.stickyEnd === column ? true : false;
  }

  ngOnDestroy(): void {
    this.readySubscription.unsubscribe();
  }
}
