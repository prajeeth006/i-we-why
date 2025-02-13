import { Injectable } from '@angular/core';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { BaseTreeViewService } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/services/base-tree-view.service';
import { CommonService } from '../common-service/common.service';
import { Event, RacingEvents } from '../../models/event.model'
import { MainTreeNode } from '../../models/main-tree-node.model';
import { ProductTabs } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tab-names';
import { Filters } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { ExcludedNodeService } from '../excluded-node-services/excluded-node.service';
import { FilterEvents } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-events.enum';
import { NodeOptions, NodeProperties } from '../../models/tree-node.model';
import { DefaultToggleNodes } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/default-toggle-node.enum';

@Injectable({
  providedIn: 'root'
})
export class RacingTabService {
  filters: Filters = new Filters();

  constructor(private baseTreeViewService: BaseTreeViewService,
    private commonService: CommonService,
    private excludedNodeService: ExcludedNodeService,
    private labelSelectorService: LabelSelectorService) { }

  toggleRacingNode(node: MainTreeNode, expand: boolean, parentList: Array<string | undefined>) {
    node.nodeProperties.isLoading = true;
    let index = this.commonService.promotionCurrentTreeData.indexOf(node);
    if (expand) {
      let currentLabel = this.labelSelectorService.getCurrentLabel();
      this.excludedNodeService.getSharedExcludedNodes(currentLabel)
      this.baseTreeViewService.getRacingTabNodes(currentLabel, node.event, this.filters).subscribe((racingEvents: RacingEvents) => {
        if (racingEvents) {
          let nodes = racingEvents?.content?.map(racingEvent => {

            const { categoryCode, name, id, className, markets, typeId, typeName, isExpandable, marketsWhichAreDropped, isStandardTemplatesLoaded, virtual, startTime, eventName, targetLink, isMeetingPages, sportType, version, sportId, regionId, competitionId, fixtureId, meetingPageRelativePath, isBothVersionsForOutright, contentMediaType, tradingPartitionId, assetType, assetTypeAliasName, assetsPath, isAutoExpand, splitScreen, contentProvider, isResulted, isSettled } = racingEvent;

            let event: Event = {
              tabName: ProductTabs.racing,
              categoryCode, name, id, className, markets, typeId, typeName, isExpandable, marketsWhichAreDropped, isStandardTemplatesLoaded, virtual, startTime, eventName, targetLink, isMeetingPages, sportType, version, sportId, regionId, competitionId, fixtureId, meetingPageRelativePath, isBothVersionsForOutright, contentMediaType, tradingPartitionId, assetType, assetsPath, isAutoExpand, splitScreen, contentProvider, isResulted, isSettled
            }
            let nodeProps: NodeProperties = {
              id: racingEvent.id, name: racingEvent.name, level: node?.nodeProperties?.level + 1,
              expandable: !!racingEvent.isExpandable, isSportsTreeNode: false, isRacingTreeNode: true, isPromotionTreeNode: false, isMultiEventTreeNode: false, assetType, isAutoExpand, assetTypeAliasName
            }
            let nodeOptions: NodeOptions = { needExcludeIcon: false, isExcluded: index > -1 }

            let newNode = new MainTreeNode(nodeProps, nodeOptions, this.commonService.createEvent(event));
            newNode.nodeOptions.needExcludeIcon = this.excludedNodeService.hasToShowIcon(parentList, newNode);
            newNode.nodeOptions.needOverrideIcon = this.excludedNodeService.hasToShowOverrideIcon(parentList, newNode);
            newNode.nodeOptions.isExcluded = this.excludedNodeService.isNodeExcluded(currentLabel, newNode, parentList);

            return newNode;
          });

          nodes = nodes?.filter(item => !!item?.nodeProperties?.name);
          index = this.commonService?.promotionCurrentTreeData?.findIndex(x => x?.nodeProperties?.name?.trim() === node?.nodeProperties?.name?.trim() && x?.nodeProperties?.id === node?.nodeProperties?.id);
          if (!!nodes) {
            this.commonService.promotionCurrentTreeData?.splice(index + 1, 0, ...nodes);
          }

        }
        this.commonService.notifyChange(node);
        if (this.filters?.dateFrom?.toLowerCase()?.trim() !== FilterEvents.Next15?.toLowerCase()?.trim() &&
          this.commonService.defaultToggleTreeNodeOnButtonClick && this.commonService.defaultToggleOnNodeExpansion) {
          this.commonService.expandSpecificNode(this.commonService._treeControl);
        }

        else if (this.commonService._treeControl?.dataNodes.some(status => status.nodeProperties.isAutoExpand == true)) {
          this.commonService.expandScrollingSpecificNode(this.commonService._treeControl);
        }

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
