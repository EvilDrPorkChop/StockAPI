import {Component, ViewChild} from '@angular/core';
import {Chart, ChartData, Color, ChartOptions, LinearScale, Title, ScaleOptions, Scale, ScaleChartOptions} from "chart.js";
import {AppStore, StateData, TickerData} from "./app.store";
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "./chart.model";
import 'chartjs-adapter-moment';
Chart.register(LinearScale, Title);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
