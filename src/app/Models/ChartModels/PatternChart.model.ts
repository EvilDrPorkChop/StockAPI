import {ChartModel, ChartType} from "./Chart.model";

export class PatternChartModel extends ChartModel{
  constructor() {
    super(ChartType.pattern);
    this.title = "Ticker Pattern"
  }

  override options(scale: string): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: this.showLegend()
      },
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

  public override showScale(): boolean {
    return false;
  }
}
