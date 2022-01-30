function intervalTypes() {
  let intervals = [
    new Interval("minute", "Minute"),
    new Interval("hour", "Hour"),
    new Interval("day", "Day")
  ]
  return intervals;
}


export class Interval {
  key: string = "";
  name: string = "";

  constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
  }

  static getIntervals(){
    return intervalTypes();
  }
}
