import { Injectable } from '@angular/core';
import { CommonService } from '../common-service/common.service';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ScItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { HttpParams } from '@angular/common/http';
import { Carousel } from 'src/app/display-manager/display-manager-left-panel/carousel/models/carousel';
import { ScreenRuleRequest } from 'src/app/display-manager/display-manager-right-panel/display-manager-screens/models/display-screen-rule.model';
import { CarouselItemNamePipe } from 'src/app/display-manager/display-manager-left-panel/carousel/filters/carousel-item-name.pipe';
import { ApiService } from 'src/app/common/api.service';
import { NodeOptions, NodeProperties } from '../../models/tree-node.model';

@Injectable({
  providedIn: 'root'
})
export class CarouselTabService {

  constructor(private apiService: ApiService,
    private commonService: CommonService,
    private carouselItemNamePipe: CarouselItemNamePipe) { }


  toggleCarouselNode(node: MainTreeNode, expand: boolean, parentList: Array<string | undefined>) {
    const index = this.commonService.promotionCurrentTreeData.indexOf(node);
    let _this = this;
    if (expand) {


      this.getCarouselItems(node?.nodeProperties?.id)
        .subscribe((children: ScItem[]) => {
          if (!children || index < 0) { // If no children, or cannot find the node, no op
            return;
          }
          const nodes = children.map(scItem => {

            const { ItemID, ItemName, TemplateName, HasChildren } = scItem;
            const { level, isPromotionTreeNode, isChannelTreeNode, isCarousleNode, isMisc } = node?.nodeProperties;

            let nodeProps: NodeProperties = {
              id: ItemID, name: ItemName, level: level + 1, isFolder: TemplateName === 'Folder', expandable: HasChildren === 'True',
              isPromotionTreeNode, isChannelTreeNode, isCarousleNode, isMisc
            }
            return new MainTreeNode(nodeProps, {} as NodeOptions);
          });
          let cuttrent = _this.commonService.promotionCurrentTreeData;
          _this.commonService.promotionCurrentTreeData.splice(index + 1, 0, ...nodes);
          _this.commonService.notifyChange(node);
        },
          err => {
            this.commonService.HandleError(err, node);
          });
    }
    else {
      let count = 0;
      for (let i = index + 1; i < this.commonService.promotionCurrentTreeData.length && this.commonService.promotionCurrentTreeData[i]?.nodeProperties?.level > node?.nodeProperties?.level; i++, count++) { }
      this.commonService.promotionCurrentTreeData.splice(index + 1, count);
      this.commonService.notifyChange(node);
    }
  }

  getCarouselItems(carouselId?: string): Observable<ScItem[]> {
    let params = new HttpParams().append('carouselId', carouselId ? carouselId : "");
    return this.apiService.get<Carousel>('/sitecore/api/displayManager/gantryTargetingCarousel/getCarousel', params).pipe(
      map((res: Carousel) => {
        let children: ScItem[] = [];
        res.GantryTargetingRules.forEach((carouselItem: ScreenRuleRequest) => {
          children.push({
            ItemName: this.carouselItemNamePipe.transform(carouselItem.racingEvent, carouselItem.targetItemName),
            ItemID: carouselItem?.ruleId ? carouselItem?.ruleId : '',
            Level: 0,
            HasChildren: 'false',
            TemplateName: '',
            TargetLink: ''
          })
        });
        return children;
      })
    );
  }
}
