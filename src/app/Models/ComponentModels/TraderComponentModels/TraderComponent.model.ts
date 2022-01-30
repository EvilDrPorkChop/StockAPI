import {AppStore, StateData, TickerData} from "../../../app.store";
import {filter} from "rxjs";
import {InputType} from "../../Shared/input.model";
import {ChartType} from "../../ChartModels/Chart.model";
import {Interval} from "../../Shared/intervals.model";
import {Data, DataSet} from "../../Shared/chartData.model";
import {ComponentModel, ComponentType} from "../Component.model";

export enum TraderType{
  macd,
  peak,
  time,
  swing
}


export abstract class TraderComponent extends ComponentModel{
  public traderType: TraderType;

  constructor(store: AppStore, type: TraderType) {
    super(ComponentType.trader, store);
    this.traderType = type;
    console.log("Trader is " + TraderType[type]);
    this.title = "Trader (" + TraderType[type] + ")";
  }

  public subscribe() {
    this.dataSubscription = this.store.stateDataObserver.pipe(filter(r =>
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

  public loadData(ticker: string, intervalType: Interval, interval: number, fromDate: string, toDate: string, startBal: number): void{
    this.ticker = ticker;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.store.startRun(TraderType[this.traderType], ticker, intervalType.key, interval, fromDate, toDate, startBal);
  }


}
