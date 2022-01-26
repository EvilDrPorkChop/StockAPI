import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Chart, ChartData, Color, ChartOptions, LinearScale, Title, ScaleOptions, Scale, ScaleChartOptions} from "chart.js";
import {AppStore, StateData, TickerData} from "./app.store";
import {filter, Subscription} from "rxjs";
import 'chartjs-adapter-moment';
import {ComponentType} from "./Models/dashboardComponent.model";
import {DashboardComponentComponent} from "./Components/dashboard-component/dashboard-component.component";
import {ChartSelectorComponent} from "./Components/chart-selector/chart-selector.component";
import {MatDialog} from "@angular/material/dialog";
import {ComponentSelectorComponent} from "./Components/component-selector/component-selector.component";
Chart.register(LinearScale, Title);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  public addComponent(componentType: ComponentType){
    const factory: ComponentFactory<DashboardComponentComponent> = this.resolver.resolveComponentFactory(DashboardComponentComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.componentType = componentType;
    this.components.push(this.componentRef.instance)
    this.componentRef.instance.deleteEvent.subscribe((result: DashboardComponentComponent) => this.deleteHandler(result))
  }

  public deleteHandler(component: DashboardComponentComponent){
    const componentIndex = this.components.indexOf(component);
    let index = 0
    if(componentIndex !== -1){
      this.container.remove(componentIndex);
      this.components.splice(componentIndex, 1);
    }

  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }

  public openSelector(){
    const dialogRef = this.dialog.open(ComponentSelectorComponent, {
      width: '250px',
      data: {allComponentTypes: this.getComponentTypes(), componentType: ComponentType.ticker},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addComponent(result);
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  public getComponentTypes(){
    let types : ComponentType[] = []
    types.push(ComponentType.ticker);
    types.push(ComponentType.pattern);
    types.push(ComponentType.trader);
    return types;
  }
}
