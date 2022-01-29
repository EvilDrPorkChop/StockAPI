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
import {Observable, Subscription} from "rxjs";

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
  public lastValidWidth: number = this.width;
  public lastValidHeight: number = this.height;
  public left: number = 100;
  public top: number = 100;
  public lastValidTop: number = this.top;
  public lastValidLeft: number = this.left;

  @ViewChild("box") public box: ElementRef;
  @Input() outerContainer: ElementRef;
  @Input() outerContainerHeight: number;
  @Input() outerContainerWidth: number;

  @Input() outerContainerEvent: Observable<number[]>;
  outerContainerEventSubscription: Subscription;

  private boxPosition: { left: number, top: number};
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public resizing: boolean = false;
  public moving: boolean = false;
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
    //Update our version of our parents width and height when the parent emits that it has changed
    this.outerContainerEventSubscription = this.outerContainerEvent.subscribe(data => {
      this.outerContainerHeight = data[0];
      this.outerContainerWidth = data[1];
    })
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
    const{left, top} = this.outerContainer.nativeElement.getBoundingClientRect();
    const right = left + this.outerContainerWidth;
    const bottom = top + this.outerContainerHeight;
    this.containerPos = { left, top, right, bottom };
  }

  toggleStatus(){
    this.resizing = !this.resizing;
  }

  setResizeStatus(event: MouseEvent, status: boolean){
    if(status) event.stopPropagation();
    else {
      this.loadBox();
    }
    this.loadContainer();
    this.resizing = status;
  }

  setMoveStatus(event: MouseEvent, status: boolean){
    if(status) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
    else {
      this.loadBox();
    }
    this.loadContainer();
    this.moving = status;
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
    else if(this.moving) this.move();
  }

  private move(){
    console.log("moving")
    this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
    this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
    if(!this.moveCondMeet()){
      let {left, top} = this.findClosestValidPosForMove();
      this.left = left;
      this.top = top;
    }
  }

  private resize(){
    this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
    this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    if (this.width < this.minWidth) {
      this.width = this.minWidth;
    }
    if (this.height < this.minHeight) {
      this.height = this.minHeight;
    }
    if(!this.resizeCondMeet()) {
      let {width, height} = this.findClosestValidPosForResize();
      this.width = width;
      this.height = height;
    }
  }

  private resizeCondMeet(){
    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom-100);
  }

  public findClosestValidPosForResize(){
    let width = this.width;
    let height = this.height;
    if(this.mouse.x > this.containerPos.right){
      width = Number(this.containerPos.right > this.boxPosition.left) ? this.containerPos.right - this.boxPosition.left : 0;
    }
    if(this.mouse.y > this.containerPos.bottom-100){
      height = Number(this.containerPos.bottom-100 > this.boxPosition.top) ? this.containerPos.bottom-100 - this.boxPosition.top : 0;
    }
    return {width, height}
  }

  private findClosestValidPosForMove(){
    let top = this.top;
    let left = this.left;
    const offsetLeft = this.mouseClick.x - this.boxPosition.left;
    const offsetRight = this.width - offsetLeft;
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.height - offsetTop;

    if(this.mouse.x < this.containerPos.left + offsetLeft){
      left = this.mouseClick.left + (this.containerPos.left + offsetLeft - this.mouseClick.x);
    }
    if(this.mouse.x > this.containerPos.right - offsetRight){
      left = this.mouseClick.left + (this.containerPos.right - offsetRight - this.mouseClick.x);
    }
    if(this.mouse.y < this.containerPos.top + offsetTop){
      top = this.mouseClick.top + (this.containerPos.top + offsetTop - this.mouseClick.y);
    }
    if(this.mouse.y > this.containerPos.bottom - offsetBottom - 100){
      top = this.mouseClick.top + (this.containerPos.bottom - offsetBottom - 100 - this.mouseClick.y);
    }

    return {left, top}
  }

  private moveCondMeet(){
    const offsetLeft = this.mouseClick.x - this.boxPosition.left;
    const offsetRight = this.width - offsetLeft;
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.height - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft &&
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom - 100
    );
  }

}
