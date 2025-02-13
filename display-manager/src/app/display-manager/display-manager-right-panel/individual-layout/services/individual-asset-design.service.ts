import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';
import { DroppedItem } from '../../display-manager-screens/models/display-screen.model';
import { AssetIcon } from '../../models/AssetIcon';
import { AssetDesign } from '../../profiles/models/profile';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';

@Injectable({
  providedIn: 'root'
})
export class IndividualAssetDesignService {


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



  public getAssetType(droppedItem: any) {
  
    if (droppedItem?.isMultiEventTreeNode) {
      if (droppedItem?.eventList) {
        let multiEvent = JSON.parse(droppedItem?.eventList);
        if (multiEvent?.racingEvents?.length > 0) {
          if (multiEvent?.racingEvents[0].categoryCode?.toUpperCase() == FilterRacingCategories.Horses.toUpperCase() &&
          droppedItem?.isMultiEventTreeNode) {
            return AssetTypes.HorseRacingMultiEvent;
          }

          if (multiEvent?.racingEvents[0].categoryCode?.toUpperCase() == FilterRacingCategories.GreyHounds.toUpperCase() &&
          droppedItem?.isMultiEventTreeNode) {
            return AssetTypes.GreyhoundsMultiEvent;
          }

          return AssetTypes.SportsMultiEvent;
        }
      }
    }

    if (droppedItem?.racingEvent != null && (droppedItem?.racingEvent?.id != "0" || droppedItem?.racingEvent?.typeId != 0)) {
      if (droppedItem?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.Horses.toUpperCase() &&
      droppedItem?.racingEvent.isMeetingPages == true) {
        return AssetTypes.HorseMeetingResult;
      }
      if (droppedItem?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.GreyHounds.toUpperCase() &&
      droppedItem?.racingEvent.isMeetingPages == true) {
        return AssetTypes.GreyhoundsMeetingResult;
      }

      if (droppedItem?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.Horses.toUpperCase())
        return AssetTypes.Horses;
      else if(droppedItem?.racingEvent.categoryCode?.toUpperCase() == FilterRacingCategories.GreyHounds.toUpperCase())
        return AssetTypes.GreyHounds;

      return AssetTypes.Sports;
    }

    if (droppedItem?.isPromotionTreeNode)
      return AssetTypes.Promotion;

    if (droppedItem?.isCarousleNode)
      return AssetTypes.Carousel;

    if (droppedItem?.isSkyChannelTreeNode)
      return AssetTypes.Sky;
    if (droppedItem?.isManualTreeNode)
      return AssetTypes.ManualCreateTemplate;

    if (droppedItem?.assetType)
      return droppedItem?.assetType;

    return null;
  }


   public getPriorityImage(displayItem: any): AssetIcon | undefined {
  
      let assetIcon: AssetIcon | undefined = new AssetIcon();
      
      switch (displayItem.AssetType) {
        case AssetTypes.Horses:
        case AssetTypes.GreyHounds:
  
          if (displayItem?.IsVirtual == true)
            assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Virtuals?.toLowerCase());
          else
            assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == displayItem?.RacingEvent?.categoryCode?.toLowerCase());
  
          assetIcon ??= this.assetIcons.find(x => x.Name?.toLowerCase() == AssetTypes.Racing?.toLowerCase());
  
          break;
        case AssetTypes.Sports:
          assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == displayItem?.RacingEvent?.categoryCode?.toLowerCase());
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
          assetIcon = this.assetIcons.find(x => x.Name?.toLowerCase() == displayItem.AssetType?.toLowerCase());
          break;
      }
  
      return assetIcon;
  
  }


  public getAssetDesign(screenInfo: any, assetToSaveObj: any) {
  
    let defaultAsset = this.assetIcons.find(x => x.Name?.toLowerCase() == 'default');
    let screenAsset = this.assetIcons.find(x => x.Name?.toLowerCase() == assetToSaveObj.AssetType?.toLowerCase());
    
    let assetDesign: AssetDesign = {
      ScreenBorderColor : screenAsset?.ScreenBorderColor as string,
      ScreenBackgroundColor : screenAsset?.ScreenBackgroundColor as string,
      Image : screenAsset?.PlaceholderIcon as string,
      AssetColor : undefined,
      TextColor: screenInfo?.AssetDesign?.TextColor
    }
  
    if (assetToSaveObj) {
      let priorityAsset = this.getPriorityImage(assetToSaveObj);

      if (!priorityAsset) {
        priorityAsset = defaultAsset;
      }

      assetDesign.AssetColor = priorityAsset?.AssetColor as string;
      assetDesign.ScreenBorderColor = priorityAsset?.AssetColor as string;
      assetDesign.Image = priorityAsset?.AssetActiveIcon as string;
    }

    return assetDesign;
  }

}
