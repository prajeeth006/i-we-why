import { Injectable } from '@angular/core';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { BaseTreeViewService } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/services/base-tree-view.service';
import { CommonService } from '../common-service/common.service';
import { Event, RacingEvents } from '../../models/event.model';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { ProductTabs } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tab-names';
import { Filters } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { NodeProperties } from '../../models/tree-node.model';

@Injectable({
  providedIn: 'root'
})
export class SportTabService {
  filters: Filters = new Filters();
  sportsTrading: string = "Trading";
  constructor(private baseTreeViewService: BaseTreeViewService,
    private commonService: CommonService,
    private labelSelectorService: LabelSelectorService) { }

  toggleSportsNode(node: MainTreeNode, expand: boolean, parentList: Array<string | undefined>) {
    node.nodeProperties.isLoading = true;
    let index = this.commonService.promotionCurrentTreeData.indexOf(node);
    if (expand) {
      let currentLabel = this.labelSelectorService.getCurrentLabel();

      this.baseTreeViewService.getRacingTabNodes(currentLabel, node.event, this.filters, false).subscribe((racingEvents: RacingEvents) => {
        if (racingEvents) {
          let nodes = racingEvents?.content?.map(racingEvent => {
            const { categoryCode, name, id, className, markets, typeId, typeName, isExpandable, marketsWhichAreDropped, isStandardTemplatesLoaded, virtual, startTime, eventName, targetLink, isMeetingPages, meetingPageRelativePath, sportType, version, sportId, regionId, competitionId, fixtureId, eventSortCode, isBothVersionsForOutright, tradingLabelId, first, sortField, sortType, isLive, fixtureType, isInPlay, contentMediaType, multiEventfixtureType, isPreAndInPlayRequired, tradingPartitionId, hasRegion, language, skipMarketFilter,contentProvider, isFixtureV2Enabled } = racingEvent;

            let event: Event = {
              tabName: ProductTabs.sports, categoryCode, name, id, className, markets, typeId, typeName, isExpandable, marketsWhichAreDropped, isStandardTemplatesLoaded, virtual, startTime, eventName, targetLink, isMeetingPages, meetingPageRelativePath, sportType, version, sportId, regionId, competitionId, fixtureId, eventSortCode, isBothVersionsForOutright, tradingLabelId, first, sortField, sortType, isLive, fixtureType, isInPlay, contentMediaType, multiEventfixtureType, isPreAndInPlayRequired, tradingPartitionId, hasRegion, language, skipMarketFilter,contentProvider,isFixtureV2Enabled
            }
            let nodeProps: NodeProperties = {
              id: racingEvent.id, name: racingEvent.name, level: node?.nodeProperties?.level + 1,
              expandable: !!racingEvent.isExpandable, isSportsTreeNode: true, isRacingTreeNode: false, isPromotionTreeNode: false, isMultiEventTreeNode: false
            }
            return new MainTreeNode(nodeProps, {}, this.commonService.createEvent(event));
          });
          nodes = nodes?.filter(item => !!item?.nodeProperties?.name);
          index = (node?.event?.sportType?.toLowerCase().trim() == this.sportsTrading?.toLowerCase().trim()) ? this.commonService?.promotionCurrentTreeData?.findIndex(x => x?.event?.sportId === node?.event?.sportId && x?.nodeProperties?.name?.trim() === node?.nodeProperties?.name?.trim() && x?.nodeProperties?.id === node?.nodeProperties?.id) : this.commonService?.promotionCurrentTreeData?.findIndex(x => x?.nodeProperties?.name?.trim() === node?.nodeProperties?.name?.trim() && x?.nodeProperties?.id === node?.nodeProperties?.id);
          if (!!nodes) {
            this.commonService.promotionCurrentTreeData.splice(index + 1, 0, ...nodes);
          }
        }
        this.commonService.notifyChange(node);
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
}
