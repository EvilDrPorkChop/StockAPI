import {ChartModel, ChartType} from "./Chart.model";

export class VolumeChartModel extends ChartModel{
  constructor() {
    super(ChartType.volume);
  }
}
