import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  
  updateState = false;
  private Highcharts = Highcharts;
  
  @Input() chartOptionsFreqGraph: any = {};
  @Input() set data(data: any) {
    this.chartOptionsFreqGraph.series[0].data = data;
  }
  constructor() { }

  ngOnInit() {
  }

  updateGraph(){
    this.updateState = true;
  }

  

}
