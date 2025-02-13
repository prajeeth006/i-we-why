import { SelectionChange } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { ScItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { MainTreeNode } from '../models/main-tree-node.model';
import { CommonService } from './common-service/common.service';
import { RacingTabService } from './racing-tab-services/racing-tab.service';
import { SportTabService } from './sports-tab-services/sport-tab.service';
import { Event } from '../models/event.model';
import { TreeBreadCrumbService } from './tree-bread-crumb-services/tree-bread-crumb.service';
import { TreeBreadCrumb } from '../models/tree-bread-crumb.model';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CarouselTabService } from './carousel-tab-services/carousel-tab.service';
import { SortbyFilterService } from './common-service/sortby-filter.service';
import { StringUtilities } from 'src/app/helpers/string-utilities';
import { FilterEvents } from '../../generic-tab-service/model/filter-events.enum';
import { Filters } from '../../generic-tab-service/model/filters.model';
import { ProductTabs } from '../../product-tabs/product-tab-names';
import { FilterRacingCategories } from '../../generic-tab-service/model/filter-racingcategories.enum';
import { ErrorDialogue } from '../../generic-tab-service/model/Error-Dialogue.model';
import { ProductTabService } from '../../product-tabs/services/product-tab.service';
import { ProgressService } from 'src/app/common/progress-service/progress.service';
import { ExcludedNodeService } from './excluded-node-services/excluded-node.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';
import { NodeOptions, NodeProperties } from '../models/tree-node.model';
import { ScreenRuleRequest } from 'src/app/display-manager/display-manager-right-panel/display-manager-screens/models/display-screen-rule.model';
import { ApiService } from 'src/app/common/api.service';

@Injectable({
  providedIn: 'root'
})
export class TreeViewService {

  tabName: string | undefined;
  tabNamesEnum = ProductTabs;
  getRacingconfig: string;

  constructor(private scItemService: ScItemService,
    private commonService: CommonService,
    private racingTabService: RacingTabService,
    private sportTabService: SportTabService,
    private carouselTabService: CarouselTabService,
    private treeBreadCrumbService: TreeBreadCrumbService,
    private sortByFilterService: SortbyFilterService,
    private excludedNodeService: ExcludedNodeService,
    private productService: ProductTabService,
    private labelSelectorService: LabelSelectorService,
    private progress: ProgressService,
    private apiService: ApiService) {
    this.labelSelectorService.getIncludeRacingConfiguration(this.labelSelectorService.getCurrentLabel()).subscribe((configItem) => {
      this.getRacingconfig = configItem;
    });
  }

