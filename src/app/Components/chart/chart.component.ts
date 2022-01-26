import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChartModel, ChartType} from "./chart.model";
import {AppStore} from "../../app.store";
import {Data} from "../../Models/chartData.model";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() chartType: ChartType = ChartType.price;
  @Input() data: Data;
  @Output() deleteEvent = new EventEmitter<ChartComponent>();
  public chartModel: ChartModel;
  public currentScale: string = "minute";

  public width: number = 323;
  public height: number = 300;
  public left: number = 100;
  public top: number = 100;
  @ViewChild("box") public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: number = 0;
  private mouseClick: {x: number, y: number, left: number, top: number}

  constructor() {

  }

  ngOnInit(): void {
    this.chartModel = new ChartModel(this.chartType)
  }

  ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
  }

  public deleteMyself(){
    this.deleteEvent.emit(this);
  }

  private loadBox(){
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
  }

  private loadContainer(){
    const left = this.boxPosition.left - this.left;
    const top = this.boxPosition.top - this.top;
    const right = left + 323;
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
    this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    if(this.width < 323){
      this.width = 323;
    }
    if(this.height < 300){
      this.height = 300;
    }
  }

}
