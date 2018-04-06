/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author - Ketan Gote, Pratik Kelwalkar, Dattaram Gawas
 *
 */

import {
  OnInit,
  Input,
  Component,
  EventEmitter,
  Output,
  QueryList,
  ContentChildren,
  AfterContentInit,
  DoCheck
} from '@angular/core';
import {CanvasTreeColumnComponent} from "./local-tree.column";

@Component({
  selector: 'canvas-tree-data-table',
  template: `
    <div class="datatable">
      <div class="datatable-header">
        <ng-container *ngFor="let cols of columns;let i = index">
          <ng-container *ngIf="cols.datatype=='string'">
            <div class="datatable-col" [style.width.%]="cols.width" [ngClass]="{'header' : i == 0}">
              <ng-container *ngIf="cols.headerTemplate">
                <ng-template  [ngTemplateOutlet]="cols.headerTemplate"
                              [ngTemplateOutletContext]="{column:cols ,index: i}"></ng-template>
              </ng-container>  
              <ng-container *ngIf="!cols.headerTemplate">
                {{cols.text}}
              </ng-container>
    
            </div>
          </ng-container>
        </ng-container>
      </div>
    </div>
    <div class="datatable">
      <ng-container *ngFor="let row of viewRows;let i=index">
       <div class="datatable-row"   (click)="setSelectedRow(row, $event)">
          <ng-container *ngFor="let cols of columns;let colIndex = index">
            <ng-container *ngIf="cols.datatype=='string'">
              <div class="datatable-col" [style.width.%]="cols.width" [attr.data-label]="cols.text">
                <ng-container *ngIf="colIndex == 0">
              <span [ngStyle]="{'padding-left':(20*row.level)+'px'}">
                <ng-container *ngIf="!row.expanded && row.children">
                  <amexio-data-icon key="tree_collapse" (click)="toogle(row,i)"></amexio-data-icon>
                </ng-container>
                <ng-container *ngIf="row.expanded && row.children">
                  <amexio-data-icon key="tree_expand" (click)="toogle(row,i)"></amexio-data-icon>
                </ng-container>
                  <ng-container *ngIf="cols.bodyTemplate">
                <ng-template  [ngTemplateOutlet]="cols.bodyTemplate"
                              [ngTemplateOutletContext]="{ $implicit: { text : row[cols.dataindex] }, row: row , index: i}"></ng-template>
                </ng-container>
                 <ng-container *ngIf="row[cols.dataindex]!= null && row[cols.dataindex]!= '' && !cols.bodyTemplate ;else elseBlock">
                   <ng-container *ngIf="row[cols.editable]">
                     <input type="text" [attr.value]="row[cols.dataindex]"/>
                   </ng-container>
                   <ng-container *ngIf="!row[cols.editable]">
                                           <!--<input type="text" [attr.value]="row[cols.dataindex]"/>-->{{row[cols.dataindex]}}
                   </ng-container>
                    </ng-container>
                    <ng-template #elseBlock>
                      &nbsp;
                    </ng-template>
               </span>
                </ng-container>

                <ng-container *ngIf="colIndex > 0">
                  <ng-container *ngIf="cols.bodyTemplate">
                    <ng-template  [ngTemplateOutlet]="cols.bodyTemplate"
                                  [ngTemplateOutletContext]="{ $implicit: { text : row[cols.dataindex] }, row: row, index: i }"></ng-template>
                  </ng-container>
                  <ng-container *ngIf="row[cols.dataindex]!= null && row[cols.dataindex]!= '' && !cols.bodyTemplate ;else elseBlock">
                   {{row[cols.dataindex]}}
                  </ng-container>
                </ng-container>
              </div>
            </ng-container>
          </ng-container>


        </div>
      </ng-container>
      
       
    </div>
    

  `
})
export class CanvasTreeDataTableComponent
  implements OnInit, AfterContentInit, DoCheck {
  @Input() data: any;

  @Input('data-reader') datareader: string;

  @Input('http-method') httpmethod: string;

  @Input('http-url') httpurl: string;

  @Input('column-defintion') columndefintion: any;

  @Output() selectedRecord: any = new EventEmitter<any>();

  @ContentChildren(CanvasTreeColumnComponent)
  columnRef: QueryList<CanvasTreeColumnComponent>;

  responseData: any;

  columns: any[] = [];

  previousValue: any;

  viewRows: any;

  mask: boolean = true;

  previousData: any;

  columnPreviewData: any;

  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.previousValue = JSON.parse(JSON.stringify(this.data));
      this.setData(this.data);
    }
  }

  ngDoCheck() {
    if (
      this.previousData != null &&
      JSON.stringify(this.previousData) != JSON.stringify(this.data)
    ) {
      this.previousData = JSON.parse(JSON.stringify(this.data));
      this.setChangeData(this.data);
    }
    if (
      JSON.stringify(this.columnPreviewData) !=
      JSON.stringify(this.columndefintion)
    ) {
      this.columnPreviewData = JSON.parse(JSON.stringify(this.columndefintion));
      this.columns = this.columndefintion;
    }
  }

  ngAfterContentInit() {
    if (this.columndefintion) {
      this.columns = this.columndefintion;
      this.columnPreviewData = JSON.parse(JSON.stringify(this.columndefintion));
    } else {
      this.createConfig();
    }
  }

  createConfig() {
    let columnRefArray = [];
    columnRefArray = this.columnRef.toArray();
    for (let cr = 0; cr < columnRefArray.length; cr++) {
      const columnConfig = columnRefArray[cr];
      let columnData: any;
      if (
        columnConfig.headerTemplate != null &&
        columnConfig.bodyTemplate != null
      ) {
        columnData = {
          text: columnConfig.text,
          dataindex: columnConfig.dataindex,
          hidden: columnConfig.hidden,
          datatype: columnConfig.datatype,
          headerTemplate: columnConfig.headerTemplate,
          width: columnConfig.width,
          bodyTemplate: columnConfig.bodyTemplate,
          editable: columnConfig.editable
        };
      } else if (
        columnConfig.headerTemplate != null &&
        columnConfig.bodyTemplate == null
      ) {
        columnData = {
          text: columnConfig.text,
          dataindex: columnConfig.dataindex,
          hidden: columnConfig.hidden,
          datatype: columnConfig.datatype,
          width: columnConfig.width,
          headerTemplate: columnConfig.headerTemplate,
          editable: columnConfig.editable
        };
      } else if (
        columnConfig.bodyTemplate != null &&
        columnConfig.headerTemplate == null
      ) {
        columnData = {
          text: columnConfig.text,
          dataindex: columnConfig.dataindex,
          hidden: columnConfig.hidden,
          datatype: columnConfig.datatype,
          width: columnConfig.width,
          bodyTemplate: columnConfig.bodyTemplate,
          editable: columnConfig.editable
        };
      } else if (
        columnConfig.bodyTemplate == null &&
        columnConfig.headerTemplate == null
      ) {
        columnData = {
          text: columnConfig.text,
          dataindex: columnConfig.dataindex,
          hidden: columnConfig.hidden,
          width: columnConfig.width,
          datatype: columnConfig.datatype,
          editable: columnConfig.editable
        };
      }
      if (columnConfig.summarytype) {
        columnData['summarytype'] = columnConfig.summarytype;
      }

      if (columnConfig.summarycaption) {
        columnData['summarycaption'] = columnConfig.summarycaption;
      }

      this.columns.push(columnData);
    }
  }
  setChangeData(httpResponse: any) {
   // let treedata = this.getResponseData(httpResponse);
    this.viewRows = httpResponse;
    this.viewRows.forEach((row: any, index: any) => {
      this.viewRows[index].level = 1;
      this.viewRows[index].expand = false;
    });
    this.mask = false;
  }

  setData(httpResponse: any) {
    let treedata = this.getResponseData(httpResponse);
    this.viewRows = treedata;
    this.viewRows.forEach((row: any, index: any) => {
      this.viewRows[index].level = 1;
      this.viewRows[index].expand = false;
    });
    this.mask = false;
  }

  getResponseData(httpResponse: any) {
    let responsedata = httpResponse;
    if (this.datareader != null) {
      let dr = this.datareader.split('.');
      for (let ir = 0; ir < dr.length; ir++) {
        responsedata = responsedata[dr[ir]];
      }
    } else {
      responsedata = httpResponse;
    }

    return responsedata;
  }

  toogle(row: any, index: number) {
    row.expanded = !row.expanded;
    if (row.expanded) {
      this.addRows(row, index);
    } else {
      this.removeRows(row);
    }
  }

  addRows(row: any, index: number) {
    debugger;
    for (let i = 0; i < row.children.length; i++) {
      let node = row.children[i];
      if (!row.level) {
        row.level = 1;
      }
      if (node.children) {
        node.expanded = false;
      }
      node.level = row.level + 1;
      this.viewRows.splice(index + (i + 1), 0, node);
    }
  }

  removeRows(node: any) {
    for (let i = 0; i < node.children.length; i++) {
      for (let j = 0; j < this.viewRows.length; j++) {
        if (this.viewRows[j] === node.children[i]) {
          if (node.children[i].children) this.removeRows(node.children[i]);
          this.viewRows.splice(this.viewRows.indexOf(node.children[i]), 1);
        }
      }
    }
  }

  setSelectedRow(rowData: any, event: any) {
    this.selectedRecord.emit(rowData);
  }
}
