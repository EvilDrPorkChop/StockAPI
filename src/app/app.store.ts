
import {BehaviorSubject, Subject, Timestamp} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {tick} from "@angular/core/testing";
import {Tick} from "chart.js";

@Injectable()
export class AppStore {
  public tickerDataObserver: BehaviorSubject<TickerData> = new BehaviorSubject<TickerData>(new TickerData());
  public stateDataObserver: BehaviorSubject<StateData> = new BehaviorSubject<StateData>(new StateData());
  public patternDataObserver: BehaviorSubject<PatternData> = new BehaviorSubject<PatternData>(new PatternData());


  public getTickerData(ticker:string, intervalType:string, interval:number, fromDate: string, toDate: string){
    let url = "http://localhost:701/ticker?ticker="+ticker+"&interval="+interval+"&intervalType="
      +intervalType+"&fromDate="+fromDate+"&toDate="+toDate;

    this.http.get<any>(url).subscribe((data) => {
      console.log(data);
      let response = new TickerData();
      response.opens = data.opens;
      response.dates = data.dates;
      response.volumes = data.volumes;
      response.ticker = ticker;
      response.fromDate = fromDate;
      response.toDate = toDate;
      this.tickerDataObserver.next(response)
    })
  }

  public startRun(trader: string, ticker:string, intervalType:string, interval:number, fromDate: string, toDate: string, startBalance: number){
    let url = "http://localhost:701/startRun?&ticker="+ticker+"&interval="+interval+"&intervalType="
      +intervalType+"&fromDate="+fromDate+"&toDate="+toDate+"&startBalance="+startBalance+"&trader="+trader;

    this.http.get<any>(url).subscribe((data) => {
      data.fromDate = fromDate;
      data.toDate = toDate;
      data.ticker = ticker;
      this.stateDataObserver.next(data);
    })
  }

  public getPatternData(ticker:string, fromDate: string, toDate: string){
    let url = "http://localhost:701/checkForDailyPatterns?ticker="+ticker+"&fromDate="+fromDate+"&toDate="+toDate+"&startBalance=";
    this.http.get<any>(url).subscribe((data) => {
      data.fromDate = fromDate;
      data.toDate = toDate;
      data.ticker = ticker;
      this.patternDataObserver.next(data);
    })
  }

  constructor(private http: HttpClient) {
  }

}

export class TickerData{
  public opens: number[] = [];
  public highs: string[] = [];
  public volumes: number[] = [];
  public dates: any[] = [];
  public ticker: string = "";
  public fromDate: string= "";
  public toDate: string= "";
}

export class StateData{
  public states: State[] = [];
  public longs: State[] = [];
  public opens: number[] = [];
  public dates: any[] = [];
  public macd: number[] = [];
  public signals: number[] = [];
  public ticker: string = "";
  public fromDate: string= "";
  public toDate: string= "";
}

export class State{
  public Action: string = "";
  public Date: any;
  public Price: number = 0;
  public Shares: number = 0;
  public Balance: number = 0;
  public Value: number = 0;
  public Volume: number = 0;
}

export class PatternData{
  public hourPattern: number[] = []
  public dayPattern: number[] = []
  public hours: number[] = []
  public minmaxs: number[] = []
  public dates: any[] = []
  public average: number = 0
  public ticker:string = "";
  public fromDate: string= "";
  public toDate: string = "";
}
