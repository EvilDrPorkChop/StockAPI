import {TraderComponent, TraderType} from "./TraderComponent.model";
import {AppStore, StateData} from "../../../app.store";
import {InputType} from "../../Shared/input.model";
import {ChartType} from "../../ChartModels/Chart.model";
import {Data, DataSet} from "../../Shared/chartData.model";

export class PeakTraderComponent extends TraderComponent{
  constructor(store: AppStore) {
    super(store, TraderType.peak);
  }

  public override getInputs(): InputType[] {
    let inputs: InputType[] = []
    inputs.push(InputType.ticker);
    inputs.push(InputType.interval);
    inputs.push(InputType.intervalType);
    inputs.push(InputType.fromDate);
    inputs.push(InputType.toDate);
    inputs.push(InputType.startBalance);
    inputs.push(InputType.threshold);
    return inputs;
  }

  public getAvailableChartTypes(): ChartType[]{
    let types: ChartType[] = []
    types.push(ChartType.price);
    types.push(ChartType.value);
    types.push(ChartType.volume);
    types.push(ChartType.shares);
    types.push(ChartType.gradient);
    return types;
  }

  public processData(result: StateData){
    let tickerdata = new Data();
    let valueData = new Data();
    let volumeData = new Data();
    let shareData = new Data();
    let gradientData = new Data();
    let valueArray = [];
    let longArray = []
    let priceArray = [];
    let volumeArray = [];
    let shareArray = [];
    let maArray = [];
    let gradientArray = [];
    let volumeDataset = new DataSet();
    let shareDataset = new DataSet();
    let valueDataset = new DataSet();
    let longDataset = new DataSet();
    let priceDataset = new DataSet();
    let maDataset = new DataSet();
    let gradientDataset = new DataSet();

    console.log(result);

    for(let i = 0; i <  result.states.length; i++){
      valueArray.push({
        x: result.states[i].Date,
        y: result.states[i].Value,
      });
      longArray.push({
        x: result.longs[i].Date,
        y: result.longs[i].Value,
      });
      priceArray.push({
        x: result.dates[i],
        y: result.opens[i],
      });
      volumeArray.push({
        x: result.states[i].Date,
        y: result.states[i].Volume,
      });
      shareArray.push({
        x: result.states[i].Date,
        y: result.states[i].Shares,
      })
      maArray.push({
        x: result.states[i].Date,
        y: result.ma[i],
      })
      gradientArray.push({
        x: result.states[i].Date,
        y: result.gradient[i],
      })
      if(result.isPeaks[i]){
        valueDataset.pointBackgroundColor.push('green');
        valueDataset.pointStyle.push('triangle');
        valueDataset.pointRotation.push(0);
        valueDataset.pointRadius.push(8);

        priceDataset.pointBackgroundColor.push('green');
        priceDataset.pointStyle.push('triangle');
        priceDataset.pointRotation.push(0);
        priceDataset.pointRadius.push(8);

        volumeDataset.pointBackgroundColor.push('green');
        volumeDataset.pointStyle.push('triangle');
        volumeDataset.pointRotation.push(0);
        volumeDataset.pointRadius.push(8);

        shareDataset.pointBackgroundColor.push('green');
        shareDataset.pointStyle.push('triangle');
        shareDataset.pointRotation.push(0);
        shareDataset.pointRadius.push(8);
      }
      else if (result.isDips[i]){
        valueDataset.pointBackgroundColor.push('red');
        valueDataset.pointStyle.push('triangle');
        valueDataset.pointRotation.push(180);
        valueDataset.pointRadius.push(8);

        priceDataset.pointBackgroundColor.push('red');
        priceDataset.pointStyle.push('triangle');
        priceDataset.pointRotation.push(180);
        priceDataset.pointRadius.push(8);

        volumeDataset.pointBackgroundColor.push('red');
        volumeDataset.pointStyle.push('triangle');
        volumeDataset.pointRotation.push(180);
        volumeDataset.pointRadius.push(8);

        shareDataset.pointBackgroundColor.push('red');
        shareDataset.pointStyle.push('triangle');
        shareDataset.pointRotation.push(180);
        shareDataset.pointRadius.push(8);
      }
      else {
        valueDataset.pointBackgroundColor.push('white');
        valueDataset.pointStyle.push('circle');
        valueDataset.pointRotation.push(0);
        valueDataset.pointRadius.push(0);

        priceDataset.pointBackgroundColor.push('white');
        priceDataset.pointStyle.push('circle');
        priceDataset.pointRotation.push(0);
        priceDataset.pointRadius.push(0);

        volumeDataset.pointBackgroundColor.push('white');
        volumeDataset.pointStyle.push('circle');
        volumeDataset.pointRotation.push(0);
        volumeDataset.pointRadius.push(0);

        shareDataset.pointBackgroundColor.push('white');
        shareDataset.pointStyle.push('circle');
        shareDataset.pointRotation.push(0);
        shareDataset.pointRadius.push(0);
      }
    }
    valueDataset.data = valueArray;
    longDataset.data = longArray;
    priceDataset.data = priceArray;
    volumeDataset.data = volumeArray;
    shareDataset.data = shareArray;
    maDataset.data = maArray;
    gradientDataset.data = gradientArray;

    priceDataset.label = 'Price';
    valueDataset.label = 'Value';
    longDataset.label = 'Long Investment';
    volumeDataset.label = 'Volume';
    shareDataset.label = 'Shares';
    maDataset.label = 'Moving Average';
    gradientDataset.label = 'MA Gradient';

    priceDataset.borderColor = "#1097a2"
    valueDataset.borderColor = "#216c17"
    longDataset.borderColor = "#6ea91a"
    volumeDataset.borderColor = "#0045e7"
    shareDataset.borderColor = "#3bb01e"
    maDataset.borderColor = "#083896"
    gradientDataset.borderColor = "#1f1f1f"

    priceDataset.backgroundColor = priceDataset.borderColor;
    valueDataset.backgroundColor = valueDataset.borderColor;
    longDataset.backgroundColor = longDataset.borderColor;
    volumeDataset.backgroundColor = volumeDataset.borderColor;
    shareDataset.backgroundColor = shareDataset.borderColor;
    maDataset.backgroundColor = maDataset.borderColor;
    gradientDataset.backgroundColor = gradientDataset.borderColor;

    valueData.chartType = ChartType.value;
    tickerdata.chartType = ChartType.price;
    volumeData.chartType = ChartType.volume;
    shareData.chartType = ChartType.shares;
    gradientData.chartType = ChartType.gradient;

    valueData.datasets.push(valueDataset);
    valueData.datasets.push(longDataset);
    tickerdata.datasets.push(priceDataset);
    tickerdata.datasets.push(maDataset);
    volumeData.datasets.push(volumeDataset);
    shareData.datasets.push(shareDataset);
    gradientData.datasets.push(gradientDataset);

    this.datas.push(tickerdata)
    this.datas.push(valueData)
    this.datas.push(volumeData)
    this.datas.push(shareData)
    this.datas.push(gradientData)
  }
}
