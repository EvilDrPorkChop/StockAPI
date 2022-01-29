import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ComponentType} from "../../Models/ComponentModels/Component.model";
import {TraderType} from "../../Models/ComponentModels/TraderComponentModels/TraderComponent.model";

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {

  public componentTypes = ComponentType;
  public traderTypes = TraderType;

  constructor(public dialogRef: MatDialogRef<ComponentSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ComponentSelectorData) {
  }

  onNoClick(): void {
    this.data.isCancelled = true;
    this.dialogRef.close();
  }

}

export interface ComponentSelectorData {
  componentType: ComponentType;
  traderType: TraderType;
  allComponentTypes: ComponentType[];
  allTraderTypes: TraderType[];
  isCancelled: boolean
}