  handleTreeControl(change: SelectionChange<MainTreeNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  toggleNode(node: MainTreeNode, expand: boolean) {
    node.nodeProperties.isLoading = true;
    if (node?.nodeProperties?.isPromotionTreeNode || node?.nodeProperties?.isChannelTreeNode || node?.nodeProperties?.isMultiEventTreeNode || node?.nodeProperties?.isManualTreeNode || node?.nodeProperties?.isMisc) {
      this.toggleStaticPromotionNode(node, expand, this.getParentList(node, true, true));
    } else if (node?.nodeProperties?.isCarousleNode) {
      this.carouselTabService.toggleCarouselNode(node, expand, this.getParentList(node));
    } else if (node?.nodeProperties?.isRacingTreeNode) {
      this.racingTabService.toggleRacingNode(node, expand, this.getParentList(node));
    } else if (node?.nodeProperties?.isSportsTreeNode) {
      this.sportTabService.toggleSportsNode(node, expand, this.getParentList(node, true));
    }
  }

  toggleStaticPromotionNode(node: MainTreeNode, expand: boolean, parentList: Array<string | undefined>) {
    const index = this.commonService.promotionCurrentTreeData.indexOf(node);
    if (expand) {
      this.getChildren(node?.nodeProperties?.id, node?.nodeProperties?.isManualTreeNode).subscribe((children: ScItem[]) => {
        if (!children || index < 0) { // If no children, or cannot find the node, no op
          return;
        }
        const nodes = children.map(scItem => {

          const { ItemName, ItemID, TemplateName, HasChildren, TargetID, TargetId, TargetLink, AssetType, EventList, ContentMediaType, ContentProvider, EnableAudio, AudioOutputDevice } = scItem;

          const { level, isPromotionTreeNode, isSkyChannelTreeNode, isChannelTreeNode, isCarousleNode, isMultiEventTreeNode, isMisc, isManualTreeNode, tradingPartitionId } = node?.nodeProperties;

          let newNode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
          newNode.nodeProperties.name = ItemName;
          let hasToShowDeleteIcon = this.excludedNodeService.hasToShowDeleteIcon(parentList, newNode);
          let hasToShowEditIcon = this.excludedNodeService.hasToShowEditIcon(parentList, newNode);
          scItem.TargetId = TargetID ? TargetID : TargetId;

          let nodeProperties: NodeProperties = {
            id: ItemID, name: ItemName, level: level + 1, isFolder: TemplateName === 'Folder', expandable: HasChildren === 'True',
            isPromotionTreeNode, isChannelTreeNode, isCarousleNode, isSkyChannelTreeNode, isMultiEventTreeNode, targetLink: TargetLink, assetType: AssetType, eventList: EventList, isMisc, targetId: TargetId, isManualTreeNode, contentMediaType: ContentMediaType, tradingPartitionId, contentProvider: ContentProvider, enableAudio: EnableAudio, audioOutputDevice: AudioOutputDevice
          };
          let nodeOptions: NodeOptions = { needDeleteIcon: hasToShowDeleteIcon, needEditIcon: hasToShowEditIcon };

          return new MainTreeNode(nodeProperties, nodeOptions);
        });

        if (!node?.nodeProperties?.isManualTreeNode) {
          this.sortByFilterService.getDataBasedOnSortByFilter(nodes);
        }
        this.commonService.promotionCurrentTreeData.splice(index + 1, 0, ...nodes);
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

  getParent(node?: MainTreeNode): MainTreeNode {
    const currentLevel = node?.nodeProperties?.level;
    if (currentLevel == 0 && (currentLevel < 1)) {

      let event: Event = { id: '', name: '', sportType: node?.event?.sportType, version: node?.event?.version, isBothVersionsForOutright: node?.event?.isBothVersionsForOutright, tradingLabelId: node?.event?.tradingLabelId, first: node?.event?.first, sortField: node?.event?.sortField, sortType: node?.event?.sortType };

      let nodeProperties: NodeProperties = { id: "MainTab", name: this.tabName ? this.tabName : "tabunknown", level: currentLevel, expandable: false, isSportsTreeNode: node?.nodeProperties?.isSportsTreeNode, isRacingTreeNode: node?.nodeProperties?.isRacingTreeNode, isPromotionTreeNode: node?.nodeProperties?.isPromotionTreeNode, isMultiEventTreeNode: node?.nodeProperties?.isMultiEventTreeNode };


      return new MainTreeNode(nodeProperties, {} as NodeOptions, event);
    }
    const startIndex = node ? this.commonService.promotionPreviousTreeData.findIndex(x => x?.nodeProperties?.nodeId === node?.nodeProperties?.nodeId) - 1 : -1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.commonService.promotionPreviousTreeData[i];
      if (currentLevel && currentNode?.nodeProperties?.level < currentLevel) {
        return currentNode;
      }
    }
    return node!;
  }

  getChildren(itemId?: string, isManualTree?: boolean): Observable<ScItem[]> {
    if (isManualTree) {
      return this.scItemService.getDataFromMasterForManualDB<ScItem[]>('/sitecore/api/ssc/item/' + itemId + '/children').pipe(map(res => {
        res.sort((a, b) => -a.__Updated.localeCompare(b.__Updated));
        return res;
      }));
    }
    else {
      return this.scItemService.getDataFromMasterDB<ScItem[]>('/sitecore/api/ssc/item/' + itemId + '/children').pipe(map(res => {
        return res
      }));
    }

  }

  getParentList(node: MainTreeNode, includeCurrentNode: boolean = true, needTabName: boolean = false): Array<string | undefined> {
    var breadCrumb: TreeBreadCrumb = new TreeBreadCrumb(node);
    for (let i = node?.nodeProperties?.level; i >= 0; i--) {
      let parentBreadCrumb = new TreeBreadCrumb(this.getParent(breadCrumb.data as MainTreeNode));
      breadCrumb.parent = parentBreadCrumb;
      parentBreadCrumb.child = breadCrumb
      breadCrumb = breadCrumb.parent;
    }
    let child: TreeBreadCrumb | undefined = breadCrumb.child
    let parentList: Array<string | undefined> = [];

    if (this.productService.activeLibraryOrManualTabData.value?.toLowerCase() == Constants.library_tab.toLowerCase()) {
      if (needTabName) {
        parentList.push(this.productService.activeTabData.value);
      } else {
        parentList.push(this.commonService.filterRacingCategoryVal);
        parentList.push(this.commonService.filterRacingEventVal);
      }
    } else {
      parentList.push(this.productService.activeOverrideOrUserCreatedTabData.value);
    }

    while (child) {
      parentList.push(child.data?.nodeProperties?.name);
      child = child?.child;
    }

    if (!includeCurrentNode) {
      parentList.pop();
    }

    return parentList;
  }

  doubleClick(node: MainTreeNode) {
    if (!node?.nodeProperties?.expandable)
      return;
    let breadCrumbArray = this.treeBreadCrumbService.breadCrumbArray.getValue() as MainTreeNode[];
    if (breadCrumbArray !== null && breadCrumbArray.length > 0) {
      let uniqvalue = breadCrumbArray.find(x => x?.nodeProperties?.nodeId === node?.nodeProperties?.nodeId);
      if (uniqvalue != null) {
        return;
      }
    }

    var breadCrumb: TreeBreadCrumb = new TreeBreadCrumb(node);
    for (let i = node?.nodeProperties?.level; i >= 0; i--) {
      let parentBreadCrumb = new TreeBreadCrumb(this.getParent(breadCrumb.data as MainTreeNode));
      breadCrumb.parent = parentBreadCrumb;
      parentBreadCrumb.child = breadCrumb
      breadCrumb = breadCrumb.parent;
    }

    this.treeBreadCrumbService.breadCrumbData.next(breadCrumb);
    if (node?.nodeProperties?.expandable) {
      this.commonService._treeControl.collapseAll();
      this.commonService.promotionCurrentTreeData = [node];
    }
    else {
      this.commonService.promotionCurrentTreeData = [this.getParent(node)];
    }

  }

  OnloadMappingRacingCategories(sportsTabNodes: MainTreeNode[], multiEventNode: ScItem | undefined,
    isRacing: boolean, racingEvents: Event[], filters: Filters) {
    sportsTabNodes = isRacing ? sportsTabNodes.concat(this.mapRacingTabNodes(racingEvents)) : sportsTabNodes.concat(this.mapSportsTabNodes(racingEvents));
    if ((multiEventNode && filters?.dateFrom.toLowerCase() === FilterEvents.Today.toLowerCase() && !filters.antePost)
      || !isRacing) {
      this.getChildren(multiEventNode?.ItemID).subscribe((multiEventNodes: ScItem[]) => {
        this.labelSelectorService.getIncludeRacingConfiguration(this.labelSelectorService.getCurrentLabel()).subscribe((configItem) => {
          let getTodayContent = configItem?.split(',').map(s => s?.toLowerCase()?.trim());
          multiEventNodes = multiEventNodes?.filter(includeFolder => getTodayContent?.includes(includeFolder.ItemName?.toLowerCase()?.trim()));
          let multieventNodes = StringUtilities.removeNamePrefixFromItems(multiEventNodes);

          let treenode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
          treenode.nodeProperties.id = multiEventNode?.ItemID;
          let parentList = this.getParentList(treenode, false, true)

          let promotions = this.mapStaticPromotions(multieventNodes, false, false, false, false, true, parentList, false, false);
          this.sortByFilterService.getDataBasedOnSortByFilter(promotions);
          sportsTabNodes = sportsTabNodes.concat(promotions);

          this.commonService.promotionCurrentTreeData = sportsTabNodes;
          this.commonService.promotionFullTreeData = sportsTabNodes;
          this.commonService.promotionPreviousTreeData = sportsTabNodes;
          if (this.commonService.defaultToggleTreeNodeOnButtonClick) {
            this.commonService.expandSpecificNode(this.commonService._treeControl);
          }
        });
      });
    } else {
      let parentList: Array<string | undefined> = [];
      parentList.push(this.commonService.filterRacingCategoryVal);
      parentList.push(this.commonService.filterRacingEventVal);

      sportsTabNodes.forEach(sportsTabNode => {
        sportsTabNode.nodeOptions.needExcludeIcon = this.excludedNodeService.hasToShowIcon(parentList, sportsTabNode);
        sportsTabNode.nodeOptions.needOverrideIcon = this.excludedNodeService.hasToShowOverrideIcon(parentList, sportsTabNode);
        sportsTabNode.nodeOptions.isExcluded = this.excludedNodeService.isNodeExcluded(this.labelSelectorService.getCurrentLabel(), sportsTabNode, parentList);
      });

      this.commonService.promotionCurrentTreeData = sportsTabNodes;
      this.commonService.promotionFullTreeData = sportsTabNodes;
      this.commonService.promotionPreviousTreeData = sportsTabNodes;
      if (filters?.dateFrom.toLowerCase() !== FilterEvents.Next15.toLowerCase() && this.commonService.defaultToggleTreeNodeOnButtonClick) {
        this.commonService.expandSpecificNode(this.commonService._treeControl);
      }
    }
  }

  mapRacingTabNodes(racingEvents: Event[]) {
    racingEvents = racingEvents.filter(x => !!x.name);

    return racingEvents.map(racingEvent => {
      const { categoryCode, name, id, typeName, typeId, markets, className, isExpandable, isStandardTemplatesLoaded, marketsWhichAreDropped, virtual, startTime, eventName, tabName, version, sportType, sportId, regionId, competitionId, fixtureId, isBothVersionsForOutright, tradingLabelId, first } = racingEvent;

      let event: Event = { categoryCode, name, id, typeName, typeId, markets, className, isExpandable, isStandardTemplatesLoaded, marketsWhichAreDropped, virtual, startTime, eventName, tabName, version, sportType, sportId, regionId, competitionId, fixtureId, isBothVersionsForOutright, tradingLabelId, first };
      let nodeProperties: NodeProperties = { id, name, level: 0, expandable: !!isExpandable, isSportsTreeNode: false, isRacingTreeNode: true, isPromotionTreeNode: false, isMultiEventTreeNode: false }

      return new MainTreeNode(nodeProperties, {} as NodeOptions, this.commonService.createEvent(event))
    })
  }

  mapSportsTabNodes(racingEvents: Event[]) {
    racingEvents = racingEvents.filter(x => !!x.name);
    return racingEvents.map(racingEvent => {

      const { categoryCode, name, id, typeName, typeId, markets, className, isExpandable, isStandardTemplatesLoaded, marketsWhichAreDropped, virtual, tabName, version, sportType, sportId, regionId, competitionId, fixtureId, isBothVersionsForOutright, tradingLabelId, first, sortField, sortType, isLive, fixtureType, isInPlay, multiEventfixtureType, isPreAndInPlayRequired, hasRegion, language, skipMarketFilter, startTime, eventName, targetLink, tradingPartitionId, eventSortCode, meetingPageRelativePath, isMeetingPages,isFixtureV2Enabled } = racingEvent;

      let event: Event = { categoryCode, name, id, typeName, typeId, markets, className, isExpandable, isStandardTemplatesLoaded, marketsWhichAreDropped, virtual, tabName, version, sportType, sportId, regionId, competitionId, fixtureId, isBothVersionsForOutright, tradingLabelId, first, sortField, sortType, isLive, fixtureType, isInPlay, multiEventfixtureType, isPreAndInPlayRequired, hasRegion, language, skipMarketFilter, startTime, eventName, targetLink, tradingPartitionId, eventSortCode, meetingPageRelativePath, isMeetingPages, isFixtureV2Enabled };

      let nodeProperties: NodeProperties = { id, name, level: 0, expandable: !!isExpandable, isSportsTreeNode: true, isRacingTreeNode: false, isPromotionTreeNode: false, isMultiEventTreeNode: false };

      return new MainTreeNode(nodeProperties, {} as NodeOptions, this.commonService.createEvent(event))
    })
  }

  mapStaticPromotions(children: ScItem[], isPromotionTreeNode: boolean, isChannelTreeNode: boolean,
    isCarousleNode: boolean,
    isSkyChannelTreeNode: boolean, isMultiEvent: boolean, parentList: Array<string | undefined>, isMisc: boolean, isManualTreeNode: boolean) {

    return children.map(scItem => {

      const { ItemName, ItemID, TemplateName, HasChildren, AssetType, EventList } = scItem;

      let newNode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
      newNode.nodeProperties.name = ItemName;
      let hasToShowDeleteIcon = this.excludedNodeService.hasToShowDeleteIcon(parentList, newNode);
      let hasToShowEditIcon = this.excludedNodeService.hasToShowEditIcon(parentList, newNode);
      if (isChannelTreeNode) {
        isSkyChannelTreeNode = ItemName?.toLowerCase()?.includes('sky') ? true : false;
      }

      let nodeProperties: NodeProperties = {
        id: ItemID, name: ItemName, level: 0, isFolder: TemplateName === 'Folder', expandable:
          HasChildren === 'True', isPromotionTreeNode: isPromotionTreeNode, isChannelTreeNode: isChannelTreeNode, isCarousleNode: isCarousleNode, isSkyChannelTreeNode: isSkyChannelTreeNode, isMultiEventTreeNode: isMultiEvent, targetLink: undefined, assetType: AssetType, eventList: EventList, isMisc: isMisc, targetId: "", isManualTreeNode: isManualTreeNode
      };
      let nodeOptions: NodeOptions = { needDeleteIcon: hasToShowDeleteIcon, needEditIcon: hasToShowEditIcon, }

      return new MainTreeNode(nodeProperties, nodeOptions);

    });
  }

  LoadCategoriesForRacingTab(racingEvents: Event[]): string[] {
    let racingEventNames = Array<string>();
    racingEvents?.map((item) => {
      if (item?.name?.toLowerCase() == FilterRacingCategories.Horses.toLowerCase()) {
        racingEventNames?.splice(0, 0, FilterRacingCategories.ReplacedHorseRacingNameOnPageLoad);
      }
      else {
        racingEventNames?.push(item?.name);
      }
    })

    racingEventNames = this.LoadCategoriesForRacingTabManuallyIfMissing(racingEventNames);
    return racingEventNames;
  }

  LoadCategoriesForRacingTabManuallyIfMissing(racingEventNames: Array<string>): Array<string> {
    var racingEventNamesLowerCase = racingEventNames?.toString().toLowerCase();
    var indexOfHorseRacingExcluseForAntePost = racingEventNamesLowerCase?.indexOf(FilterRacingCategories.ReplacedHorseRacingNameOnPageLoad.toLowerCase());
    var indexOfGreyHoundsExcluseForAntePost = racingEventNamesLowerCase?.indexOf(FilterRacingCategories.GreyHounds.toLowerCase());
    if (indexOfHorseRacingExcluseForAntePost == -1) {
      racingEventNames?.splice(0, 0, FilterRacingCategories.ReplacedHorseRacingNameOnPageLoad);
    }
    if (indexOfGreyHoundsExcluseForAntePost == -1) {
      racingEventNames?.splice(1, 0, FilterRacingCategories.GreyHounds);
    }
    racingEventNames.push(FilterRacingCategories.Virtuals);
    racingEventNames.push(FilterRacingCategories.Misc);
    racingEventNames = racingEventNames.filter(x => x != null);
    return racingEventNames;
  }

  assignDefaultValuesOnTabChangeForSorting(filters: Filters) {
    this.treeBreadCrumbService.breadCrumbArray.next([]);
  }

  assignDefaultValuesForSportsTab(filters: Filters) {
    this.commonService.filterRacingEventVal = FilterEvents.Today;
  }

  assignDefaultValuesOnRacingTab(filterEvents: FilterEvents[], filters: Filters): FilterEvents[] {
    filterEvents =
      [FilterEvents.Next15, FilterEvents.Today, FilterEvents.Tomorrow, FilterEvents.Future, FilterEvents.AntePost];
    // to retain the Racing category filter to default on tab change
    this.commonService.filterRacingCategoryValue = FilterRacingCategories.Horses;
    filters.racingCategoryFilter = this.commonService.filterRacingCategoryValue;
    // to retain the filters of racings based on Today/Tomorrow etc... on tab change
    this.commonService.filterRacingEventVal = FilterEvents.Next15;
    filters.isNext15 = false;

    this.commonService.defaultToggleOnNodeExpansion = true;
    this.commonService.filterIsOutRightValue = false;
    return filterEvents;
  }

  handleErrorOnSwitchingTabs(errorMessage: HttpErrorResponse, dialogueError: ErrorDialogue, filters: Filters) {
    if (this.commonService.isLabelChange) {
      dialogueError.previousValue = undefined;
      this.clearAllPreviousTreeData();
    }
    if (!this.commonService.isLabelChange && dialogueError.previousValue) {
      dialogueError.ifError = true;
      dialogueError.previousValue = (!dialogueError.isCarouselPopUp) ? dialogueError.previousValue : this.tabNamesEnum.carousel;
      this.productService.setActiveTab(dialogueError.previousValue);
    }
    this.commonService.getErrorMessageOnDialogBox(errorMessage);
    this.progress.done();
    this.commonService.isLabelChange = false;
  }

  clearAllPreviousTreeData() {
    this.commonService.promotionCurrentTreeDataChange.next([]);
    this.commonService.promotionFullTreeDataChange.next([]);
    this.commonService.promotionPreviousTreeDataChange.next([]);
  }

  OnRacingCategoryFilter(dialogueError: ErrorDialogue, filters: Filters, index: number,
    value: string, filterEvents: FilterEvents[]): FilterEvents[] {
    dialogueError.isSelectionChangedForRacing = true;
    this.commonService.filterRacingEventVal = FilterEvents.Next15;
    filters.isNext15 = false;

    filters.selectedFilterIndex = index;
    filters.selectedRacingFilterIndex = 0;
    this.commonService.filterRacingCategoryValue = value === FilterRacingCategories.ReplacedHorseRacingNameOnPageLoad ? FilterRacingCategories.Horses : value;
    filters.racingCategoryFilter = this.commonService.filterRacingCategoryValue;
    if (value?.toLowerCase() === FilterRacingCategories.Virtuals.toLowerCase()) {
      if (filterEvents?.length <= 0) {
        filterEvents = [FilterEvents.Next15, FilterEvents.Today, FilterEvents.Tomorrow, FilterEvents.Future, FilterEvents.AntePost];
      }
      let forDeletion = [FilterEvents.AntePost, FilterEvents.Future, FilterEvents.Tomorrow];
      return filterEvents = filterEvents.filter(item => !forDeletion.includes(item));
    }
    else if (value?.toLowerCase() === FilterRacingCategories.Misc.toLowerCase()) {
      let forDeletion = [FilterEvents.Next15, FilterEvents.Today, FilterEvents.Tomorrow, FilterEvents.Future, FilterEvents.AntePost];
      return filterEvents = filterEvents.filter(item => !forDeletion.includes(item));
    }
    else {
      return filterEvents = [FilterEvents.Next15, FilterEvents.Today, FilterEvents.Tomorrow, FilterEvents.Future, FilterEvents.AntePost];
    }

  }

  previewAsset(screenRuleRequests: ScreenRuleRequest) {
    return this.apiService.post<string>('/sitecore/api/displayManager/preview/assetPreview', screenRuleRequests);
  }
}
