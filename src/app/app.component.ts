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
  title = 'TradingVisualizer';
  mode: string = "Train";

  public tickerDataSubscription: Subscription = new Subscription();
  public stateDataSubscription: Subscription = new Subscription();
  public tickerData: Data = new Data();
  public valueData: Data = new Data();
  public volumeData: Data = new Data();
  public shareData: Data = new Data();
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
    this.stateDataSubscription = this.store.stateDataObserver.pipe(filter(r=> r!=null)).subscribe(result => {
      if(result){
        this.proccessStateData(result)
      }
    })
  }

  public proccessTickerData(result: TickerData){
    let newData = new Data();
    let openArray = [];
    let openDataset = new DataSet();

    for(let i = 0; i <  result.opens.length; i++){
      openArray.push({
        x: result.dates[i],
        y: result.opens[i],
        ticker: result.ticker
      });
      openDataset.pointBackgroundColor.push();
    }
    openDataset.data = openArray;
    openDataset.label = 'Open';
    newData.datasets.push(openDataset);

    this.tickerData = newData;
  }

  public proccessStateData(result: StateData){
    let tickerdata = new Data();
    let valueData = new Data();
    let volumeData = new Data();
    let shareData = new Data();
    let valueArray = [];
    let priceArray = [];
    let volumeArray = [];
    let shareArray = [];
    let volumeDataset = new DataSet();
    let shareDataset = new DataSet();
    let valueDataset = new DataSet();
    let priceDataset = new DataSet();

    for(let i = 0; i <  result.states.length; i++){
      valueArray.push({
        x: result.states[i].Date,
        y: result.states[i].Value,
      });
      priceArray.push({
        x: result.dates[i],
        y: result.opens[i],
      });
      volumeArray.push({
        x: result.states[i].Date,
        y: result.states[i].Volume,
      });
      shareArray.push({
        x: result.states[i].Date,
        y: result.states[i].Shares,
      })
      if(result.states[i].Action == "Buy"){
        valueDataset.pointBackgroundColor.push('green');
        valueDataset.pointStyle.push('triangle');
        valueDataset.pointRotation.push(0);
        valueDataset.pointRadius.push(8);

        priceDataset.pointBackgroundColor.push('green');
        priceDataset.pointStyle.push('triangle');
        priceDataset.pointRotation.push(0);
        priceDataset.pointRadius.push(8);

        volumeDataset.pointBackgroundColor.push('green');
        volumeDataset.pointStyle.push('triangle');
        volumeDataset.pointRotation.push(0);
        volumeDataset.pointRadius.push(8);

        shareDataset.pointBackgroundColor.push('green');
        shareDataset.pointStyle.push('triangle');
        shareDataset.pointRotation.push(0);
        shareDataset.pointRadius.push(8);
      }
      else if (result.states[i].Action == "Sell"){
        valueDataset.pointBackgroundColor.push('red');
        valueDataset.pointStyle.push('triangle');
        valueDataset.pointRotation.push(180);
        valueDataset.pointRadius.push(8);

        priceDataset.pointBackgroundColor.push('red');
        priceDataset.pointStyle.push('triangle');
        priceDataset.pointRotation.push(180);
        priceDataset.pointRadius.push(8);

        volumeDataset.pointBackgroundColor.push('red');
        volumeDataset.pointStyle.push('triangle');
        volumeDataset.pointRotation.push(180);
        volumeDataset.pointRadius.push(8);

        shareDataset.pointBackgroundColor.push('red');
        shareDataset.pointStyle.push('triangle');
        shareDataset.pointRotation.push(180);
        shareDataset.pointRadius.push(8);
      }
      else {
        valueDataset.pointBackgroundColor.push('white');
        valueDataset.pointStyle.push('circle');
        valueDataset.pointRotation.push(0);
        valueDataset.pointRadius.push(0);

        priceDataset.pointBackgroundColor.push('white');
        priceDataset.pointStyle.push('circle');
        priceDataset.pointRotation.push(0);
        priceDataset.pointRadius.push(0);

        volumeDataset.pointBackgroundColor.push('white');
        volumeDataset.pointStyle.push('circle');
        volumeDataset.pointRotation.push(0);
        volumeDataset.pointRadius.push(0);

        shareDataset.pointBackgroundColor.push('white');
        shareDataset.pointStyle.push('circle');
        shareDataset.pointRotation.push(0);
        shareDataset.pointRadius.push(0);
      }
    }
    valueDataset.data = valueArray;
    priceDataset.data = priceArray;
    volumeDataset.data = volumeArray;
    shareDataset.data = shareArray;

    priceDataset.label = 'Price';
    valueDataset.label = 'Value';
    volumeDataset.label = 'Volume';
    shareDataset.label = 'Shares';

    valueData.datasets.push(valueDataset);
    tickerdata.datasets.push(priceDataset);
    volumeData.datasets.push(volumeDataset);
    shareData.datasets.push(shareDataset);
    this.tickerData = tickerdata;
    this.valueData = valueData;
    this.volumeData = volumeData;
    this.shareData = shareData;
  }

  public options(lineColour: any): ChartOptions|any {
    return{
      responsive: true,
      maintainAspectRatio: false,
      borderColor: lineColour,
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

  public setTest(){
    this.mode = "Test";
  }

  public setTrain(){
    this.mode = "Train"
  }

  public getTickerData(){
    this.store.getData(this.chosenTicker, this.chosenInterval.key, this.chosenPeriod.key);
  }

  public startRun(){
    this.store.startRun(this.chosenTicker, this.chosenInterval.key, this.chosenPeriod.key, 200);
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
