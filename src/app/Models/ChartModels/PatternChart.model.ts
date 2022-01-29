import {ChartModel, ChartType} from "./Chart.model";

export class PatternChartModel extends ChartModel{
  constructor() {
    super(ChartType.pattern);
  }

  override options(scale: string): any {
    return super.options(scale);
  }

  public override showScale(): boolean {
    return false;
  }
}
