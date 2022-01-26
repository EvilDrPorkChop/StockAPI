import {ChartType} from "../chart/chart.model";
import {AppStore, TickerData} from "../../app.store";
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "../../Models/chartData.model";
import {InputType} from "../../Models/input.model";
import {Interval} from "../../Models/intervals.model";
import {ChartComponent} from "../chart/chart.component";

export enum ComponentType{
  ticker = 0,
  trader = 1,
  pattern = 2
}

export interface ComponentSelectorData {
  componentType: ComponentType;
  allComponentTypes: ComponentType[];
}

export class DashboardComponentModel {
  public type: ComponentType;
  public store: AppStore;
  public dataSubscription: Subscription = new Subscription();
  public datas : Data[] = [];
  public chartTypes: ChartType[] = [];
  public inputs: string[] = [];
  public charts: ChartComponent[] = [];

  constructor(type: ComponentType, store: AppStore) {
    this.type = type;
    this.store = store;
  }

  public subscribe(){
    if(this.type == ComponentType.ticker) {
      this.dataSubscription = this.store.tickerDataObserver.pipe(filter(r=> r!=null)).subscribe(result => {
        if(result){
          this.proccessTickerData(result)
          this.updateCharts();
          console.log(this.datas)
        }
      });
    }
  }

  public updateCharts(){
    for(let cc of this.charts){
      for(let dat of this.datas){
        if (dat.chartType == cc.chartType){
          cc.data = dat;
          console.log(dat)
        }
      }
    }
  }

  public getTitle(){
    if(this.type == ComponentType.ticker) {
      return "Ticker Data"
    }
    return "unknown"
  }

  public getData(index: number){
    if(this.datas.length-1 <= index ){
      return this.datas[index];
    }
    return new Data();
  }

  public getInputs(){
    let inputs: InputType[] = []
    if(this.type == ComponentType.ticker) {
      inputs.push(InputType.ticker);
      inputs.push(InputType.interval);
      inputs.push(InputType.intervalType);
      inputs.push(InputType.fromDate);
      inputs.push(InputType.toDate);
    }
    if(this.type == ComponentType.trader) {
      inputs.push(InputType.ticker);
      inputs.push(InputType.interval);
      inputs.push(InputType.intervalType);
      inputs.push(InputType.fromDate);
      inputs.push(InputType.toDate);
    }
    if(this.type == ComponentType.pattern) {
      inputs.push(InputType.ticker);
      inputs.push(InputType.fromDate);
      inputs.push(InputType.toDate);
    }

    return inputs;
  }

  public getAvailableChartTypes(){
    let types: ChartType[] = []
    if(this.type == ComponentType.ticker) {
      types.push(ChartType.price);
      types.push(ChartType.volume);
    }
    if(this.type == ComponentType.pattern) {
      types.push(ChartType.pattern);
    }
    return types;
  }

  public loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string){
    if(this.type == ComponentType.ticker) {
        this.store.getTickerData(ticker, intervalType.key, interval, fromDate, toDate);
    }
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
    priceData.chartType = ChartType.price;
    volumeData.chartType = ChartType.volume;

    this.datas = []
    this.datas.push(priceData);
    this.datas.push(volumeData)
  }
}
