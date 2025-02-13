import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodeOptions, NodeProperties } from '../../models/tree-node.model';
import { Event } from '../../models/event.model'
import { MainTreeNode } from '../../models/main-tree-node.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ProgressService } from 'src/app/common/progress-service/progress.service';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { DefaultToggleNodes } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/default-toggle-node.enum';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private matDialogue: MatDialog,
    private progress: ProgressService) { }
  private isErrorDialogOpen = false;

  getLevel = (node: MainTreeNode) => node?.nodeProperties?.level;

  isExpandable = (node: MainTreeNode) => !!node?.nodeProperties?.expandable;

  hasChild = (_: number, _nodeData: MainTreeNode) => !!_nodeData?.nodeProperties?.expandable;
  promotionFullTreeDataChange = new BehaviorSubject<MainTreeNode[]>([]);
  promotionCurrentTreeDataChange = new BehaviorSubject<MainTreeNode[]>([]);
  promotionPreviousTreeDataChange = new BehaviorSubject<MainTreeNode[]>([]);
  promotionTreeDataChange = new BehaviorSubject<MainTreeNode[]>([]);
  filterRacingCategory = new BehaviorSubject<string>("");

  filterRacingEventVal: string;
  filterIsOutRightVal: boolean;
  isChannelDroppable = new BehaviorSubject<boolean>(false);
  filterRacingCategoryVal: string;

  isLabelChange: boolean = false;
  ifErrorOnTabChange = new BehaviorSubject<boolean>(false);
  ifErrorOnTabChange$ = this.ifErrorOnTabChange.asObservable();

  omniaException: string = 'omniaexception';

  defaultToggleTreeNodeOnButtonClick: boolean = false;
  defaultToggleOnNodeExpansion: boolean = false;

  _treeControl = new FlatTreeControl<MainTreeNode>(this.getLevel, this.isExpandable);

  get promotionFullTreeData(): MainTreeNode[] { return this.promotionFullTreeDataChange.value; }

  get promotionCurrentTreeData(): MainTreeNode[] { return this.promotionCurrentTreeDataChange.value; }

  get promotionPreviousTreeData(): MainTreeNode[] { return this.promotionPreviousTreeDataChange.value; }

  get filterRacingEventValue(): string { return this.filterRacingEventVal; }

  get filterRacingCategoryValue(): string { return this.filterRacingCategoryVal; }

  get filterIsOutRightValue(): boolean { return this.filterIsOutRightVal; }

  set promotionCurrentTreeData(value: MainTreeNode[]) {
    this._treeControl.dataNodes = value;
    this.promotionCurrentTreeDataChange.next(value);
  }

  set promotionFullTreeData(value: MainTreeNode[]) {
    this.promotionFullTreeDataChange.next(value);
  }
  set promotionPreviousTreeData(value: MainTreeNode[]) {
    this.promotionPreviousTreeDataChange.next(value);
  }
  set filterRacingEventValue(value) {
    this.filterRacingEventVal = value;
  }
  set filterRacingCategoryValue(value) {
    this.filterRacingCategoryVal = value;
    this.filterRacingCategory.next(value);
  }

  set filterIsOutRightValue(value) {
    this.filterIsOutRightVal = value;
  }

  notifyChange(node: MainTreeNode) {
    this.promotionCurrentTreeDataChange.next(this.promotionCurrentTreeData);
    this.promotionCurrentTreeData = this.promotionCurrentTreeData.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t?.nodeProperties?.nodeId === value?.nodeProperties?.nodeId && t?.nodeProperties?.name === value?.nodeProperties?.name
      )));


    //Setting previous data.
    let chkvals = this.promotionPreviousTreeData.findIndex(x => x?.nodeProperties?.nodeId == node?.nodeProperties?.nodeId) + 1;

    let difitem = this._treeControl?.dataNodes.filter(({ nodeProperties: { nodeId: id1 } }) => !this.promotionPreviousTreeData.some(({ nodeProperties: { nodeId: id2 } }) => id2 === id1));
    this.promotionPreviousTreeData.splice(chkvals, 0, ...difitem);
    this.promotionPreviousTreeData = this.promotionPreviousTreeData.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t?.nodeProperties?.name === value?.nodeProperties?.name && t?.nodeProperties?.nodeId == value?.nodeProperties?.nodeId
      )));
    node.nodeProperties.isLoading = false;
  }

  createEvent(event: Event) {

    return new Event({
      id: event.id, name: event.name, categoryCode: event.categoryCode, className: event.className, typeId: event.typeId, marketsWhichAreDropped: event.marketsWhichAreDropped, markets: event.markets, typeName: event.typeName, isStandardTemplatesLoaded: event.isStandardTemplatesLoaded,
      isExpandable: event.isExpandable, virtual: event.virtual, startTime: event.startTime, eventName: event.eventName, tabName: event.tabName, targetLink: event.targetLink, isMeetingPages: event.isMeetingPages, meetingPageRelativePath: event.meetingPageRelativePath, eventSortCode: event.eventSortCode,
      version: event.version, sportType: event.sportType, sportId: event.sportId, regionId: event.regionId, competitionId: event.competitionId, fixtureId: event.fixtureId, isBothVersionsForOutright: event.isBothVersionsForOutright,
      tradingLabelId: event.tradingLabelId, first: event.first, sortField: event.sortField, sortType: event.sortType, isLive: event.isLive,
      fixtureType: event.fixtureType, isInPlay: event.isInPlay, contentMediaType: event.contentMediaType, multiEventfixtureType: event.multiEventfixtureType, isPreAndInPlayRequired: event.isPreAndInPlayRequired, tradingPartitionId: event.tradingPartitionId,
      hasRegion: event.hasRegion, language: event.language, skipMarketFilter: event.skipMarketFilter, assetType: event.assetType, assetsPath: event.assetsPath, isAutoExpand: event.isAutoExpand, splitScreen: event?.splitScreen, contentProvider: event.contentProvider,
      isResulted: event.isResulted, isSettled: event.isSettled, isFixtureV2Enabled: event.isFixtureV2Enabled
    })
  }

  public HandleError(errorMessage: HttpErrorResponse, node: MainTreeNode = new MainTreeNode({} as NodeProperties, {} as NodeOptions)) {
    this.getErrorMessageOnDialogBox(errorMessage);
    node.nodeProperties.isLoading = false;
    this.progress.done();
  }

  public getErrorMessageOnDialogBox(errorMessage: any, unauthorizedMessage?: any) {
    let message = "";
    if (errorMessage?.error) {
      if (errorMessage?.error?.ExceptionType?.toLowerCase()?.trim().includes(this.omniaException)) {
        message = unauthorizedMessage ?? errorMessage?.error?.ExceptionMessage;
      }
      else {
        message = unauthorizedMessage ?? errorMessage?.error?.ExceptionMessage + " " + "[" + errorMessage?.message + "]";
      }
    }
    else {
      message = unauthorizedMessage ?? errorMessage.message
    }
    this.handleDialogPopup(message, 'http-error-dialog', unauthorizedMessage);
  }

  public handleDialogPopup(errorMessage: any, modelId: string, unauthorizedMessage?: string) {
    if (this.isErrorDialogOpen) {
      return;
    }
    this.isErrorDialogOpen = true;
    const dialogRef = this.matDialogue.open(DialogueComponent, {
      id: modelId,
      hasBackdrop: true,
      data: { message: errorMessage }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.isErrorDialogOpen = false;
      if (unauthorizedMessage) {
        window.location.reload();
      }
    });
  }

  public expandSpecificNode(treeControl: FlatTreeControl<MainTreeNode>) {
    for (let i = 0; i < treeControl.dataNodes.length; i++) {
      if (treeControl.dataNodes[i]?.nodeProperties?.name?.toLowerCase().trim() === DefaultToggleNodes.HorseRacing.toLowerCase().trim() && !treeControl.dataNodes[i]?.nodeProperties?.isLoading) {
        treeControl.expand(treeControl.dataNodes[i])
      }
      if (treeControl.dataNodes[i]?.nodeProperties?.name?.toLowerCase().trim() === DefaultToggleNodes.HorseRacingLive.toLowerCase().trim() && !treeControl.dataNodes[i]?.nodeProperties?.isLoading) {
        treeControl.expand(treeControl.dataNodes[i])
      }
      if (treeControl.dataNodes[i]?.nodeProperties?.name?.toLowerCase().trim() === DefaultToggleNodes.GreyHounds.toLowerCase().trim() && !treeControl.dataNodes[i]?.nodeProperties?.isLoading) {
        treeControl.expand(treeControl.dataNodes[i])
      }
      if (treeControl.dataNodes[i]?.nodeProperties?.name?.toLowerCase().trim() === DefaultToggleNodes.GreyHoundsLive.toLowerCase().trim() && !treeControl.dataNodes[i]?.nodeProperties?.isLoading) {
        treeControl.expand(treeControl.dataNodes[i])
      }
      if (treeControl.dataNodes[i]?.nodeProperties?.isAutoExpand === true && !treeControl.dataNodes[i]?.nodeProperties?.isLoading) {
        treeControl.expand(treeControl.dataNodes[i])
      }
    }
  }

  public expandScrollingSpecificNode(treeControl: FlatTreeControl<MainTreeNode>) {
    for (let i = 0; i < treeControl.dataNodes.length; i++) {
      if (treeControl.dataNodes[i]?.nodeProperties?.isAutoExpand === true && !treeControl.dataNodes[i]?.nodeProperties?.isLoading) {
        treeControl.expand(treeControl.dataNodes[i])
      }
    }
  }

}
