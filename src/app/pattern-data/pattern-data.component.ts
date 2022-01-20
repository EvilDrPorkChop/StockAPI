import { Component, OnInit } from '@angular/core';
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "../chart.model";
import {AppStore, PatternData, TickerData} from "../app.store";
import {ChartOptions} from "chart.js";
import {FormControl} from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: 'app-pattern-data',
  templateUrl: './pattern-data.component.html',
  styleUrls: ['./pattern-data.component.css']
})
export class PatternDataComponent implements OnInit {

  public patternDataSubscription: Subscription = new Subscription();
  public patternData: Data = new Data();
  public minMaxData: Data = new Data();
  public chosenTicker: string = "aapl";
  public intervalTypes: Interval[] = this.generateIntervalTypes();
  public chosenIntervalType: Interval = this.intervalTypes[1];
  public chosenInterval: number = 1;
  public fromDate: FormControl = new FormControl(moment().subtract(5, 'days').toDate());
  public toDate: FormControl = new FormControl(moment().toDate());
  public average: number = 0;

  constructor(public store:AppStore) {
  }

  ngOnInit(){
    this.patternDataSubscription = this.store.patternDataObserver.pipe(filter(r=> r!=null)).subscribe(result => {
      if(result){
        this.proccessPatternData(result)
      }
    });
  }

  public proccessPatternData(result: PatternData){
    let patternData = new Data();
    let minmaxData = new Data();
    let hourlyArray = [];
    let dailyArray = [];
    let minMaxArray = [];
    let hourlyDataset = new DataSet();
    let dailyDataset = new DataSet();
    let minMaxDataset = new DataSet();


    for(let i = 0; i <  result.hourPattern.length; i++){
      hourlyArray.push({
        x: result.hours[i],
        y: result.hourPattern[i],
        Time: i
      });
      hourlyDataset.pointRadius.push(3);
      hourlyDataset.pointBackgroundColor.push('#106aa2');
    }
    hourlyArray.sort((a, b) => (a.x > b.x) ? 1 : -1)

    for(let i = 0; i <  result.dayPattern.length; i++){
      dailyArray.push({
        x: result.hours[i],
        y: result.dayPattern[i],
        Time: i
      });
      dailyDataset.pointRadius.push(3);
      dailyDataset.pointBackgroundColor.push('#1023a2');
    }
    dailyArray.sort((a, b) => (a.x > b.x) ? 1 : -1)

    for(let i = 0; i <  result.minmaxs.length; i++){
      minMaxArray.push({
        x: result.dates[i],
        y: result.minmaxs[i],
        Time: i
      });
      minMaxDataset.pointRadius.push(3);
      minMaxDataset.pointBackgroundColor.push('#1023a2');
    }
    this.average = result.average;

    console.log(hourlyArray);

    hourlyDataset.data = hourlyArray;
    hourlyDataset.label = 'Hourly';
    hourlyDataset.borderColor = "#1097a2"
    hourlyDataset.backgroundColor = "#1097a2"

    dailyDataset.data = dailyArray;
    dailyDataset.label = 'Daily';
    dailyDataset.borderColor = "#104fa2"
    dailyDataset.backgroundColor = "#104fa2"

    minMaxDataset.data = minMaxArray;
    minMaxDataset.label = 'Max %Diff from open';
    minMaxDataset.borderColor = "#104fa2"
    minMaxDataset.backgroundColor = "#104fa2"

    patternData.datasets.push(hourlyDataset);
    patternData.datasets.push(dailyDataset);
    minmaxData.datasets.push(minMaxDataset);

    this.patternData = patternData;
    this.minMaxData = minmaxData;

  }

  public options(isLinear: boolean): ChartOptions|any {
    if(isLinear) {
      return {
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
    else{
      return{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x:{
            type: 'time',
            time: {
              unit: 'day'
            }
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
    let fromDate = (moment(this.fromDate.value)).format('YYYY-MM-DD')
    let toDate = (moment(this.toDate.value)).format('YYYY-MM-DD')
    this.store.getPatternData(this.chosenTicker, fromDate, toDate);
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
