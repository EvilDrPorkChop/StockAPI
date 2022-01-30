import {ChartOptions} from "chart.js";

export enum ChartType{
  price,
  volume,
  pattern,
  value,
  shares,
  macd,
  gradient
}


export class ChartModel {
  public type: ChartType;
  public title: string;
  public numOfDatasets = 0;

  constructor(type: ChartType) {
    this.type = type;
  }

  public getTitle(){
    return this.title;
  }

  public showLegend(){
    return this.numOfDatasets>1;
  }

  public options(scale: string): ChartOptions | any{
    return {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: this.showLegend()
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: scale
          }
        }
      }
    }
  }

  public showScale(): boolean {
    return true;
  }

}
