import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ChartModel, ChartType} from "../../Models/ChartModels/Chart.model";
import {Data} from "../../Models/Shared/chartData.model";
import {ChartBuilder} from "../../Models/ChartModels/ChartBuilder";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {

  @Input() chartType: ChartType = ChartType.price;
  @Input() data: Data;
  @Output() deleteEvent = new EventEmitter<ChartComponent>();
  public chartModel: ChartModel;
  public currentScale: string = "day";
  public minWidth = 323;
  public minHeight = 300;
  public previousHeight = this.minHeight;
  public width: number = this.minWidth;
  public height: number = this.minHeight;
  public left: number = 100;
  public top: number = 100;
  @ViewChild("box") public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public resizing: boolean = false;
  private mouseClick: {x: number, y: number, left: number, top: number}
  public visible = true;
  public showPoints = false;
  public chartWidth = 100;
  public chartHeight = 80;
  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    let chartBuilder = new ChartBuilder()
    this.chartModel = chartBuilder.buildChartModel(this.chartType);
    if(!this.chartModel.showScale()){
      this.chartHeight = 100;
    }
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

  toggleStatus(){
    this.resizing = !this.resizing;
  }

  setStatus(event: MouseEvent, status: boolean){
    if(status) event.stopPropagation();
    else this.loadBox();
    this.resizing = status;
  }

  updateData(data: Data){
    this.data = data;
    this.changeDataPointVisibility(this.showPoints);
    this.changeDetector.detectChanges();
  }

  public toggleVisibility(override: boolean | null = null){
    if(override){
      this.visible = override;
    }
    else{
      this.visible = !this.visible;
    }
    if(!this.visible){
      this.previousHeight = this.height;
      this.height = 50;
    }
    else{
      this.height = this.previousHeight;
    }
  }

  public togglePoints(){
    this.showPoints= !this.showPoints;
    this.changeDataPointVisibility(this.showPoints)
  }

  public onZoom(ev: WheelEvent){
    if(ev.deltaY>0){
      this.chartWidth = this.chartWidth - 10;
    }
    else {
      this.chartWidth = this.chartWidth + 10;
    }
    if(this.chartWidth > 1000){
      this.chartWidth = 1000;
    }
    if(this.chartWidth < 100){
      this.chartWidth = 100;
    }
    this.changeDetector.detectChanges();
  }

  public changeDataPointVisibility(show: boolean){
    for(let dataset of this.data.datasets){
      let pointNum = dataset.pointRadius.length;
      dataset.pointRadius = new Array<number>();
      for(let i = 0; i<pointNum; i++){
        if(show){
          dataset.pointRadius.push(3);
        }
        else{
          dataset.pointRadius.push(0);
        }
      }
    }
  }


  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    this.mouse = { x: event.clientX, y: event.clientY };
    if(this.resizing) this.resize();
  }

  private resize(){
    this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
    this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    if(this.width < this.minWidth){
      this.width = this.minWidth;
    }
    if(this.height < this.minHeight){
      this.height = this.minHeight;
    }
  }

}
