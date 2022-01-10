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
}

export interface DataItem {
  x: any;
  y: any;
}
