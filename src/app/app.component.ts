import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Chart, LinearScale, Title} from "chart.js";
import 'chartjs-adapter-moment';
import {ComponentType} from "./Models/ComponentModels/Component.model";
import {DashboardComponentComponent} from "./Components/dashboard-component/dashboard-component.component";
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
    this.componentRef = this.container.createComponent(DashboardComponentComponent);
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
  
  ngAfterViewInit() {
    this.addComponent(ComponentType.ticker);
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
