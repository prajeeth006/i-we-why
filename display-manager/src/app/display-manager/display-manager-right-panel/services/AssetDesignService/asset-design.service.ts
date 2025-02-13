import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { ScreenRuleRequest } from '../../display-manager-screens/models/display-screen-rule.model';
import { DroppedItem } from '../../display-manager-screens/models/display-screen.model';
import { AssetIcon } from '../../models/AssetIcon';
import { ProfileScreen } from '../../profiles/models/profile';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';

@Injectable({
  providedIn: 'root'
})
export class AssetDesignService {


  assetIcons: Array<AssetIcon> = [];

  constructor(
    private labelSelectorService: LabelSelectorService,
    private apiService: ApiService) {

    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.getAssetIcons(currentLabel).subscribe((assetIcons: Array<AssetIcon>) => {
        this.assetIcons = assetIcons;
      });
    });

  }

  getAssetIcons(currentLabel: string): Observable<AssetIcon[]> {
    let params = new HttpParams().append('currentLabel', currentLabel);
    return this.apiService.get('/sitecore/api/displayManager/assetIcons/GetAssetIcons', params);
  }

  public getAssetType(screenRuleRequest: ScreenRuleRequest | undefined, droppedItem: MainTreeNode | DroppedItem | null) {


    if (screenRuleRequest?.isMultiEventTreeNode) {
      if (droppedItem?.nodeProperties?.eventList) {
        let multiEvent = JSON.parse(droppedItem?.nodeProperties?.eventList);
        if (multiEvent?.racingEvents?.length > 0) {
          if (multiEvent?.racingEvents[0].categoryCode?.toUpperCase() == FilterRacingCategories.Horses.toUpperCase() &&
            screenRuleRequest?.isMultiEventTreeNode) {
            return AssetTypes.HorseRacingMultiEvent;
          }

          if (multiEvent?.racingEvents[0].categoryCode?.toUpperCase() == FilterRacingCategories.GreyHounds.toUpperCase() &&
            screenRuleRequest?.isMultiEventTreeNode) {
            return AssetTypes.GreyhoundsMultiEvent;
          }

          return AssetTypes.SportsMultiEvent;
        }
      }
    }

    if (screenRuleRequest?.racingEvent != null && (screenRuleRequest?.racingEvent?.id != "0" || screenRuleRequest?.racingEvent?.typeId != 0)) {
      if (screenRuleRequest?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.Horses.toUpperCase() &&
        screenRuleRequest?.racingEvent.isMeetingPages == true) {
        return AssetTypes.HorseMeetingResult;
      }
      if (screenRuleRequest?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.GreyHounds.toUpperCase() &&
        screenRuleRequest?.racingEvent.isMeetingPages == true) {
        return AssetTypes.GreyhoundsMeetingResult;
      }

      if (screenRuleRequest?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.Horses.toUpperCase() || screenRuleRequest?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.GreyHounds.toUpperCase())
        return AssetTypes.Racing;

      return AssetTypes.Sports;
    }

    if (screenRuleRequest?.isPromotionTreeNode)
      return AssetTypes.Promotion;

    if (screenRuleRequest?.isCarouselTreeNode)
      return AssetTypes.Carousel;

    if (screenRuleRequest?.isSkyChannelTreeNode)
      return AssetTypes.Sky;
    if (screenRuleRequest?.isManualTreeNode)
      return AssetTypes.ManualCreateTemplate;

    if (screenRuleRequest?.assetType)
      return screenRuleRequest?.assetType;

    return null;
  }

  public getPriorityImage(screenRuleRequest: ScreenRuleRequest | undefined, droppedItem: MainTreeNode | DroppedItem | null): AssetIcon | undefined {

    let assetIcon: AssetIcon | undefined = new AssetIcon();
    let assetType = this.getAssetType(screenRuleRequest, droppedItem);
    if (screenRuleRequest) {
      screenRuleRequest.assetType = assetType as string
    }
    switch (assetType) {
      case AssetTypes.Racing:

        if (droppedItem?.event?.virtual == true)
          assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Virtuals?.toLowerCase());
        else
          assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == droppedItem?.event?.categoryCode?.toLowerCase());

        assetIcon ??= this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Racing?.toLowerCase());

        break;
      case AssetTypes.Sports:
        assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == droppedItem?.event?.categoryCode?.toLowerCase());
        assetIcon ??= this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Sports?.toLowerCase());
        break;

      case AssetTypes.Promotion:
        assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Promotion?.toLowerCase());
        assetIcon ??= this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Marketing?.toLowerCase());
        break;

      case AssetTypes.ManualCreateTemplate:
        assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.ManualCreateTemplate?.toLowerCase());
        break;

      default:
        assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == assetType?.toLowerCase());
        break;
    }

    return assetIcon;

  }

  public getAssetImage(screen: ProfileScreen, droppedItem: MainTreeNode | DroppedItem | null) {

    let defaultAsset = this.assetIcons.find(x => x.Name?.toLowerCase() == 'default');
    let screenAsset = this.assetIcons.find(x => x.Name?.toLowerCase() == screen?.AssetType?.toLowerCase());

    let image = screen?.IsDisabled == true ? screenAsset?.PlaceholderDisabledIcon : screenAsset?.PlaceholderIcon;

    if (screen && screen.ScreenDesign) {

      screen.ScreenDesign.ScreenBorderColor = screen?.IsDisabled == true ? defaultAsset?.ScreenBorderColor as string : screenAsset?.ScreenBorderColor as string;
      screen.ScreenDesign.ScreenBackgroundColor = screen?.IsDisabled == true || screen?.NowPlaying == null ? defaultAsset?.ScreenBackgroundColor as string : screenAsset?.ScreenBackgroundColor as string;
      screen.ScreenDesign.Image = image as string;
      screen.ScreenDesign.AssetColor = undefined;

      if (screen?.NowPlaying) {
        let priorityAsset = this.getPriorityImage(screen?.NowPlaying?.ScreenRuleRequest, droppedItem);

        if (!priorityAsset) {
          priorityAsset = defaultAsset;
        }

        screen.ScreenDesign.AssetColor = screen?.IsDisabled == true ? defaultAsset?.AssetColor as string : priorityAsset?.AssetColor as string;
        screen.ScreenDesign.Image = screen?.IsDisabled == true ? priorityAsset?.AssetDisabledIcon as string : priorityAsset?.AssetActiveIcon as string;
      }

    }
  }

  public getAssetImageForDroppedItem(droppedItem: MainTreeNode | DroppedItem) {
    let defaultAsset = this.assetIcons.find(x => x.Name?.toLowerCase() == 'default');
    let ruleRequest = PrepareScreenRuleRequest.createRuleRequest(this.labelSelectorService.getCurrentLabel(), '', droppedItem, '', false);
    let assetImage = this.getPriorityImage(ruleRequest, droppedItem);
    return assetImage ?? defaultAsset;
  }

}
