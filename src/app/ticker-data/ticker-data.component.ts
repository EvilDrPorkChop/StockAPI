import { Component, OnInit } from '@angular/core';
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "../chart.model";
import {AppStore, StateData, TickerData} from "../app.store";
import {ChartOptions} from "chart.js";

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
  public periods: Period[] = this.generatePeriods();
  public intervals: Interval[] = this.generateIntervals();
  public chosenInterval: Interval = this.intervals[0];
  public chosenPeriod: Period = this.periods[0];
  public currentScale: string = "minute";

  constructor(public store:AppStore) {
  }

  ngOnInit(){
    this.generatePeriods();
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
    this.store.getData(this.chosenTicker, this.chosenInterval.key, this.chosenPeriod.key);
  }

  public generatePeriods(){
    let periods = [
      new Period("1h", "1 Hour"),
      new Period("1d", "1 Day"),
      new Period("5d", "5 Days"),
      new Period("1mo", "1 Month"),
      new Period("3mo", "3 Months"),
      new Period("6mo", "6 Months"),
      new Period("1y", "1 Year")
    ]
    return periods;
  }

  public generateIntervals() {
    let intervals = [
      new Interval("1m", "1 Minute"),
      new Interval("2m", "2 Minutes"),
      new Interval("5m", "5 Minutes"),
      new Interval("30m", "30 Minutes"),
      new Interval("1h", "1 Hour"),
      new Interval("1d", "1 day"),
      new Interval("5d", "5 days"),
      new Interval("1w", "1 week"),
      new Interval("1mo", "1 month")
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
