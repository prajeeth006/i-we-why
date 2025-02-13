import { Pipe, PipeTransform } from '@angular/core';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';

@Pipe({
  name: 'assettype'
})
export class AssettypePipe implements PipeTransform {

  transform(droppedItem: MainTreeNode | undefined): string {
    if (droppedItem?.event?.className) {
      return droppedItem?.event?.className;
    } else if (droppedItem?.nodeProperties?.isPromotionTreeNode) {
      return 'Static Promotion';
    } else if (droppedItem?.nodeProperties?.isCarousleNode) {
      return 'Carousel';
    } else if (droppedItem?.nodeProperties?.isMultiEventTreeNode) {
      return 'Multi Event';
    } else {
      return '';
    }
  }

}
