import {AppStore} from "../app.store";
import {ChartOptions} from "chart.js";

export enum ChartType{
  price,
  volume,
  pattern,
  value,
  shares,
  macd
}

export interface ChartSelectorData {
  chartType: ChartType;
  availableChartTypes: ChartType[];
}

export class ChartModel{
  public type: ChartType;

  constructor(type: ChartType) {
    this.type = type;
  }

  public options(scale: string): ChartOptions|any{
    if(this.type == ChartType.price){
      return{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x:{
            type: 'time',
            time: {
              unit: scale
            }
          }
        }
      }
    }

    if(this.type == ChartType.volume){
      return{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x:{
            type: 'time',
            time: {
              unit: scale
            }
          }
        }
      }
    }

    if(this.type == ChartType.pattern){
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
              unit: scale
            }
          }
        }
      }
    }
  }

  public showScale(): boolean{
    if(this.type == ChartType.pattern){
      return false;
    }
    return true;
  }

}
