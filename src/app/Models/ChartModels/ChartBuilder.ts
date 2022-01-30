import {ChartModel, ChartType} from "./Chart.model";
import {PriceChartModel} from "./PriceChart.model";
import {PatternChartModel} from "./PatternChart.model";
import {VolumeChartModel} from "./VolumeChart.model";
import {GradientChartModel} from "./GradientChart.model";

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
    if(type == ChartType.gradient){
      return new GradientChartModel();
    }
    return new ChartModel(ChartType.price);
  }
}
