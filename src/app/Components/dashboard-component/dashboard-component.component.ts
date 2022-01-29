import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AppStore} from "../../app.store";
import {ComponentModel, ComponentType} from "../../Models/ComponentModels/Component.model";
import {FormControl} from "@angular/forms";
import * as moment from "moment";
import {Interval} from "../../Models/intervals.model";
import {InputType} from "../../Models/input.model";
import {ChartType} from "../../Models/chart.model";
import {ChartSelectorComponent} from "../chart-selector/chart-selector.component";
import {MatDialog} from "@angular/material/dialog";
import {ChartComponent} from "../chart/chart.component";
import {ComponentBuilder} from "../../Models/ComponentModels/ComponentBuilder";
import {TraderType} from "../../Models/ComponentModels/TraderComponentModels/TraderComponent.model";

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.component.html',
  styleUrls: ['./dashboard-component.component.scss']
})

export class DashboardComponentComponent implements OnInit {

  //Stuff For Resizing ----------------------------------------------------------------------
  public minWidth = 800;
  public minHeight = 110;
  public width: number = this.minWidth;
  public height: number = this.minHeight;
  public left: number = 100;
  public top: number = 100;
  @ViewChild("box") public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: number = 0;
  private mouseClick: {x: number, y: number, left: number, top: number}
  public visible = true;
  //-----------------------------------------------------------------------------------------


  //Actual Component stuff ------------------------------------------------------------------
  @Input() componentType: ComponentType;
  @Input() traderType: TraderType;
  @Output() deleteEvent = new EventEmitter<DashboardComponentComponent>();
  public chosenTicker: string = "aapl";
  public intervalTypes: Interval[] = Interval.getIntervals();
  public chosenIntervalType: Interval = this.intervalTypes[1];
  public chosenInterval: number = 1;
  public currentScale: string = "minute";
  public fromDate: FormControl = new FormControl(moment().subtract(5, 'days').toDate());
  public toDate: FormControl = new FormControl(moment().toDate());
  public chosenStartBal: number = 1000;
  public componentModel: ComponentModel;
  public inputs: InputType[];
  public store: AppStore;
  public allInputs = InputType;
  //-----------------------------------------------------------------------------------------

  @ViewChild("container", { read: ViewContainerRef }) container: ViewContainerRef;
  public componentRef: ComponentRef<ChartComponent>;
  public components: ChartComponent[] = []


  constructor(store: AppStore, public dialog: MatDialog, private resolver: ComponentFactoryResolver) {
    let compBuilder = new ComponentBuilder(store);
    this.componentModel = compBuilder.buildComponentModel(this.componentType, this.traderType);
    this.inputs = this.componentModel.getInputs();
    this.store = store
  }

  public addComponent(chartType: ChartType){
    const factory: ComponentFactory<ChartComponent> = this.resolver.resolveComponentFactory(ChartComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.chartType = chartType;
    this.componentRef.instance.data = this.componentModel.getData(0);
    this.components.push(this.componentRef.instance)
    this.componentModel.charts = this.components;
    this.componentRef.instance.deleteEvent.subscribe((result: ChartComponent) => this.deleteHandler(result))
    this.componentModel.updateCharts();
  }

  public deleteHandler(component: ChartComponent){
    const componentIndex = this.components.indexOf(component);
    let index = 0
    if(componentIndex !== -1){
      this.container.remove(componentIndex);
      this.components.splice(componentIndex, 1);
      this.componentModel.charts = this.components;
    }
  }

  ngOnInit() {
    let compBuilder = new ComponentBuilder(this.store);
    this.componentModel = compBuilder.buildComponentModel(this.componentType, this.traderType);
    this.inputs = this.componentModel.getInputs();
  }

  ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
    this.componentModel.subscribe();
  }

  public getData(){
    let fromDate = (moment(this.fromDate.value)).format('YYYY-MM-DD')
    let toDate = (moment(this.toDate.value)).format('YYYY-MM-DD')
    if(this.componentModel){
      this.componentModel.loadData(this.chosenTicker, this.chosenIntervalType, this.chosenInterval, fromDate, toDate, this.chosenStartBal);
    }
  }

  public get inputWidth(){
    return this.width/(this.inputs.length + 1);
  }

  public toggleVisibility(override = null){
    if(override){
      this.visible = override;
    }
    else{
      this.visible = !this.visible;
    }
    if(!this.visible){
      this.height = 50;
      for(let chart of this.components){
        chart.toggleVisibility(false);
      }
    }
    else{
      this.height = this.minHeight;
      for(let chart of this.components){
        chart.toggleVisibility(true);
      }
    }
  }


  openSelector(): void {
    const dialogRef = this.dialog.open(ChartSelectorComponent, {
      width: '250px',
      data: {chartType: this.componentModel.getAvailableChartTypes()[0], availableChartTypes: this.componentModel.getAvailableChartTypes()},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addComponent(result);
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  public deleteMyself(){
    this.deleteEvent.emit(this);
  }







  //Stuff For Resizing ------------------------------------------------------------------------------------------------
  private loadBox(){
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
  }

  private loadContainer(){
    const left = this.boxPosition.left - this.left;
    const top = this.boxPosition.top - this.top;
    const right = left + 600;
    const bottom = top + 450;
    this.containerPos = { left, top, right, bottom };
  }

  setStatus(event: MouseEvent, status: number){
    if(status === 1) event.stopPropagation();
    else this.loadBox();
    this.status = status;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    this.mouse = { x: event.clientX, y: event.clientY };

    if(this.status == 1) this.resize();
  }

  private resize(){
      this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      if(this.width < this.minWidth){
        this.width = this.minWidth;
      }
  }
  //-------------------------------------------------------------------------------------------------------------------
}
