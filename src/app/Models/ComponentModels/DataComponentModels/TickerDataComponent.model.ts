import {AppStore, TickerData} from "../../../app.store";
import {filter} from "rxjs";
import {InputType} from "../../input.model";
import {ChartType} from "../../chart.model";
import {Interval} from "../../intervals.model";
import {Data, DataSet} from "../../chartData.model";
import {ComponentModel, ComponentType} from "../Component.model";

export class TickerDataComponent extends ComponentModel{

  constructor(store: AppStore) {
    super(ComponentType.ticker, store);
    this.title = "Ticker Data"
  }

  public subscribe() {
    this.dataSubscription = this.store.tickerDataObserver.pipe(filter(r =>
      r != null &&
      r.ticker == this.ticker &&
      r.fromDate == this.fromDate &&
      r.toDate == this.toDate)).subscribe(result => {
      if (result) {
        this.processData(result)
        this.updateCharts();
      }
    });
  }

  public getInputs() {
    let inputs: InputType[] = []
    inputs.push(InputType.ticker);
    inputs.push(InputType.interval);
    inputs.push(InputType.intervalType);
    inputs.push(InputType.fromDate);
    inputs.push(InputType.toDate);
    return inputs;
  }
  public getAvailableChartTypes(): ChartType[]{
    let types: ChartType[] = []
    types.push(ChartType.price);
    types.push(ChartType.volume);
    return types;
  }

  public loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string): void{
    this.ticker = ticker;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.getTickerData(ticker, intervalType.key, interval, fromDate, toDate);
  }

  public processData(result: TickerData){
    let priceData = new Data();
    let volumeData = new Data();
    let openArray = [];
    let volumeArray = [];
    let openDataset = new DataSet();
    let volumeDataset = new DataSet();

    for(let i = 0; i <  result.opens.length; i++){
      openArray.push({
        x: result.dates[i],
        y: result.opens[i],
        ticker: result.ticker
      });
      openDataset.pointRadius.push(3);
      openDataset.pointBackgroundColor.push('#106aa2');
    }

    for(let i = 0; i <  result.volumes.length; i++){
      volumeArray.push({
        x: result.dates[i],
        y: result.volumes[i],
        ticker: result.ticker
      });
      volumeDataset.pointRadius.push(3);
      volumeDataset.pointBackgroundColor.push('#1023a2');
    }

    openDataset.data = openArray;
    openDataset.label = 'Open';
    openDataset.borderColor = "#1097a2"
    openDataset.backgroundColor = "#1097a2"

    volumeDataset.data = volumeArray;
    volumeDataset.label = 'Volume';
    volumeDataset.borderColor = "#104fa2"
    volumeDataset.backgroundColor = "#104fa2"

    priceData.datasets.push(openDataset);
    volumeData.datasets.push(volumeDataset);
    priceData.chartType = ChartType.price;
    volumeData.chartType = ChartType.volume;

    this.datas = []
    this.datas.push(priceData);
    this.datas.push(volumeData)
  }
}
