import {TraderComponent, TraderType} from "./TraderComponent.model";
import {AppStore, StateData} from "../../../app.store";
import {InputType} from "../../input.model";
import {Data, DataSet} from "../../chartData.model";
import {ChartType} from "../../chart.model";

export class MacdTraderComponent extends TraderComponent{
  constructor(store: AppStore) {
    super(store, TraderType.macd);
  }

  public override getInputs(): InputType[] {
    let inputs: InputType[] = []
    inputs.push(InputType.ticker);
    inputs.push(InputType.interval);
    inputs.push(InputType.intervalType);
    inputs.push(InputType.fromDate);
    inputs.push(InputType.toDate);
    inputs.push(InputType.startBalance);
    return inputs;
  }

  public getAvailableChartTypes(): ChartType[]{
    let types: ChartType[] = []
    types.push(ChartType.price);
    types.push(ChartType.value);
    types.push(ChartType.volume);
    types.push(ChartType.shares);
    types.push(ChartType.macd);
    return types;
  }

  public processData(result: StateData){
    let tickerdata = new Data();
    let valueData = new Data();
    let volumeData = new Data();
    let shareData = new Data();
    let macData = new Data();
    let valueArray = [];
    let longArray = []
    let priceArray = [];
    let volumeArray = [];
    let shareArray = [];
    let macdArray = [];
    let signalArray = [];
    let volumeDataset = new DataSet();
    let shareDataset = new DataSet();
    let valueDataset = new DataSet();
    let longDataset = new DataSet();
    let priceDataset = new DataSet();
    let macdDataset = new DataSet();
    let signalDataset = new DataSet();

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
      macdArray.push({
        x: result.states[i].Date,
        y: result.macd[i],
      })
      signalArray.push({
        x: result.states[i].Date,
        y: result.signals[i],
      })
      if(result.states[i].Action == "Buy"){
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

        macdDataset.pointBackgroundColor.push('green');
        macdDataset.pointStyle.push('triangle');
        macdDataset.pointRotation.push(0);
        macdDataset.pointRadius.push(8);

        signalDataset.pointBackgroundColor.push('green');
        signalDataset.pointStyle.push('triangle');
        signalDataset.pointRotation.push(0);
        signalDataset.pointRadius.push(8);
      }
      else if (result.states[i].Action == "Sell"){
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

        macdDataset.pointBackgroundColor.push('red');
        macdDataset.pointStyle.push('triangle');
        macdDataset.pointRotation.push(180);
        macdDataset.pointRadius.push(8);

        signalDataset.pointBackgroundColor.push('red');
        signalDataset.pointStyle.push('triangle');
        signalDataset.pointRotation.push(180);
        signalDataset.pointRadius.push(8);
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

        macdDataset.pointBackgroundColor.push('white');
        macdDataset.pointStyle.push('circle');
        macdDataset.pointRotation.push(0);
        macdDataset.pointRadius.push(0);

        signalDataset.pointBackgroundColor.push('white');
        signalDataset.pointStyle.push('circle');
        signalDataset.pointRotation.push(0);
        signalDataset.pointRadius.push(0);
      }
    }
    valueDataset.data = valueArray;
    longDataset.data = longArray;
    priceDataset.data = priceArray;
    volumeDataset.data = volumeArray;
    shareDataset.data = shareArray;
    macdDataset.data = macdArray;
    signalDataset.data = signalArray;

    priceDataset.label = 'Price';
    valueDataset.label = 'Value';
    longDataset.label = 'Long Investment';
    volumeDataset.label = 'Volume';
    shareDataset.label = 'Shares';
    macdDataset.label = 'MACD';
    signalDataset.label = 'Signal';

    priceDataset.borderColor = "#1097a2"
    valueDataset.borderColor = "#216c17"
    longDataset.borderColor = "#6ea91a"
    volumeDataset.borderColor = "#0045e7"
    shareDataset.borderColor = "#3bb01e"
    macdDataset.borderColor = "#ab1c6d"
    signalDataset.borderColor = "#918618"

    priceDataset.backgroundColor = priceDataset.borderColor;
    valueDataset.backgroundColor = valueDataset.borderColor;
    longDataset.backgroundColor = longDataset.borderColor;
    volumeDataset.backgroundColor = volumeDataset.borderColor;
    shareDataset.backgroundColor = shareDataset.borderColor;
    macdDataset.backgroundColor = macdDataset.borderColor;
    signalDataset.backgroundColor = signalDataset.borderColor;

    valueData.chartType = ChartType.value;
    tickerdata.chartType = ChartType.price;
    volumeData.chartType = ChartType.volume;
    shareData.chartType = ChartType.shares;
    macData.chartType = ChartType.macd;

    valueData.datasets.push(valueDataset);
    valueData.datasets.push(longDataset);
    tickerdata.datasets.push(priceDataset);
    volumeData.datasets.push(volumeDataset);
    shareData.datasets.push(shareDataset);
    macData.datasets.push(macdDataset);
    macData.datasets.push(signalDataset);

    this.datas.push(tickerdata)
    this.datas.push(valueData)
    this.datas.push(volumeData)
    this.datas.push(shareData)
    this.datas.push(macData)
  }
}
