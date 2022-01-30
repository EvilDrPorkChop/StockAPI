import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef, ElementRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Chart, LinearScale, Title} from "chart.js";
import 'chartjs-adapter-moment';
import {ComponentType} from "./Models/ComponentModels/Component.model";
import {DashboardComponentComponent} from "./Components/dashboard-component/dashboard-component.component";
import {MatDialog} from "@angular/material/dialog";
import {
  ComponentSelectorComponent,
  ComponentSelectorData
} from "./Components/component-selector/component-selector.component";
import {TraderType} from "./Models/ComponentModels/TraderComponentModels/TraderComponent.model";

Chart.register(LinearScale, Title);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;

  public componentTypes = ComponentType;
  public keys: any;
  public componentRef: ComponentRef<DashboardComponentComponent>;
  public components: DashboardComponentComponent[] = []

  constructor(private resolver: ComponentFactoryResolver, public dialog: MatDialog) {
    this.keys = Object.keys(this.componentTypes).filter(f => !isNaN(Number(f)));
  }

  public addComponent(selectorData: ComponentSelectorData){
    this.componentRef = this.container.createComponent(DashboardComponentComponent);
    this.componentRef.instance.componentType = selectorData.componentType;
    this.componentRef.instance.traderType = selectorData.traderType;
    this.components.push(this.componentRef.instance)
    this.componentRef.instance.bringToFrontEvent.subscribe(comp => {
      this.bringComponentToFront(comp);
    })
    console.log("Adding component type: "+ComponentType[selectorData.componentType]+" and trader type: "+ TraderType[selectorData.traderType])
    this.componentRef.instance.deleteEvent.subscribe((result: DashboardComponentComponent) => this.deleteHandler(result))
  }

  public deleteHandler(component: DashboardComponentComponent){
    const componentIndex = this.components.indexOf(component);
    if(componentIndex !== -1){
      this.container.remove(componentIndex);
      this.components.splice(componentIndex, 1);
    }
  }

  public unhighlightComponents(){
    for(let component of this.components){
      component.setHighlight(false);
    }
  }

  public bringComponentToFront(component: DashboardComponentComponent){
    const componentIndex = this.components.indexOf(component);
    if(!component.isHighlighted){
      this.unhighlightComponents();
      component.setHighlight(true);
    }
    if(componentIndex !== -1 && componentIndex < this.components.length-1){
      let viewRef = this.container.detach(componentIndex);
      this.components.splice(componentIndex, 1);
      if(viewRef){
        this.container.insert(viewRef);
        this.components.push(component);
      }
    }
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }

  ngAfterViewInit() {
  }

  public openSelector(){
    const dialogRef = this.dialog.open(ComponentSelectorComponent, {
      width: '250px',
      data: {allComponentTypes: this.getComponentTypes(), componentType: ComponentType.ticker, allTraderTypes: this.getTraderTypes(), traderType: TraderType.macd, isCancelled: false},
    });

    dialogRef.afterClosed().subscribe(result => {
      let data : ComponentSelectorData = result;
      if(!data.isCancelled){
        this.addComponent(data);
      }
      console.log('The dialog was closed');
      console.log(data);
    });
  }

  public getComponentTypes(){
    let types : ComponentType[] = []
    types.push(ComponentType.ticker);
    types.push(ComponentType.pattern);
    types.push(ComponentType.trader);
    return types;
  }

  public getTraderTypes(){
    let types : TraderType[] = []
    types.push(TraderType.macd);
    types.push(TraderType.peak);
    types.push(TraderType.swing);
    types.push(TraderType.time);
    return types;
  }
}
