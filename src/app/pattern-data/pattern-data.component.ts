import { Component, OnInit } from '@angular/core';
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "../chart.model";
import {AppStore, PatternData, TickerData} from "../app.store";
import {ChartOptions} from "chart.js";

@Component({
  selector: 'app-pattern-data',
  templateUrl: './pattern-data.component.html',
  styleUrls: ['./pattern-data.component.css']
})
export class PatternDataComponent implements OnInit {

  public patternDataSubscription: Subscription = new Subscription();
  public patternData: Data = new Data();
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
    this.patternDataSubscription = this.store.patternDataObserver.pipe(filter(r=> r!=null)).subscribe(result => {
      if(result){
        this.proccessPatternData(result)
      }
    });
  }

  public proccessPatternData(result: PatternData){
    let patternData = new Data();
    let hourlyArray = [];
    let dailyArray = [];
    let hourlyDataset = new DataSet();
    let dailyDataset = new DataSet();

    console.log(result.hours[result.hours.length-1]);
    console.log(result.hours[result.hours.length-1]);
    if(result.hours[result.hours.length-1] < result.hours[result.hours.length-2]){
      let hour: number = result.hours.pop() as number;
      let dayP: number = result.dayPattern.pop() as number;
      let hourP: number = result.hourPattern.pop() as number;
      result.hours.unshift(hour);
      result.hourPattern.unshift(hourP);
      result.dayPattern.unshift(dayP);
    }

    for(let i = 0; i <  result.hourPattern.length; i++){
      hourlyArray.push({
        x: result.hours[i],
        y: result.hourPattern[i],
        Time: i
      });
      hourlyDataset.pointRadius.push(3);
      hourlyDataset.pointBackgroundColor.push('#106aa2');
    }

    for(let i = 0; i <  result.dayPattern.length; i++){
      dailyArray.push({
        x: result.hours[i],
        y: result.dayPattern[i],
        Time: i
      });
      dailyDataset.pointRadius.push(3);
      dailyDataset.pointBackgroundColor.push('#1023a2');
    }

    console.log(hourlyArray);

    hourlyDataset.data = hourlyArray;
    hourlyDataset.label = 'Hourly';
    hourlyDataset.borderColor = "#1097a2"
    hourlyDataset.backgroundColor = "#1097a2"

    dailyDataset.data = dailyArray;
    dailyDataset.label = 'Daily';
    dailyDataset.borderColor = "#104fa2"
    dailyDataset.backgroundColor = "#104fa2"

    patternData.datasets.push(hourlyDataset);
    patternData.datasets.push(dailyDataset);

    this.patternData = patternData;
  }

  public options(): ChartOptions|any {
    return{
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          ticks: {
            stepSize: 0.5
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

  public getPatternData(){
    this.store.getPatternData(this.chosenTicker, this.chosenInterval.key, this.chosenPeriod.key);
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
