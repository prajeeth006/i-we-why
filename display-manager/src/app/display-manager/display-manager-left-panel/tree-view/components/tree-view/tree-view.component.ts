import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ConfigItem, LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { ScItem, ScMediaItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { BaseTreeViewService } from '../../../generic-tab-service/services/base-tree-view.service';
import { ProductTabs } from '../../../product-tabs/product-tab-names';
import { LeftPanelTreeDataSource } from '../../left-panel-tree-data-source';
import { NodeOptions, NodeProperties, TreeNode } from '../../models/tree-node.model';
import { CommonService } from '../../services/common-service/common.service';
import { TreeViewService } from '../../services/tree-view.service';
import { Event, RacingEvents } from '../../models/event.model';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { TreeBreadCrumbService } from '../../services/tree-bread-crumb-services/tree-bread-crumb.service';
import { Params } from '@angular/router';
import { RouteDataService } from '../../services/common-service/route-data.service';
import { FilterEvents } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-events.enum';
import { Filters, PrepareGantryPreviewAssetNewUrl, PrepareGantryUrl } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { SortbyFilterService } from '../../services/common-service/sortby-filter.service';
import { CarouselComponent } from '../../../carousel/carousel.component';
import { CarouselService } from '../../services/carousel-service/carousel.service';
import { MatDialog } from '@angular/material/dialog';
import { StringUtilities } from 'src/app/helpers/string-utilities';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { FilterSports } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-sports.enum';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { ProgressService } from 'src/app/common/progress-service/progress.service';
import { ProductTabService } from 'src/app/display-manager/display-manager-left-panel/product-tabs/services/product-tab.service';
import { ErrorDialogue } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/Error-Dialogue.model';
import { ExcludedNodeService } from '../../services/excluded-node-services/excluded-node.service';
import { ExcludingTypes } from '../../models/excluded-model';
import { DroppedItem } from 'src/app/display-manager/display-manager-right-panel/display-manager-screens/models/display-screen.model';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';
import { MultieventService } from 'src/app/display-manager/display-manager-right-panel/multi-event/services/multievent.service';
import { RightPanelTabControlService } from 'src/app/display-manager/display-manager-right-panel/services/tab-control.service';
import { OverrideServiceService } from 'src/app/common/services/override-service/override-service.service';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { ServerTypes } from '../../models/asset-preview.model';
import { BOMUtilities } from 'src/app/helpers/bom-utilities';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';
import { ActionDialogComponent } from 'src/app/common/action-dialog/action-dialog.component';
import { MasterConfigurationService } from 'src/app/display-manager/display-manager-right-panel/master-layout/services/master-configuration.service';
import { Footer } from 'src/app/display-manager/display-manager-right-panel/profiles/models/footer-content';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { ProfileConstants } from 'src/app/display-manager/display-manager-right-panel/profiles/constants/profile-constants';
export interface Heirarchies {
  DisplayName: string;
  HasChildren: boolean;
  ItemID: string;
  ItemIcon: string;
  ItemName: string;
  ItemPath: string;
}

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'tree-view-custom-cdk-overlay-pane' },
    },
  ],
})
export class TreeViewComponent implements OnInit {
  @Input()
  tabName: string;
  @Input() currentTabData: any;
  tabNamesEnum = ProductTabs;
  //treedata source
  treeControl: FlatTreeControl<TreeNode>;
  dataSource: LeftPanelTreeDataSource;
  queryParams: Params;
  toolTip: boolean = false;
  panelOpenState = false;
  staticPromotionsFolderIdSubscription: Subscription;
  filterEvents: FilterEvents[] =
    [FilterEvents.Next15, FilterEvents.Today, FilterEvents.Tomorrow, FilterEvents.Future, FilterEvents.AntePost];
  filters: Filters = new Filters();
  previewDroppable: string = 'previewDroppable';
  droppableItemName?: string = '';
  ellipsisName?: string = "";
  droppedItem?: MainTreeNode | undefined;
  breadCrumbArray$ = this.treeBreadCrumbService.breadCrumbArray$;
  currentLabel: string;
  filterSports: FilterSports[] = [FilterSports.Matches, FilterSports.OutRight];
  onloadCategories: Array<string>;
  dialogueError: ErrorDialogue = new ErrorDialogue();
  previousNodeId?: string;
  assetImageUrl: string;
  @ViewChild('treeViewContainer', { static: false }) public treeViewContainer: ElementRef;
  manualConstants = Constants;
  selectedTabName: string;
  manualTabs: Heirarchies[] = [];
  isLibraryFlag: boolean = false;
  assetPreviewServerTypes = ServerTypes;
  blueIconPath: string | undefined;
  greenIconPath: string | undefined;
  assetDropAreaIconPath: string | undefined;
  editIconPath: string | undefined;
  carouselTabIconPath: string | undefined;
  folderIconPath: string | undefined;
  childNodeChannelIconPath: string | undefined;
  childNodeDefaultIconPath: string | undefined;
  targetUrl: PrepareGantryUrl = new PrepareGantryUrl();
  targetNewPreviewAssetUrl: PrepareGantryPreviewAssetNewUrl = new PrepareGantryPreviewAssetNewUrl();
  private isDeleteDialogOpen = false;
  private isSaveInProgress = false;

