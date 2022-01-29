import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppStore} from "./app.store";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {A11yModule} from "@angular/cdk/a11y";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { ChartComponent } from './Components/chart/chart.component';
import { DashboardComponentComponent } from './Components/dashboard-component/dashboard-component.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ChartSelectorComponent } from './Components/chart-selector/chart-selector.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ComponentSelectorComponent } from './Components/component-selector/component-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    DashboardComponentComponent,
    ChartSelectorComponent,
    ComponentSelectorComponent,
  ],
  imports: [
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgChartsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonToggleModule,
    A11yModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatNativeDateModule,
    MatRippleModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule
  ],
  providers: [AppStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
