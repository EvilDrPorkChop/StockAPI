import {AppStore, PatternData} from "../../app.store";
import {filter} from "rxjs";
import {InputType} from "../input.model";
import {ChartType} from "../chart.model";
import {Interval} from "../intervals.model";
import {Data, DataSet} from "../chartData.model";
import {ComponentModel, ComponentType} from "./Component.model";

export class PatternDataComponent extends ComponentModel{

  constructor(store: AppStore) {
    super(ComponentType.ticker, store);
    this.title = "Ticker Pattern"
  }

  public subscribe() {
    this.dataSubscription = this.store.patternDataObserver.pipe(filter(r=>
      r!=null &&
      r.ticker==this.ticker &&
      r.fromDate ==this.fromDate &&
      r.toDate==this.toDate)).subscribe(result => {
      if (result) {
        this.processData(result)
        this.updateCharts();
      }
    });
  }

  public getInputs() {
    let inputs: InputType[] = []
    inputs.push(InputType.ticker);
    inputs.push(InputType.fromDate);
    inputs.push(InputType.toDate);
    return inputs;
  }

  public getAvailableChartTypes(): ChartType[]{
    let types: ChartType[] = []
    types.push(ChartType.pattern);
    types.push(ChartType.price);
    return types;
  }

  public loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string): void{
    this.ticker = ticker;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.getPatternData(ticker, fromDate, toDate);
  }

  public processData(result: PatternData){
    let patternData = new Data();
    let minmaxData = new Data();
    let hourlyArray = [];
    let dailyArray = [];
    let minMaxArray = [];
    let hourlyDataset = new DataSet();
    let dailyDataset = new DataSet();
    let minMaxDataset = new DataSet();


    for(let i = 0; i <  result.hourPattern.length; i++){
      hourlyArray.push({
        x: result.hours[i],
        y: result.hourPattern[i],
        Time: i
      });
      hourlyDataset.pointRadius.push(3);
      hourlyDataset.pointBackgroundColor.push('#106aa2');
    }
    hourlyArray.sort((a, b) => (a.x > b.x) ? 1 : -1)

    for(let i = 0; i <  result.dayPattern.length; i++){
      dailyArray.push({
        x: result.hours[i],
        y: result.dayPattern[i],
        Time: i
      });
      dailyDataset.pointRadius.push(3);
      dailyDataset.pointBackgroundColor.push('#1023a2');
    }
    dailyArray.sort((a, b) => (a.x > b.x) ? 1 : -1)

    for(let i = 0; i <  result.minmaxs.length; i++){
      minMaxArray.push({
        x: result.dates[i],
        y: result.minmaxs[i],
        Time: i
      });
      minMaxDataset.pointRadius.push(3);
      minMaxDataset.pointBackgroundColor.push('#1023a2');
    }

    console.log(hourlyArray);

    hourlyDataset.data = hourlyArray;
    hourlyDataset.label = 'Hourly';
    hourlyDataset.borderColor = "#1097a2"
    hourlyDataset.backgroundColor = "#1097a2"

    dailyDataset.data = dailyArray;
    dailyDataset.label = 'Daily';
    dailyDataset.borderColor = "#104fa2"
    dailyDataset.backgroundColor = "#104fa2"

    minMaxDataset.data = minMaxArray;
    minMaxDataset.label = 'Max %Diff from open';
    minMaxDataset.borderColor = "#104fa2"
    minMaxDataset.backgroundColor = "#104fa2"

    patternData.datasets.push(hourlyDataset);
    patternData.datasets.push(dailyDataset);
    minmaxData.datasets.push(minMaxDataset);

    patternData.chartType = ChartType.pattern;
    minmaxData.chartType = ChartType.price;

    this.datas.push(patternData);
    this.datas.push(minmaxData)
  }
}
