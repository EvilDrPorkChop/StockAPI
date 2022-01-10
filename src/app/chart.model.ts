export class Data {
  constructor() {
    this.labels = new Array<string>();
    this.datasets = new Array<DataSet>();
    this.type = 'line';
  }

  labels: Array<string>;
  datasets: Array<DataSet>;
  type: string;
}

export class DataSet {
  label: string = "";
  data: Array<number| DataItem> = new Array<number | DataItem>();
  borderColor = "#be4a1c"
  backgroundColor = "#be4a1c"
  pointBackgroundColor: Array<string> = new Array<string>();
  pointRadius: Array<number> = new Array<number>();
  pointStyle: Array<string> = new Array<string>();
  pointRotation: Array<number> = new Array<number>();
}

export interface DataItem {
  x: any;
  y: any;

}

export class ChartOptions{
  constructor() {
    this.responsive = true;
    this.scales = new ChartScales();
  }

  responsive: boolean;
  scales: ChartScales;
}

export class ChartScales {
  constructor() {
    this.xAxes = new Array<ChartAxis>();
    this.yAxes = new Array<ChartAxis>();
    this.type = ""
    this.position = ""
  }
  type: string;
  position: string;
  xAxes: Array<ChartAxis>;
  yAxes: Array<ChartAxis>;
}

export class ChartAxis {
  constructor() {
    this.type = "";
    this.position = "";
  }
  type:string;
  position: string;
  time: any;
}

