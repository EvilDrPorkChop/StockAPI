import {ChartType} from "./chart.model";
import {AppStore, PatternData, TickerData} from "../app.store";
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "./chartData.model";
import {InputType} from "./input.model";
import {Interval} from "./intervals.model";
import {ChartComponent} from "../Components/chart/chart.component";

export enum ComponentType{
  ticker,
  trader,
  pattern
}

export interface ComponentSelectorData {
  componentType: ComponentType;
  allComponentTypes: ComponentType[];
}

export class ComponentBuilder{
  public store: AppStore;
  constructor(store: AppStore) {
    this.store = store;
  }

  buildComponentModel(type: ComponentType): ComponentModel{
    if(type == ComponentType.ticker){
      return new TickerDataComponent(this.store);
    }
    if(type == ComponentType.pattern){
      return new PatternDataComponent(this.store);
    }
    return new TickerDataComponent(this.store);
  }
}

export abstract class ComponentModel {
  public ticker: string = 'aapl';
  public fromDate: string = '';
  public toDate: string = '';
  public type: ComponentType;
  public store: AppStore;
  public dataSubscription: Subscription = new Subscription();
  public datas : Data[] = [];
  public chartTypes: ChartType[] = [];
  public inputs: string[] = [];
  public charts: ChartComponent[] = [];
  public title: string;

  constructor(type: ComponentType, store: AppStore) {
    this.type = type;
    this.store = store;
  }

  public abstract subscribe(): void

  public updateCharts(): void{
    for(let cc of this.charts){
      for(let dat of this.datas){
        if (dat.chartType == cc.chartType){
          cc.updateData(dat);
        }
      }
    }
  }

  public getTitle(){
    return this.title;
  }

  public getData(index: number){
    if(this.datas.length-1 <= index ){
      return this.datas[index];
    }
    return new Data();
  }

  public abstract getInputs(): InputType[]

  public abstract getAvailableChartTypes(): ChartType[]

  public abstract loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string): void

  public abstract processData(result: any): void
}

export class TickerDataComponent extends ComponentModel{

  constructor(store: AppStore) {
    super(ComponentType.ticker, store);
  }

  public subscribe() {
    this.dataSubscription = this.store.tickerDataObserver.pipe(filter(r =>
      r != null &&
      r.ticker == this.ticker &&
      r.fromDate == this.fromDate &&
      r.toDate == this.toDate)).subscribe(result => {
      if (result) {
        this.processData(result)
        this.updateCharts();
      }
    });
  }

  public getInputs() {
    let inputs: InputType[] = []
    inputs.push(InputType.ticker);
    inputs.push(InputType.interval);
    inputs.push(InputType.intervalType);
    inputs.push(InputType.fromDate);
    inputs.push(InputType.toDate);
    return inputs;
  }
  public getAvailableChartTypes(): ChartType[]{
    let types: ChartType[] = []
    types.push(ChartType.price);
    types.push(ChartType.volume);
    return types;
  }

  public loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string): void{
    this.ticker = ticker;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.getTickerData(ticker, intervalType.key, interval, fromDate, toDate);
  }

  public processData(result: TickerData){
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
    priceData.chartType = ChartType.price;
    volumeData.chartType = ChartType.volume;

    this.datas = []
    this.datas.push(priceData);
    this.datas.push(volumeData)
  }
}

export class PatternDataComponent extends ComponentModel{

  constructor(store: AppStore) {
    super(ComponentType.ticker, store);
  }

  public subscribe() {
    this.dataSubscription = this.store.patternDataObserver.pipe(filter(r=>
      r!=null &&
      r.ticker==this.ticker &&
      r.fromDate ==this.fromDate &&
      r.toDate==this.toDate)).subscribe(result => {
      if (result) {
        this.processData(result)
        this.updateCharts();
      }
    });
  }

  public getInputs() {
    let inputs: InputType[] = []
    inputs.push(InputType.ticker);
    inputs.push(InputType.fromDate);
    inputs.push(InputType.toDate);
    return inputs;
  }

  public getAvailableChartTypes(): ChartType[]{
    let types: ChartType[] = []
    types.push(ChartType.pattern);
    types.push(ChartType.price);
    return types;
  }

  public loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string): void{
    this.ticker = ticker;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.getPatternData(ticker, fromDate, toDate);
  }

  public processData(result: PatternData){
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

    patternData.chartType = ChartType.pattern;
    minmaxData.chartType = ChartType.price;

    this.datas.push(patternData);
    this.datas.push(minmaxData)
  }
}
