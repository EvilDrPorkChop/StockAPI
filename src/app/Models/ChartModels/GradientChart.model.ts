import {ChartModel, ChartType} from "./Chart.model";

export class GradientChartModel extends ChartModel{
  constructor() {
    super(ChartType.gradient);
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
          type: 'time',
          time: {
            unit: scale
          }
        },
        y: {
          type: "linear",
          ticks: {
            stepSize: 0.1
          }
        }
      }
    }
  }

}
