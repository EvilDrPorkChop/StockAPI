import { Component, OnInit } from '@angular/core';
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "../chart.model";
import {AppStore, StateData, TickerData} from "../app.store";
import {ChartOptions} from "chart.js";
import {FormControl} from "@angular/forms";
import * as moment from 'moment';

@Component({
  selector: 'app-ticker-data',
  templateUrl: './ticker-data.component.html',
  styleUrls: ['./ticker-data.component.css']
})
export class TickerDataComponent implements OnInit {

  public tickerDataSubscription: Subscription = new Subscription();
  public priceData: Data = new Data();
  public volumeData: Data = new Data();
  public chosenTicker: string = "aapl";
  public intervalTypes: Interval[] = this.generateIntervalTypes();
  public chosenIntervalType: Interval = this.intervalTypes[1];
  public chosenInterval: number = 1;
  public currentScale: string = "minute";
  public fromDate: FormControl = new FormControl(moment().subtract(5, 'days').toDate());
  public toDate: FormControl = new FormControl(moment().toDate());

  constructor(public store:AppStore) {
  }

  ngOnInit(){
    this.tickerDataSubscription = this.store.tickerDataObserver.pipe(filter(r=> r!=null)).subscribe(result => {
      if(result){
        this.proccessTickerData(result)
      }
    });
  }

  public proccessTickerData(result: TickerData){
    let priceData = new Data();
    let volumeData = new Data();
    let openArray = [];
    let volumeArray = [];
    let openDataset = new DataSet();
    let volumeDataset = new DataSet();

    for(let i = 0; i <  result.opens.length; i++){
      openArray.push({
        x: result.dates[i],
        y: result.opens[i],
        ticker: result.ticker
      });
      openDataset.pointRadius.push(3);
      openDataset.pointBackgroundColor.push('#106aa2');
    }

    console.log(openArray);

    for(let i = 0; i <  result.volumes.length; i++){
      volumeArray.push({
        x: result.dates[i],
        y: result.volumes[i],
        ticker: result.ticker
      });
      volumeDataset.pointRadius.push(3);
      volumeDataset.pointBackgroundColor.push('#1023a2');
    }

    openDataset.data = openArray;
    openDataset.label = 'Open';
    openDataset.borderColor = "#1097a2"
    openDataset.backgroundColor = "#1097a2"

    volumeDataset.data = volumeArray;
    volumeDataset.label = 'Volume';
    volumeDataset.borderColor = "#104fa2"
    volumeDataset.backgroundColor = "#104fa2"

    priceData.datasets.push(openDataset);
    volumeData.datasets.push(volumeDataset);

    this.priceData = priceData;
    this.volumeData = volumeData;
  }

  public options(): ChartOptions|any {
    return{
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x:{
          type: 'time',
          time: {
            unit: this.currentScale
          }
        }
      }
    }
  }

  public chartOptions: ChartOptions = {
    responsive: true
  };

  public chartLabels :any[] = [];

  public chartLegend = false;

  public getTickerData(){
    let fromDate = (moment(this.fromDate.value)).format('YYYY-MM-DD')
    let toDate = (moment(this.toDate.value)).format('YYYY-MM-DD')
    this.store.getTickerData(this.chosenTicker, this.chosenIntervalType.key, this.chosenInterval, fromDate, toDate);
  }

  public generateIntervalTypes() {
    let intervals = [
      new Interval("minute", "Minute"),
      new Interval("hour", "Hour"),
      new Interval("day", "Day")
    ]
    return intervals;
  }
}
export class Period{
  key: string = "";
  name: string = "";
  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
  }
}

export class Interval{
  key: string = "";
  name: string = "";
  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
  }

}
