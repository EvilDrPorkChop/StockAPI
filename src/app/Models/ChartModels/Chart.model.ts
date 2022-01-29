import {ChartOptions} from "chart.js";

export enum ChartType{
  price,
  volume,
  pattern,
  value,
  shares,
  macd
}


export class ChartModel {
  public type: ChartType;

  constructor(type: ChartType) {
    this.type = type;
  }

  public options(scale: string): ChartOptions | any{
    return {
      responsive: true,
      maintainAspectRatio: false,
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
