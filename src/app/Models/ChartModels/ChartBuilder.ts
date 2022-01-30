import {ChartModel, ChartType} from "./Chart.model";
import {PriceChartModel} from "./PriceChart.model";
import {PatternChartModel} from "./PatternChart.model";
import {VolumeChartModel} from "./VolumeChart.model";

export class ChartBuilder{

  constructor() {
  }

  buildChartModel(type: ChartType): ChartModel{
    if(type == ChartType.price){
      return new PriceChartModel();
    }
    if(type == ChartType.pattern){
      return new PatternChartModel();
    }
    if(type == ChartType.volume){
      return new VolumeChartModel();
    }
    return new ChartModel(ChartType.price);
  }
}
