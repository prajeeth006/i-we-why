import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { DynamicComponent } from 'src/app/display-manager/display-manager-right-panel/dynamic-screens-data/dynamic-component';
import { MasterConfigurationService } from 'src/app/display-manager/display-manager-right-panel/master-layout/services/master-configuration.service';
import { GantryType, Profile, ProfileScreen } from 'src/app/display-manager/display-manager-right-panel/profiles/models/profile';
import { AssetDesignService } from 'src/app/display-manager/display-manager-right-panel/services/AssetDesignService/asset-design.service';
import { BOMUtilities } from 'src/app/helpers/bom-utilities';
import { ContextMenuGenerator } from '../../screen-context-menu/screen-context-menu-generator';
import { ProfileConstants } from 'src/app/display-manager/display-manager-right-panel/profiles/constants/profile-constants';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { CarouselService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/carousel-service/carousel.service';
import { Carousel } from 'src/app/display-manager/display-manager-left-panel/carousel/models/carousel';
import { CommonService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { UserActions } from 'src/app/common/services/real-time-updates/models/real-time-logger.model';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';
import { NodeOptions, NodeProperties } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/tree-node.model';
import { StringUtilities } from 'src/app/helpers/string-utilities';
import { ScContextService } from 'src/app/sitecore/sc-context-service/sc-context.service';

@Component({
  selector: 'app-single-screen',
  templateUrl: './single-screen.component.html',
  styleUrls: ['./single-screen.component.scss']
})
export class SingleScreenComponent implements OnInit, DynamicComponent {

  @ViewChild(MatMenuTrigger)
  matMenuTrigger: MatMenuTrigger;

  isScreenActive = false;
  @Input() currentActiveScreen: ProfileScreen;
  @Input() isActiveScreensReset: boolean;


  constructor(
    private masterConfigurationService: MasterConfigurationService,
    private labelSelectorService: LabelSelectorService,
    private assetDesignService: AssetDesignService,
    public carouselService: CarouselService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
  ) { }

  @Input() data: ProfileScreen;
  @Input() selectedProfileValue: string;

  @Input() src: any;
  droppableContent: string;
  currentScreen: string;
  isSkyTv: boolean;
  ellipsisName?: string = "";
  profileConstants = ProfileConstants;
  lowestNoAssetIndicatorImage: any = this.assetDesignService?.assetIcons?.filter(icon => icon.TypeName.toLowerCase() === ProfileConstants.assetIndicator.toLowerCase()).length > 0 ? this.assetDesignService?.assetIcons?.filter(icon => icon.TypeName.toLowerCase() === ProfileConstants.assetIndicator.toLowerCase())[0] : {};
  @Output() onRightClick = new EventEmitter<any>();
  assetType: string | undefined;

  ngOnInit(): void {
    this.data.screenDisplayAssetType = this.data?.NowPlaying?.Asset?.event?.splitScreen?.displayAssetNameOnScreenWhenDragged;
    this.currentScreen = this.data?.Name;
    this.droppableContent = this.data?.Name;
    this.isSkyTv = this.data?.DisplayScreen?.IsSkyTv!
    if (!!this.data.NowPlaying?.Asset && !this.data.NowPlaying?.Asset?.screenTempGuid)
      this.data.NowPlaying.Asset.screenTempGuid = this.createGuid();

    this.checkEventlableLength(this.data?.NowPlaying?.Name, this.data?.NowPlaying?.Name?.length);

    this.carouselService.addOrEditedCarousel$.subscribe((carousel: Carousel) => {

      if (carousel && this.currentScreen == this.carouselService.screenForCarouselData?.Name) {
        const { Id, Name } = carousel;
        let nodeProps: NodeProperties = { id: Id, name: StringUtilities.removeNamePrefix(Name), level: 0, isFolder: false, expandable: false, isPromotionTreeNode: false, isChannelTreeNode: false, isCarousleNode: true };
        let droppedItem: MainTreeNode = new MainTreeNode(nodeProps, {} as NodeOptions);
        // Carousel Create or Edit
        this.onZoneDrop(droppedItem, this.carouselService.screenForCarouselData);
        this.carouselService.setScreenForCarousel(undefined);
      }
    })
  }

  ngOnChanges() {
    this.setScreenActiveStatus();
  }

  checkEventlableLength(eventLablename?: string, eventLabelLength?: number) {
    if (!!eventLablename && eventLabelLength!! > 32) {
      this.ellipsisName = eventLablename;
    }
  }

  setScreenActiveStatus() {
    if (this.currentScreen === this.currentActiveScreen?.Name && this.data?.ScreenNumber === this.currentActiveScreen?.ScreenNumber && this.isActiveScreensReset === false) {
      this.isScreenActive = true;
    } else {
      this.isScreenActive = false;
    }
  }

  /**
   * @desc responsible for handling the zone drop event
   * * Drag & Drop Asset on screen (or) Create/Edit Carousel
   * @param {any} event - the event data specific to the implementation
   */
  public onZoneDrop(droppedItem: any, screen: ProfileScreen | undefined) {
    var profileData: Profile[] = [];
    profileData = this.masterConfigurationService.masterScreensData$.value;
    this.data.screenDisplayAssetType = droppedItem?.event?.splitScreen?.displayAssetNameOnScreenWhenDragged;
    if (!!screen) {
      if (!!droppedItem?.screenTempGuid) {
        profileData.forEach(x => x.GantryTypes.forEach(x =>
          x.AssetTypes.forEach(x =>
            x.Screens.map(y => {
              if (y.NowPlaying?.Asset?.screenTempGuid == droppedItem?.screenTempGuid) {
                y.isDraggedScreenEmpty = true;
                y.screenDisplayAssetType = '';
                y.NowPlaying = null,
                  this.assetDesignService.getAssetImage(y, null);
                return;
              }
            }))))
      }
      if ((!!droppedItem?.nodeProperties?.name && droppedItem?.nodeProperties?.name?.length > 32) || (!!droppedItem?.name && droppedItem?.name?.length > 32)) {
        this.ellipsisName = !!droppedItem?.nodeProperties?.name ? droppedItem?.nodeProperties?.name : droppedItem?.name;
      }
      else {
        this.ellipsisName = "";
      }
      droppedItem.screenTempGuid = this.createGuid();
      screen.NowPlaying = {
        Asset: droppedItem,
        Name: !!droppedItem?.nodeProperties?.name ? droppedItem?.nodeProperties?.name : droppedItem?.name as string,
        ScreenRuleRequest: PrepareScreenRuleRequest.createRuleRequest(this.labelSelectorService.getCurrentLabel(), screen?.ScreenPath, droppedItem, screen?.DisplayScreen?.DecoderID, screen?.IsDisabled)
      }
      this.assetDesignService.getAssetImage(screen, droppedItem);
    }
    var data = profileData?.find(x => x?.Name == this.selectedProfileValue)?.GantryTypes?.find(y => y?.Name == ProfileConstants.master);
    
    const logInfo = {
      userAction: droppedItem?.nodeProperties?.isCarousleNode ? UserActions.CreateOrEditCarousel : UserActions.DragAndDropAsset,
      screenPath: screen?.ScreenPath,
      droppedItem: droppedItem
    }
    this.realTimeUpdatesLoggerService.saveLog(logInfo);

    this.enableSaveReset(data!);
  }

  enableSaveReset(profiles: GantryType) {
    this.masterConfigurationService.enableSaveReset(profiles);
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onRightClickEventScreenWrapper(event: MouseEvent) {
    event.preventDefault();
    if (!this.data?.DisplayScreen?.IsSkyTv) {
      let contextMenuPosition = BOMUtilities.getMousePosition(event);
      let contextMenuItems = ContextMenuGenerator.getRequiredOptions(this.data);
      this.onRightClick.emit({ contextMenuPosition, contextMenuItems, profileScreen: this.data })
    }
  }
}
