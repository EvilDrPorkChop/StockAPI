import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChartType} from "../../Models/ChartModels/Chart.model";
import {ComponentType} from "../../Models/ComponentModels/Component.model";

@Component({
  selector: 'app-chart-selector',
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.scss']
})
export class ChartSelectorComponent {

  public chartTypes = ChartType;

  constructor(public dialogRef: MatDialogRef<ChartSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChartSelectorData) {
  }

  onNoClick(): void {
    this.data.isCancelled = true;
    this.dialogRef.close();
  }

}

export interface ChartSelectorData {
  chartType: ChartType;
  availableChartTypes: ChartType[];
  isCancelled: boolean;
}
