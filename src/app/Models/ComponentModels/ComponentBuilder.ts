import {AppStore} from "../../app.store";
import {ComponentModel, ComponentType} from "./Component.model";
import {TickerDataComponent} from "./TickerDataComponent.model";
import {PatternDataComponent} from "./PatternDataComponent.model";

export class ComponentBuilder{
  public store: AppStore;
  constructor(store: AppStore) {
    this.store = store;
  }

  buildComponentModel(type: ComponentType): ComponentModel{
    if(type == ComponentType.ticker){
      return new TickerDataComponent(this.store);
    }
    if(type == ComponentType.pattern){
      return new PatternDataComponent(this.store);
    }
    return new TickerDataComponent(this.store);
  }
}
