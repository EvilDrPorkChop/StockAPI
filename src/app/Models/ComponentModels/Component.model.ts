import {ChartType} from "../chart.model";
import {AppStore, PatternData, TickerData} from "../../app.store";
import {filter, Subscription} from "rxjs";
import {Data, DataSet} from "../chartData.model";
import {InputType} from "../input.model";
import {Interval} from "../intervals.model";
import {ChartComponent} from "../../Components/chart/chart.component";

export enum ComponentType{
  ticker,
  trader,
  pattern
}

export interface ComponentSelectorData {
  componentType: ComponentType;
  allComponentTypes: ComponentType[];
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
