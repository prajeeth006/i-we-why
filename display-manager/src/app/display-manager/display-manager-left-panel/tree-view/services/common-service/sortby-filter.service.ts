import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { MainTreeNode } from '../../models/main-tree-node.model';

@Injectable({
  providedIn: 'root'
})
export class SortbyFilterService {

  constructor(private commonService: CommonService) { }

  public getDataBasedOnSortByFilter(events: MainTreeNode[]): MainTreeNode[] {
    return events?.sort((mainTreeNode1: MainTreeNode, mainTreeNode2: MainTreeNode) => {
      var sortingEventName1 = this.getEventSortingName(mainTreeNode1);
      var sortingEventName2 = this.getEventSortingName(mainTreeNode2);
      if (!!mainTreeNode1?.event?.startTime && !!mainTreeNode2?.event?.startTime) {
        return this.sortArrayInAscendingOrder(new Date(mainTreeNode1?.event?.startTime).getTime(), new Date(mainTreeNode2?.event?.startTime).getTime()) || this.sortArrayInAscendingOrder(sortingEventName1, sortingEventName2);
      }
      else {
        return this.sortArrayInAscendingOrder(sortingEventName1, sortingEventName2);
      }
    });
  }

  private sortArrayInAscendingOrder(a: string|number, b: string|number): number {
    return a === b ? 0 : a < b ? -1 : 1;
  };
  private sortArrayInDesendingOrder(a: string|number, b: string|number): number {
    return a === b ? 0 : a > b ? -1 : 1;
  };
  private getEventSortingName(item: MainTreeNode): string {
    if (!!item?.event?.eventName) {
      return item?.event?.eventName?.toLowerCase();
    }
    else {
      return item?.nodeProperties?.name?.toLowerCase() ?? '';
    }
  }
}
