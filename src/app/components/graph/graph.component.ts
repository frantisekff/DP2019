import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  updateState = false;
  Highcharts = Highcharts;

  @Input() chartOptionsFreqGraph: any = {};
  @Input() set data(data: []) {
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.chartOptionsFreqGraph.series[i].data = data[i];
      }
    }
  }
  constructor() {}

  ngOnInit() {}

  updateGraph() {
    this.updateState = true;
  }
}