  constructor(public treeViewService: TreeViewService,
    private labelSelectorService: LabelSelectorService,
    private scItemService: ScItemService,
    private baseTreeViewService: BaseTreeViewService,
    public commonService: CommonService,
    private treeBreadCrumbService: TreeBreadCrumbService,
    private activatedRoute: RouteDataService,
    private sortByFilterService: SortbyFilterService,
    public carouselService: CarouselService,
    private excludedNodeService: ExcludedNodeService,
    public dialog: MatDialog,
    private progress: ProgressService,
    private productService: ProductTabService,
    private multieventService: MultieventService,
    public rightPanelTabControlService: RightPanelTabControlService,
    private overrideServiceService: OverrideServiceService,
    private masterConfigService: MasterConfigurationService,
    private matDialogue: MatDialog,
    private sitecoreImageService: SitecoreImageService
  ) {

    this.breadCrumbArray$ = this.treeBreadCrumbService.breadCrumbArray$;
    this.showToolTip();
    this.treeControl = this.commonService._treeControl;
    this.dataSource = new LeftPanelTreeDataSource(this.treeControl, this.commonService, this.treeViewService);
  }

  ngOnInit(): void {
    this.manualTabs = [];
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.commonService.isLabelChange = true;
      this.dialogueError.previousValue = undefined;
      this.currentLabel = currentLabel.toLowerCase();
      this.droppedItem = undefined;
      this.droppableItemName = '';
    });
    if (this.tabName?.toUpperCase != this.manualConstants.manual_tab.toUpperCase) {
      this.productService.tabNameChange$.subscribe((tabValues) => {
        this.tabName = tabValues.currentTab;
        this.dialogueError.previousValue = tabValues.previousTab;
        this.dialogueError.isCarouselPopUp = tabValues.isCarouselPopUp;
        this.loadTreeBasedOnTabName();
        this.setTabName();
      });
      this.assetEventImageUrl();
    }

    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.greenIconPath = mediaAssets?.PreviewProduction;
      this.blueIconPath = mediaAssets?.MainProdcution;
      this.assetDropAreaIconPath =  mediaAssets?.AssetDropArea;
      this.editIconPath =  mediaAssets?.EditIcon;
      this.assetDropAreaIconPath =  mediaAssets?.AssetDropArea;
      this.carouselTabIconPath = mediaAssets?.CarouselTab; 
      this.folderIconPath = mediaAssets?.Foldericon; 
      this.childNodeChannelIconPath = mediaAssets?.ChildNodeChannelIcon; 
      this.childNodeDefaultIconPath = mediaAssets?.ChildNodeDefaultIcon;
    })
  }

  ngOnChanges() {
    this.manualTabs = [];
    this.isLibraryFlag = this.currentTabData?.isLibraryFlag;
    if (this.tabName && this.currentTabData && this.tabName.toUpperCase == this.manualConstants.manual_tab.toUpperCase) {
      this.labelSelectorService.currentLabel$.pipe(
        tap((currentLabel: string) => {
          this.currentLabel = currentLabel.toLowerCase()
        }),
        switchMap(() => this.loadManualTabsFolder(this.currentTabData.ItemPath))
      ).pipe(take(1)).subscribe((tabsItem: ScItem) => this.loadManualTabs(tabsItem?.ItemID));
    }
    else {
      this.manualTabs = [];
    }
  }

  showToolTip() {
    this.queryParams = this.activatedRoute.getQueryParams();
    if (this.queryParams) {
      this.toolTip = this.queryParams['verbose'] == 1 ? true : false;
    }
  }

  ngOnDestroy() {
    this.staticPromotionsFolderIdSubscription.unsubscribe();
  }

  toggleAccordion(panelState: boolean) {
    this.panelOpenState = panelState;
  }

  getMainNodeImage(): string | undefined {
    if (this.tabName?.toLowerCase() == this.tabNamesEnum?.carousel?.toLowerCase()) {
      return this.carouselTabIconPath;
    }
    return this.folderIconPath;
  }

  getSubNodeImage(): string | undefined {
    if (this.tabName?.toLowerCase() == this.tabNamesEnum?.channels?.toLowerCase()) {
      return this.childNodeChannelIconPath;
    }
    return this.childNodeDefaultIconPath;
  }

  loadTreeBasedOnTabName() {
    if (!this.dialogueError.ifError) {
      this.treeViewService.assignDefaultValuesOnTabChangeForSorting(this.filters);
      switch (this.tabName?.toLowerCase()) {
        case this.tabNamesEnum.promo.toLowerCase():
          this.loadStaticPromotions()
          break;
        case this.tabNamesEnum.sports.toLowerCase():
          this.treeViewService.assignDefaultValuesForSportsTab(this.filters);
          this.loadSportsTab(this.labelSelectorService.getCurrentLabel(), this.filters);
          break;
        case this.tabNamesEnum.racing.toLowerCase():
          this.filterEvents = this.treeViewService.assignDefaultValuesOnRacingTab(this.filterEvents, this.filters);
          this.loadRacingTab(this.labelSelectorService.getCurrentLabel(), this.filters);
          break;
        case this.tabNamesEnum.channels.toLowerCase():
          this.loadStaticChannels()
          break;
        case this.tabNamesEnum.carousel.toLowerCase():
          this.loadCarousel()
          break;
        case this.manualConstants.manual_tab.toUpperCase():
          break;
        default:
          this.commonService.promotionCurrentTreeDataChange.next([]);
          this.commonService.promotionFullTreeDataChange.next([]);
          this.commonService.promotionPreviousTreeDataChange.next([]);
          break;
      }
    }
    this.dialogueError.ifError = false;

  }

  private loadManualTabsFolder(path: string): Observable<ScItem> {
    let queryParams = new HttpParams().append('path', path);
    return this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams);
  }

  private loadManualTabs(tabsFolderId: string) {
    this.manualTabs = [];

    if (tabsFolderId) {
      this.scItemService.getDataFromMasterDB<Heirarchies[]>('/sitecore/api/ssc/item/' + tabsFolderId + '/children').subscribe((manualTabs: Heirarchies[]) => {
        if (!!manualTabs?.length) {
          //https://stackoverflow.com/questions/51342582/mat-tab-material-angular6-selectedindex-doesnt-work-with-ngfor
          setTimeout(() => {
            if (manualTabs && manualTabs.length > 0)
              this.selectedTabName = manualTabs[0]?.ItemName;
          }, 0)

          this.manualTabs = manualTabs;
          this.changeTab(manualTabs[0]);
        }
      });
    }
  }

  toggleArrow() {
    // this property is used, when user manually expands the tree node then default expansion should not work
    this.commonService._treeControl?.dataNodes.forEach(node => node.nodeProperties.isAutoExpand = false);
    this.commonService.defaultToggleOnNodeExpansion = false;
  }

  // On change of Next15/Today/Tomorrow... In Racing Tab
  onRacingSelectionFilter(value: any, index: number) {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    this.treeBreadCrumbService.breadCrumbData.next({});
    this.dialogueError.isSelectionChangedForRacing = true;
    this.filters.isNext15 = false;
    this.filters.selectedRacingFilterIndex = index;
    this.commonService.filterRacingEventVal = value;
    this.filters.dateFrom = value;
    this.commonService.defaultToggleTreeNodeOnButtonClick = true;
    this.commonService.defaultToggleOnNodeExpansion = true;
    this.loadRacingTab(this.labelSelectorService.getCurrentLabel(), this.filters);
  }

  // on Change Of Matches/Outright In Sports Tab
  onSportsSelectionOutRightFilter(value: any, index: number) {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    this.treeBreadCrumbService.breadCrumbData.next({});
    this.dialogueError.isSelectionChangedForSports = true;
    this.filters.selectedRacingFilterIndex = index;
    this.commonService.filterIsOutRightValue = value === FilterSports.OutRight ? true : false;
    this.loadSportsTab(this.labelSelectorService.getCurrentLabel(), this.filters);
  }

  // On Change of Categories (Horses/GreyHounds/Virtuals) In Racing Tab
  onRacingCategoryFilter(value: any, index: number) {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    // to clear breadcrumb data on change of categories
    this.treeBreadCrumbService.breadCrumbData.next({});
    this.commonService.defaultToggleOnNodeExpansion = true;
    this.filterEvents = this.treeViewService.OnRacingCategoryFilter(this.dialogueError, this.filters, index, value, this.filterEvents);
    if (value?.toLowerCase() === FilterRacingCategories.Misc.toLowerCase()) {
      this.loadMiscTab(value);
    }
    else {
      this.loadRacingTab(this.labelSelectorService.getCurrentLabel(), this.filters);
    }
  }

  setTabName() {
    this.treeViewService.tabName = this.tabName;
  }

  doubleClick(node: MainTreeNode) {
    this.treeViewService.doubleClick(node);
  }

  toggleExclude(node: MainTreeNode) {
    this.excludedNodeService.addEditExcludedNode(this.labelSelectorService.getCurrentLabel(), node, this.treeViewService.getParentList(node, false)).subscribe(() => {
      if (this.filters.dateFrom == FilterEvents.Next15) {
        let index = this.filterEvents.findIndex(x => x == FilterEvents.Next15);
        this.onRacingSelectionFilter(this.filterEvents[index], index);
      }
      node.nodeProperties.isVisible = false;
    });
  }

  loadMiscTab(value: any) {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    this.dialogueError.isSelectionChangedForRacing = false;
    this.labelSelectorService.currentLabelBasePath$.subscribe(() => {
      let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/Racing/' + value);
      this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams).subscribe(
        (staticPromotionsItem: ScItem) => {
          this.getStaticPromotions(staticPromotionsItem?.ItemID, false, false, false, false, true)
        });
    }).unsubscribe();
  }

  deleteNode(node: MainTreeNode) {
    let isSaveInProgress: boolean | undefined = false;
    this.masterConfigService.footerDataContent$.subscribe((footerData: Footer[]) => {
      isSaveInProgress = footerData.find(item => item.title === ProfileConstants.save)?.isEnable;
    });

    if(isSaveInProgress){
      this.matDialogue.open(DialogueComponent, { data: { message:  Constants.delete_before_save_inprogress_item  } });
      return;
    }
    const deleteItemDialogData = {
      isDeleteMode: true,
      dialog_title: this.manualConstants.delete_asset,
      dialog_msg: `PERMANENTLY DELETE '${node.nodeProperties.name}' ASSET?`,
      dialog_btn_cancel: this.manualConstants.btn_cancel,
      dialog_btn_submit: this.manualConstants.btn_delete
    }; 
    if (this.isDeleteDialogOpen) {
      return;
    }
    this.isDeleteDialogOpen = true;
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      id: 'delete-modal',
      hasBackdrop: true,
      width: '40%',
      panelClass: 'modern-dialog',
      data: {...deleteItemDialogData, node},
    });
    dialogRef.afterClosed().subscribe((isDeleted) => {
      this.isDeleteDialogOpen = false;            
      if (isDeleted) {
        this.commonService.promotionCurrentTreeData.splice(this.commonService.promotionCurrentTreeData.findIndex(function (nodeInTree) {
          return nodeInTree?.nodeProperties?.id === node?.nodeProperties?.id;
        }), 1);
        this.treeControl.collapse(node);
        this.commonService.notifyChange(node);
      }
    });
    node.nodeProperties.isVisible = false;
  }

  editNode(node: MainTreeNode) {
    if (node?.nodeProperties?.id) {
      this.multieventService.getManualItemByID(node?.nodeProperties?.id).subscribe((resp: any) => {
        const result = JSON.parse(resp.EventFormData);
        result.id = node?.nodeProperties?.id;
        result.targetid = resp.TargetId;
        if (result && result.folderName) {
          if (this.manualConstants.manual_racings.indexOf(result.folderName) == -1) {
            this.rightPanelTabControlService.onNewSportclick(result.folderName, node?.nodeProperties?.name, result);
          }
          else {
            this.rightPanelTabControlService.onNewSportclick(this.manualConstants.manual, node?.nodeProperties?.name, result);
          }
        }
      });
    }
  }

  private loadStaticPromotions() {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    this.labelSelectorService.currentLabelBasePath$.subscribe((currentLabelBasePath) => {
      let queryParams = new HttpParams().append('path', currentLabelBasePath + '/Templates/StaticPromotions');
      this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams).subscribe(
        (staticPromotionsItem: ScItem) => {
          this.getStaticPromotions(staticPromotionsItem?.ItemID, true, false, false, false, false)
        });
    }).unsubscribe();
  }

  private loadStaticChannels() {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    this.labelSelectorService.currentLabelBasePath$.subscribe(() => {

      let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/Channels');
      this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams).subscribe(
        (staticPromotionsItem: ScItem) => {
          this.getStaticPromotions(staticPromotionsItem?.ItemID, false, true, false, false, false)
        });
    }).unsubscribe();
  }

  private loadCarousel() {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      let queryParams = new HttpParams().append('path', this.labelSelectorService.getLabelCoralUrls(currentLabel));
      this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams).subscribe(
        (staticPromotionsItem: ScItem) => {
          this.getCarousels(staticPromotionsItem?.ItemID)
        });
    }).unsubscribe();
  }

  private getStaticPromotions(staticPromotionsFolderId: string, isPromotionTreeNode: boolean,
    isChannelTreeNode: boolean, isCarousleNode: boolean,
    isSkyChannelTreeNode: boolean, isMisc: boolean) {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    // this.progress.start();
    if (staticPromotionsFolderId) {

      let treenode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
      treenode.nodeProperties.id = staticPromotionsFolderId;
      let parentList = this.treeViewService.getParentList(treenode, false, true)

      this.treeViewService.getChildren(staticPromotionsFolderId).subscribe((children: ScItem[]) => {
        // this.progress.done();
        let promotions = this.treeViewService.mapStaticPromotions(children, isPromotionTreeNode, isChannelTreeNode,
          isCarousleNode, isSkyChannelTreeNode, false, parentList, isMisc, false);
        this.sortByFilterService.getDataBasedOnSortByFilter(promotions);
        this.commonService.promotionCurrentTreeData = promotions;
        this.commonService.promotionFullTreeData = promotions;
        this.commonService.promotionPreviousTreeData = promotions;
        this.commonService.isLabelChange = false;
      },
        err => {
          this.treeViewService.handleErrorOnSwitchingTabs(err, this.dialogueError, this.filters);
        })
    }
  }

  private loadOverrides(data: Heirarchies) {
    let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/Racing/Overrides');
    this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams).subscribe(
      (userCreatedItem: ScItem) => {
        this.getOverrides(userCreatedItem?.ItemID)
      });
  }

  private loadUserCreated(data: Heirarchies) {
    let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/Racing/UserCreated');
    this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams).subscribe(
      (userCreatedItem: ScItem) => {
        this.getUserCreated(userCreatedItem?.ItemID)
      });
  }

  private getCarousels(carouselFolderId: string) {
    this.treeViewContainer.nativeElement.scrollTop = 0;
    // this.progress.start();
    if (carouselFolderId) {
      let treenode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
      treenode.nodeProperties.id = carouselFolderId;
      let parentList = this.treeViewService.getParentList(treenode, false, true)


      this.treeViewService.getChildren(carouselFolderId).subscribe((children: ScItem[]) => {
        // this.progress.done();
        children = StringUtilities.removeNamePrefixFromItems(children);
        let promotions = this.treeViewService.mapStaticPromotions(children, false, false, true, false, false, parentList, false, false);
        this.sortByFilterService.getDataBasedOnSortByFilter(promotions);
        this.commonService.promotionCurrentTreeData = promotions;
        this.commonService.promotionFullTreeData = promotions;
        this.commonService.promotionPreviousTreeData = promotions;
        this.commonService.isLabelChange = false;
      },
        err => {
          this.treeViewService.handleErrorOnSwitchingTabs(err, this.dialogueError, this.filters);
        })
    }
  }

  private getUserCreated(userFolderId: string) {
    // this.progress.start();
    if (userFolderId) {
      let treenode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
      treenode.nodeProperties.id = userFolderId;
      let parentList = this.treeViewService.getParentList(treenode, false, true)
      this.treeViewService.getChildren(userFolderId).subscribe((children: ScItem[]) => {
        // this.progress.done();
        children = StringUtilities.removeNamePrefixFromItems(children);
        let users = this.treeViewService.mapStaticPromotions(children, false, false, false, false, false, parentList, false, true);
        this.sortByFilterService.getDataBasedOnSortByFilter(users);
        this.commonService.promotionCurrentTreeData = users;
        this.commonService.promotionFullTreeData = users;
        this.commonService.promotionPreviousTreeData = users;
        this.commonService.isLabelChange = false;

      },
        err => {
          this.treeViewService.handleErrorOnSwitchingTabs(err, this.dialogueError, this.filters);
        })
    }
  }

  private getOverrides(userFolderId: string) {
    // this.progress.start();
    if (userFolderId) {
      let treenode = new MainTreeNode({} as NodeProperties, {} as NodeOptions);
      treenode.nodeProperties.id = userFolderId;
      let parentList = this.treeViewService.getParentList(treenode, false, true)
      this.treeViewService.getChildren(userFolderId, true).subscribe((children: ScItem[]) => {
        // this.progress.done();
        children = StringUtilities.removeNamePrefixFromItems(children);
        let users = this.treeViewService.mapStaticPromotions(children, false, false, false, false, false, parentList, false, true);
        this.sortByFilterService.getDataBasedOnSortByFilter(users);
        this.commonService.promotionCurrentTreeData = users;
        this.commonService.promotionFullTreeData = users;
        this.commonService.promotionPreviousTreeData = users;
        this.commonService.isLabelChange = false;
      },
        err => {
          this.treeViewService.handleErrorOnSwitchingTabs(err, this.dialogueError, this.filters);
        })
    }
  }

  loadRacingTab(currentLabel: string, filters: Filters) {
    this.loadRacingOrSports(currentLabel, filters, true);
    this.treeViewContainer.nativeElement.scrollTop = 0;
  }

  loadSportsTab(currentLabel: string, filters: Filters) {
    this.loadRacingOrSports(currentLabel, filters, false);
    this.treeViewContainer.nativeElement.scrollTop = 0;
  }

  loadRacingOrSports(currentLabel: string, filters: Filters, isRacing: boolean = false) {
    let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/' + this.tabName?.toLowerCase());
    const racingTabNodes$ = this.baseTreeViewService.getRacingTabNodes(currentLabel, new Event({ id: '', name: '', tabName: isRacing ? this.tabNamesEnum.racing : this.tabNamesEnum.sports }), this.filters, isRacing);
    const multiEventNodes$ = this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams);
    combineLatest([racingTabNodes$, multiEventNodes$]).pipe(
      map(([allEvents, multiEventNode]: [RacingEvents, ScItem | undefined]) => {
        let sportsTabNodes: MainTreeNode[] = [];
        let racingEvents = allEvents?.content;
        racingEvents?.forEach(x => x.tabName = isRacing ? this.tabNamesEnum.racing : this.tabNamesEnum.sports);

        // Need this filter for the Next15 Events Only for Racing Tab
        this.filters.isNext15 = this.filters.dateFrom == FilterEvents.Next15 ? true : false;
        if (isRacing) {
          // Adding Virtuals in the Racing Category Filters
          this.onloadCategories = this.treeViewService.LoadCategoriesForRacingTab(racingEvents);

          if (filters.racingCategoryFilter.toLowerCase() == FilterRacingCategories.Horses.toLowerCase()) {
            racingEvents = racingEvents?.filter(item => item?.categoryCode?.toLowerCase() == FilterRacingCategories.Horses.toLowerCase());
            if (this.filters.isNext15) {
              this.OnloadNext15((racingEvents?.slice(0, 1).pop()), multiEventNodes$, isRacing, currentLabel);
            }
            else {
              this.treeViewService.OnloadMappingRacingCategories(sportsTabNodes, multiEventNode, isRacing, racingEvents, this.filters);
            }

          }
          else if (filters?.racingCategoryFilter?.toLowerCase() == FilterRacingCategories.GreyHounds.toLowerCase()) {
            racingEvents = racingEvents?.filter(item => item?.categoryCode?.toLowerCase() == FilterRacingCategories.GreyHounds.toLowerCase());
            if (this.filters.isNext15) {
              this.OnloadNext15((racingEvents?.slice(0, 1).pop()), multiEventNodes$, isRacing, currentLabel);
            }
            else {
              this.treeViewService.OnloadMappingRacingCategories(sportsTabNodes, multiEventNode, isRacing, racingEvents, this.filters);
            }
          }
          else {
            if (this.filters.isNext15) {
              racingEvents = [];
              racingEvents.push(new Event({ id: '0', name: FilterRacingCategories.Virtuals, categoryCode: FilterRacingCategories.Virtuals }));
              racingEvents.forEach(racingEvent => {
                if (racingEvent.name.toLowerCase() == FilterRacingCategories.Virtuals.toLowerCase())
                  this.OnloadNext15(racingEvent, multiEventNodes$, isRacing, currentLabel);
              });
            }
            else {
              this.treeViewService.OnloadMappingRacingCategories(sportsTabNodes, multiEventNode, isRacing, racingEvents, this.filters);
            }
          }
        }
        else {
          this.treeViewService.OnloadMappingRacingCategories(sportsTabNodes, multiEventNode, isRacing, racingEvents, this.filters);
        }
      }))
      .subscribe(
        res => {
          if (!this.dialogueError.ifError && this.tabName?.toLowerCase().trim() == this.tabNamesEnum.racing.toLowerCase().trim()) {
            this.filters = this.dialogueError.isSelectionChangedForRacing ? this.filters : new Filters();
            this.dialogueError.isSelectionChangedForRacing = false;
          }
          else {
            this.filters = this.dialogueError.isSelectionChangedForSports ? this.filters : new Filters();
            this.dialogueError.isSelectionChangedForSports = false;
          }
          this.commonService.isLabelChange = false;
        },
        err => {
          if (this.dialogueError.isSelectionChangedForRacing || this.dialogueError.isSelectionChangedForSports) {
            this.treeViewService.clearAllPreviousTreeData();
            this.commonService.HandleError(err);
          }
          else {
            this.treeViewService.handleErrorOnSwitchingTabs(err, this.dialogueError, this.filters);
          }
        }
      );
  }

  OnloadNext15(racingEvents: any, multiEventNode$: Observable<ScItem>, isRacing: boolean, currentLabel: string) {
    this.commonService.filterRacingEventVal = FilterEvents.Next15;
    this.filters.excludedTypes = this.excludedNodeService.getExcludedNodesList(this.labelSelectorService.getCurrentLabel(), ExcludingTypes.Type, [this.commonService.filterRacingCategoryVal]);
    this.filters.excludeEventIds = this.excludedNodeService.getExcludedNodesList(this.labelSelectorService.getCurrentLabel(), ExcludingTypes.Event, [this.commonService.filterRacingCategoryVal]);
    const racingTabNodes$ = this.baseTreeViewService.getRacingTabNodes(currentLabel, new Event({ id: racingEvents?.id, name: racingEvents?.name, tabName: isRacing ? this.tabNamesEnum?.racing : this.tabNamesEnum?.sports }), this.filters, isRacing);
    combineLatest([racingTabNodes$, multiEventNode$]).pipe(
      map(([racingEvents, multiEventNode]: [RacingEvents, ScItem | undefined]) => {
        let sportsTabNodes: MainTreeNode[] = [];
        racingEvents?.content.forEach(x => x.tabName = isRacing ? this.tabNamesEnum.racing : this.tabNamesEnum.sports);
        this.treeViewService.OnloadMappingRacingCategories(sportsTabNodes, multiEventNode, isRacing, racingEvents?.content, this.filters);
      }),
    ).subscribe();
  }

  carouselDropped(droppedItem: MainTreeNode | DroppedItem) {
    if (!droppedItem?.nodeProperties?.isChannelTreeNode) {
      this.droppableItemName = droppedItem?.nodeProperties?.name;
      if (!!droppedItem?.nodeProperties?.name && droppedItem?.nodeProperties?.name?.length > 32) {
        this.ellipsisName = droppedItem?.nodeProperties?.name;
      } else {
        this.ellipsisName = '';
      }
      this.droppedItem = droppedItem
    }
  }
  editCarousle() {
    this.carouselService.setScreenForCarousel(undefined);
    this.carouselService.setCarouselPopupClose();
    this.carouselService.dialogRef.closeAll();
    //Giving timeout to wait for close before one.
    var timeout = setTimeout(() => {
      this.dialog.open(CarouselComponent, {
        id: 'create-new-carousel',
        width: '820px',
        height: '820px',
        backdropClass: 'scope-to-right-pannel',
        data: this.droppedItem?.nodeProperties?.id ? this.droppedItem : undefined
      });
      this.carouselService.setCarouselPopupOpen();
      clearTimeout(timeout);
    }, 100);

  }

  preparePreviewUrl(url: string, isPreviewProd: boolean) {
    return isPreviewProd ? url?.replace("gantry", "preview-gantry") : url;
  }

  // NOTE : Once Preview domains are available we need to have preview production logic enabled
  previewAssetForDroppedItem(event: any) {

    this.labelSelectorService.configItemValues$.subscribe((configItem: ConfigItem) => {

      let isPreviewProd = event.target.id === this.assetPreviewServerTypes.previewProduction;
      
      if(configItem.IsNewRuleProcessFlow){

        var ruleRequest = PrepareScreenRuleRequest.createRuleRequest(this.labelSelectorService.getCurrentLabel(), "", this.droppedItem, "", false)
        this.treeViewService.previewAsset(ruleRequest).subscribe((url: string)=>{
          let updatedUrl = this.preparePreviewUrl(url, isPreviewProd);
          BOMUtilities.openInNewTab(updatedUrl);
        }, (err: string) => {
          console.error(err);
        });

      } 
      else {
        
        let gantryUrl = '';
        let _this: MainTreeNode | undefined;
        let targetItemID: string = '';
        _this = this.droppedItem;
  
        if (!!_this?.event?.markets) {
          _this!.event!.markets = _this?.event?.markets?.filter(market => _this?.event?.marketsWhichAreDropped?.includes(market?.name));
        }
        if (_this && _this?.nodeProperties?.eventList) {
          let multiEvent = JSON.parse(_this?.nodeProperties?.eventList);
          if (multiEvent?.racingEvents?.length > 0) {
            const tradingPartitionId = multiEvent?.racingEvents[0]?.tradingPartitionId;
            if (!_this.event) {
              // If undefined, create a new object for event
              _this.event = new Event({ id: '', name: '', tradingPartitionId });
            }
          }
        }
        if (configItem.IsPreviewPostMetod) {
          if (configItem.isPreviewAssetRefactored) {
            targetItemID = JSON.stringify(_this);
            gantryUrl = this.labelSelectorService.getLabelUrls(this.currentLabel) + 'getGantryUrlBasedOnIDNew';
            this.targetNewPreviewAssetUrl.targetItemID = targetItemID;
            this.baseTreeViewService.getPreviewAssetGantryUrlNewModel(gantryUrl, this.targetNewPreviewAssetUrl).subscribe((url: string) => {
              if (url) {
                let updatedUrl = this.preparePreviewUrl(url, isPreviewProd);
                BOMUtilities.openInNewTab(updatedUrl);
              }
            }, (err: string) => {
              console.error(err);
            });
          }
          else {
            targetItemID = JSON.stringify({ event: _this?.event, id: _this?.nodeProperties?.id, isPromotionTreeNode: _this?.nodeProperties?.isPromotionTreeNode, isCarousleNode: _this?.nodeProperties?.isCarousleNode, isMultiEventTreeNode: _this?.nodeProperties?.isMultiEventTreeNode, isMisc: _this?.nodeProperties?.isMisc, targetLink: _this?.nodeProperties?.targetLink, contentItemId: _this?.nodeProperties?.id, isManualTreeNode: _this?.nodeProperties?.isManualTreeNode, targetId: _this?.nodeProperties?.targetId });
            gantryUrl = this.labelSelectorService.getLabelUrls(this.currentLabel) + 'getGantryUrlBasedOnID';
  
            this.targetUrl.targetItemID = targetItemID;
            this.baseTreeViewService.getGantryUrl(gantryUrl, this.targetUrl).subscribe((url: string) => {
              if (url) {
                let updatedUrl = this.preparePreviewUrl(url, isPreviewProd);
                BOMUtilities.openInNewTab(updatedUrl);
              }
            }, (err: string) => {
              console.error(err);
            });
          }
  
  
  
        }
        else {
          gantryUrl = this.labelSelectorService.getLabelUrls(this.currentLabel) + 'getGantryUrlBasedOnTargetId?displayRuleItemId=';
          this.baseTreeViewService.getUrl(gantryUrl, targetItemID).subscribe((url: string) => {
            if (url) {
              let updatedUrl = this.preparePreviewUrl(url, isPreviewProd);
              BOMUtilities.openInNewTab(updatedUrl);
            }
          }, (err: string) => {
            console.error(err);
          });
        }
      }
      
    });
  }

  nodeClick(node: MainTreeNode) {
    this.setNodeInvisible();
    node.nodeProperties.isVisible = true;
  }

  mouseClick(node: MainTreeNode) {
    this.setNodeInvisible();
  }

  private assetEventImageUrl() {
    this.scItemService.getDataFromMasterDB<ScMediaItem>('/sitecore/api/ssc/item?path=/sitecore/media library/Vanilla.Mobile/Display_Manager/leftside_tabs/ellipses')
      .subscribe((logoItem: ScMediaItem) => {
        this.assetImageUrl = logoItem?.ItemMedialUrl;
      });
  }

  changeTab(event: Heirarchies) {
    this.selectedTabName = event.ItemName;
    this.productService.setOverrideOrUserCreatedTab(event.ItemName);
    if (this.selectedTabName.toUpperCase() == this.manualConstants.overrides_tab.toUpperCase()) {
      this.loadOverrides(event)
    }
    else {
      this.loadUserCreated(event)
    }
  }

  overrideNode(node: MainTreeNode) {
    this.overrideServiceService.overrideEvent(node);
  }

  setNodeInvisible() {
    this.treeControl?.dataNodes?.forEach(internalNode => {
      internalNode.nodeProperties.isVisible = false;
    })
  }

}
