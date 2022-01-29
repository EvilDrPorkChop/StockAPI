import {Component, Inject, OnInit} from '@angular/core';
import {ChartSelectorData, ChartType} from "../../Models/chart.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ComponentSelectorData, ComponentType} from "../../Models/ComponentModels/Component.model";

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {

  public componentTypes = ComponentType;

  constructor(public dialogRef: MatDialogRef<ComponentSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ComponentSelectorData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
