import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AmexioWidgetModule } from 'amexio-ng-extensions';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {CanvasTreeDataTableComponent} from "./local-component/treedatagrid/local.treedatatable.component";
import {CanvasTreeColumnComponent} from "./local-component/treedatagrid/local-tree.column";

@NgModule({
  declarations: [
    AppComponent, CanvasTreeDataTableComponent, CanvasTreeColumnComponent,
   /* AmexioDatagridComponent, AmexioGridColumnComponent*/
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AmexioWidgetModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
