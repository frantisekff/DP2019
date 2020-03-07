import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { SortTable } from "src/app/models/common.model";
import { Subscription, Subscribable, Subscriber, Observable } from "rxjs";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() columnNames: string[];
  @Input() dataSource: MatTableDataSource<any>;
  @Input() defaultSort: SortTable;
  @Input() ready: Observable<boolean>;
  @ViewChild("sort", { static: true }) sort: MatSort;
  private readySubscription: Subscription;

  constructor() {}

  ngOnInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
    this.readySubscription = this.ready.subscribe(data => {
      if (data === true && this.dataSource) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngOnDestroy(): void {
    this.readySubscription.unsubscribe();
  }
}
