import {ChangeDetectorRef, Component} from '@angular/core';
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

  test1:any[];


  constructor(private _http: HttpClient,public cdf:ChangeDetectorRef) {
   /* this.test1 = [
      {
        "countryName": "Myanmar",
        "countryCode1": "MM",
        "countryCode2": "MMR",
        "countryFlag": "MM.png",
        "capital": "",
        "currencyCode": "MMK",
        "currencyName": "Kyat",
        "currencySymbol": "K",
        "capitalLatitude": null,
        "capitalLongitude": null,
        "isoNumeric": 104
      }
    ];*/
  }
/*
  ttttt() {
    this.test1 = [ {
      "countryName": "Myanasadmar",
      "countryCode1": "MM",
      "countryCode2": "MMR",
      "countryFlag": "MM.png",
      "capital": "",
      "currencyCode": "MMK",
      "currencyName": "Kyat",
      "currencySymbol": "K",
      "capitalLatitude": null,
      "capitalLongitude": null,
      "isoNumeric": 104
    }];

  }*/


  /* UI Icon validation*/

  showKeyIcon(row: any) {
    if (row.type == 'array' || row.type == 'key') {
      return false;
    } else {
      return true;
    }

  }

  showRepeatIcon(row:any) {
    if(row.type == 'array'&& row.hasOwnProperty('children') && row.children.length >= 1) {
      return true;
    }else return false;

  }
  showRepeatIconInverse(row:any) {
    if(row.type == 'array'&& row.hasOwnProperty('children') && row.children.length >= 1) {
      return false;
    }else return true;

  }

  addParentObject() {
    const treeDataObjectStructure: any = this.createObjectStructure('object');
    treeDataObjectStructure.key = '{}';
    treeDataObjectStructure.readOnly = true;
    this.localTreeData[0] = treeDataObjectStructure;
    this.createJsonData();
  }

  addParentArray() {
    const treeDataObjectStructure: any = this.createObjectStructure('array');
    treeDataObjectStructure.key = '[]';
    treeDataObjectStructure.readOnly = true;
    this.localTreeData[0] = treeDataObjectStructure;
    this.createJsonData();
  }

  repeatObject(type: any, rowData: any, index: any){
      let cloneData: any;
      cloneData = JSON.parse(JSON.stringify(rowData.children[0]));
      rowData.children.push(this.createCloneData(cloneData, rowData.children.length));
    this.toogle(rowData, index);
    this.createJsonData();
  }

  addDataObject(type: any, rowData: any, index: any) {
    const treeDataObjectStructure: any = this.createObjectStructure(type);
    if (rowData.hasOwnProperty('children')) {
          if (rowData.type == 'array' && type == 'object') {
                treeDataObjectStructure.key = '[' + rowData.children.length + ']';
                treeDataObjectStructure['readOnly'] = true;
          } else if(rowData.type == 'array' && type == 'array') {
              treeDataObjectStructure.key = '[]';
              treeDataObjectStructure['readOnly'] = true;
            rowData.children.push(treeDataObjectStructure);
            } else {
            rowData.children.push(treeDataObjectStructure);
          }

    } else {
          rowData['children'] = [];
          if (rowData.type == 'array' && type == 'object') {
                treeDataObjectStructure.key = '[' + rowData.children.length + ']';
                treeDataObjectStructure['readOnly'] = true;
          } else if(rowData.type == 'array' && type == 'array') {
            treeDataObjectStructure.key = '[]';
            treeDataObjectStructure['readOnly'] = true;
          }
          rowData.children.push(treeDataObjectStructure);
    }
    this.toogle(rowData, index);
    this.createJsonData();
  }


  createCloneData(cloneData: any,index:any): any {
    let test: any[] = [];
      const treeDataObjectStructure: any = this.createObjectStructure(cloneData.type);
      if(cloneData.type == 'object') {
           treeDataObjectStructure.key = '[' + index + ']';
      } else {
        treeDataObjectStructure.key = '[]';
      }
    treeDataObjectStructure.readOnly = true;
     if(cloneData.hasOwnProperty('children')) {
       treeDataObjectStructure['children'] = [];
       this.childSearch(cloneData,treeDataObjectStructure);
     }
     debugger;
      test.push(treeDataObjectStructure);
      return test[0];
  }

  childSearch(child:any, parentRef:any) {
    child.children.forEach((opt:any) => {
      const treeDataObjectStructure: any = this.createObjectStructure(opt.type);
      treeDataObjectStructure.key = opt.key;
      if(opt.hasOwnProperty('children')) {
        debugger;
        treeDataObjectStructure['children'] = [];
        this.childSearch(opt,treeDataObjectStructure);
      }
      parentRef.children.push(treeDataObjectStructure);
    });
  }


  keyOnChange(event:any, data: any) {
    data.key = event;
    this.createJsonData();

  }
  valueOnChange(event:any, data: any) {
    data.value = event;
    this.createJsonData();

  }
  createJsonData() {
    this.buildingJson(this.localTreeData[0]);

  }


  buildingJson(treeData: any) {
    console.log(treeData);
    this.parentJsonStructure = [];
      let structure: any;
      if(treeData.type == 'object') {
        structure = {};
        if(treeData.hasOwnProperty('children')) {
          this.buildingObjectJson(treeData,structure);
        }
      } else {
        structure = [];
        if(treeData.hasOwnProperty('children')) {
          this.buildingArrayJson(treeData, structure);
        }
      }
      this.parentJsonStructure.push(structure);


  }


  createObjectStructure(type: any): any {
    if(type == 'object') {
      const treeDataObjectStructure: any = new TreeDataObjectStructure();
      treeDataObjectStructure.type = 'object';
      treeDataObjectStructure.key = 'object_' + Math.floor(Math.random() * 90000) + 1;
      treeDataObjectStructure.value = '{}';
      treeDataObjectStructure['readOnly'] = false;
      return treeDataObjectStructure;
    } else if(type == 'array') {
      const treeDataObjectStructure: any = new TreeDataObjectStructure();
      treeDataObjectStructure.type = 'array';
      treeDataObjectStructure.key = 'array_' + Math.floor(Math.random() * 90000) + 1;
      treeDataObjectStructure.value = '[]';
      treeDataObjectStructure['readOnly'] = false;
      return treeDataObjectStructure;
    } else {
      const treeDataObjectStructure: any = new TreeDataObjectStructure();
      treeDataObjectStructure.type = 'key';
      treeDataObjectStructure.key = 'key_' + Math.floor(Math.random() * 90000) + 1;
      treeDataObjectStructure.value = 'key';
      treeDataObjectStructure['readOnly'] = false;
      return treeDataObjectStructure;
    }
  }



  buildingObjectJson(data: any, parentRef: any) {
     data.children.forEach((option:any,index: any)=>{
       if(option.type == 'object') {
         parentRef[option.key] = {};
         if(option.hasOwnProperty('children')) {
           this.buildingObjectJson(option, parentRef[option.key]);
         }
       } else if(option.type == 'array') {
         parentRef[option.key] = [];
         if (option.hasOwnProperty('children')) {
           this.buildingArrayJson(option,parentRef[option.key]);
         }
       } else {
         parentRef[option.key] = option.value;
       }

     });

  }

  buildingArrayJson(data: any, parentRef: any) {
    debugger;
    data.children.forEach((option:any,index: any)=>{
      if(option.type == 'array') {
        let localArray:any;
        localArray = [];
        parentRef.push(localArray);
        if(option.hasOwnProperty('children')) {
          /* need to change parameter*/
          this.buildingArrayJson(option, parentRef[index]);
        }

      }else  if(option.type == 'object') {
        let localArray:any;
        localArray = {};
        parentRef.push(localArray);
        if(option.hasOwnProperty('children')) {
          /* need to change parameter*/
          this.buildingObjectJson(option, parentRef[index]);
        }
      }
    });

  }

  /* remove object*/
  onRemove(row: any) {
    if(this.localTreeData == row){
      this.localTreeData = [];
    } else {
      this.searchInChild(this.localTreeData, row);
    }
    this.cdf.detectChanges();
    //this.localTreeData = this.localTreeData;
    this.createJsonData();

  }

  searchInChild(rowData: any,searchObject: any) {
    rowData.forEach((opt: any,index:any)=>{
      if(opt.id == searchObject.id) {
        rowData.splice(index, 1);
      } else if (opt.hasOwnProperty('children')){
        this.searchInChild(opt.children, searchObject);
      }
    });
  }

  toogle(row: any, index: number) {
    row.expanded = true;
    if (row.expanded) {
      this.addRows(row, index);
    }
  }

  addRows(row: any, index: number) {
    this.removeRows(row);
    if (row.hasOwnProperty('children')) {
      for (let i = 0; i < row.children.length; i++) {
        const node = row.children[i];
        if (!row.level) {
          row.level = 1;
        }
        if (node.children) {
          node.expanded = false;
        }
        node.level = row.level + 1;
        this.localTreeData.splice(index + (i + 1), 0, node);
      }
    }
  }

  removeRows(node: any) {
    for (let i = 0; i < node.children.length; i++) {
      for (let j = 0; j < this.localTreeData.length; j++) {
        if (this.localTreeData[j] === node.children[i]) {
          if (node.children[i].children) {
            this.removeRows(node.children[i]);
          }
          this.localTreeData.splice(
            this.localTreeData.indexOf(node.children[i]),
            1
          );
        }
      }
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
    this.key = 'object';
    this.type = '0bject';
    this.value = '{}';
    this.expanded = true;
    this.id = Math.floor(Math.random() * 90000) + 10000;
  }
}
