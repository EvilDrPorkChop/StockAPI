import {AppStore} from "../../app.store";
import {ComponentModel, ComponentType} from "./Component.model";
import {TickerDataComponent} from "./DataComponentModels/TickerDataComponent.model";
import {PatternDataComponent} from "./DataComponentModels/PatternDataComponent.model";
import {TraderComponent, TraderType} from "./TraderComponentModels/TraderComponent.model";
import {TraderComponentBuilder} from "./TraderComponentModels/TraderComponentBuilder";

export class ComponentBuilder{
  public store: AppStore;
  constructor(store: AppStore) {
    this.store = store;
  }

  buildComponentModel(type: ComponentType, traderType? : TraderType): ComponentModel{
    if(type == ComponentType.ticker){
      return new TickerDataComponent(this.store);
    }
    if(type == ComponentType.pattern){
      return new PatternDataComponent(this.store);
    }
    if(type == ComponentType.trader){
      console.log("Building trader component...")
      let traderBuilder = new TraderComponentBuilder(this.store);
      return traderBuilder.buildTraderModel(traderType);
    }
    return new TickerDataComponent(this.store);
  }
}
