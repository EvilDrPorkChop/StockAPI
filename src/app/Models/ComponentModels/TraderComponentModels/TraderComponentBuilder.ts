import {AppStore} from "../../../app.store";
import {TraderType} from "./TraderComponent.model";
import {MacdTraderComponent} from "./MacdTraderComponent.model";

export class TraderComponentBuilder{
  public store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
  }

  buildTraderModel(type?: TraderType){
    if(type == TraderType.macd){
      console.log("building model: "+TraderType[type])
      return new MacdTraderComponent(this.store);
    }
    return new MacdTraderComponent(this.store);
  }
}
