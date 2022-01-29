import {ChartModel, ChartType} from "./Chart.model";

export class PriceChartModel extends ChartModel{
  constructor() {
    super(ChartType.price);
  }
}
