import { Pipe, PipeTransform } from '@angular/core';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';

@Pipe({
  name: 'assetnamepreview'
})
export class AssetnamePreviewPipe implements PipeTransform {

  transform(droppedItem: MainTreeNode | undefined): string {
    if (droppedItem?.event?.eventName) {
      let assetName = droppedItem?.event?.eventName;
      return assetName;
    } if (droppedItem?.nodeProperties?.name) {
      console.log(droppedItem?.nodeProperties?.name);
      return droppedItem?.nodeProperties?.name;
    } else {
      return '';
    }
  }

}
