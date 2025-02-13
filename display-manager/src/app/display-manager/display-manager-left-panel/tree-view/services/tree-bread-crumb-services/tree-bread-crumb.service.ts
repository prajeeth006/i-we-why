import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { TreeBreadCrumb } from '../../models/tree-bread-crumb.model';
import { CommonService } from '../common-service/common.service';


@Injectable({
  providedIn: 'root'
})
export class TreeBreadCrumbService {

  breadCrumbData = new BehaviorSubject<TreeBreadCrumb>({});
  breadCrumbData$ = this.breadCrumbData.asObservable();
  breadCrumbArray = new BehaviorSubject<Array<MainTreeNode>>([]);
  breadCrumbArray$ = this.breadCrumbArray.asObservable();

  constructor(private commonService: CommonService) { }


  getBreadCrumbNode(id: string | undefined, name: string | undefined) {
    let count = 0;

    this.breadCrumbArray$.subscribe((breadCrumbArray: (MainTreeNode)[]) => {
      for (let i = 0; i < breadCrumbArray.length; i++) {
        let activeId = breadCrumbArray[0]?.nodeProperties?.id;
        count++;
        if (activeId == "MainTab" && id == "MainTab") {
          this.commonService.promotionFullTreeData = this.commonService.promotionFullTreeData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t?.nodeProperties?.name === value?.nodeProperties?.name && t?.nodeProperties?.nodeId == value?.nodeProperties?.nodeId && t?.nodeProperties?.level == 0
            )))
          this.commonService.promotionCurrentTreeData = this.commonService.promotionFullTreeData;
          this.commonService.promotionFullTreeData = this.commonService.promotionFullTreeData;
          this.commonService._treeControl.collapseAll();
          return;
        }
        else if (activeId == "MainTab" && breadCrumbArray[i]?.nodeProperties?.id == id) {
          this.commonService.promotionCurrentTreeData = this.commonService.promotionCurrentTreeData.filter((value, index, self) =>
            index === self.findIndex((t) => (
              t?.nodeProperties?.name === value?.nodeProperties?.name && t?.nodeProperties?.nodeId == value?.nodeProperties?.nodeId
            )))
          this.commonService.promotionCurrentTreeData = [breadCrumbArray[i] as MainTreeNode];
          this.commonService._treeControl.collapseAll();
          return;
        }
      }
    })
    this.breadCrumbArray.value.splice(count);
  }
}
