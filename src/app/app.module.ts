import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppStore} from "./app.store";
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {A11yModule} from "@angular/cdk/a11y";
import { TickerDataComponent } from './ticker-data/ticker-data.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { TraderDataComponent } from './trader-data/trader-data.component';

@NgModule({
  declarations: [
    AppComponent,
    TickerDataComponent,
    TraderDataComponent,
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
        MatExpansionModule
    ],
  providers: [AppStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
