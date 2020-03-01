import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  private Highcharts = Highcharts;
  @Input() updateFlagFreqGraph = false;
  @Input() chartOptionsFreqGraph = {};

  constructor() { }

  ngOnInit() {
  }


}
