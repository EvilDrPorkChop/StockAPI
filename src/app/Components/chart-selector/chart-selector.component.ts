import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChartSelectorData, ChartType} from "../../Models/chart.model";
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
    this.dialogRef.close();
  }

}
