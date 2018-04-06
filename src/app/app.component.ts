import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {text} from '@angular/core/src/render3/instructions';
import {and} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  parentJsonStructure: any[] = [];

  localTreeData: any[] = [];

  operationTreeData: any[] = [];




  constructor(private _http: HttpClient) {
  }

  addParentObject() {
    const treeDataObjectStructure: any = this.createObjectStructure('object');
    treeDataObjectStructure.readOnly = true;
    this.localTreeData.push(treeDataObjectStructure);
    this.operationTreeData.push(treeDataObjectStructure);
    this.createJsonData();

  }

  addParentArray() {
    const treeDataObjectStructure: any = this.createObjectStructure('array');
    treeDataObjectStructure.readOnly = true;
    this.localTreeData.push(treeDataObjectStructure);
    this.operationTreeData.push(treeDataObjectStructure);
    this.createJsonData();
  }


  createJsonData() {
    console.log(this.operationTreeData);
    this.buildingJson(this.operationTreeData);

  }


  buildingJson(treeData: any) {
    this.parentJsonStructure = [];
    treeData.forEach((opt: any, index: any) => {
      let structure: any;
      if(opt.type == 'object') {
        structure = {};
      } else {
        structure = [];
      }
      this.parentJsonStructure.push(structure);


    });

  }


  createObjectStructure(type:any): any {
    if(type == 'object') {
      const treeDataObjectStructure: any = new TreeDataObjectStructure();
      treeDataObjectStructure.type = 'object';
      treeDataObjectStructure.key = '{}';
      treeDataObjectStructure.value = '{}';
      treeDataObjectStructure['readOnly'] = false;
      return treeDataObjectStructure;
    } else if(type == 'array') {
      const treeDataObjectStructure: any = new TreeDataObjectStructure();
      treeDataObjectStructure.type = 'array';
      treeDataObjectStructure.key = '[]';
      treeDataObjectStructure.value = '[]';
      treeDataObjectStructure['readOnly'] = false;
      return treeDataObjectStructure;
    } else {
      const treeDataObjectStructure: any = new TreeDataObjectStructure();
      treeDataObjectStructure.type = 'key';
      treeDataObjectStructure.key = 'key';
      treeDataObjectStructure.value = 'key';
      treeDataObjectStructure['readOnly'] = false;
      return treeDataObjectStructure;
    }
  }
}


export class TreeDataObjectStructure {
  key: any;
  type: string;
  value: any;
  expanded: boolean;
  id: any;

  constructor() {
    this.key = 'Object';
    this.type = 'Object';
    this.value = '{}';
    this.expanded = true;
    this.id = Math.floor(Math.random() * 90000) + 10000;
  }
}
