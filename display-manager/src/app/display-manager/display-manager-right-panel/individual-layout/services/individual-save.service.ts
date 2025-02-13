import { effect, inject, Injectable, signal } from '@angular/core';
import { GantryLayout, SaveAsset, SaveGantryAsset, ScreenData, ScreenInfo, SortedScreensData } from '../models/individual-gantry-screens.model';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { AssetIcon } from '../../models/AssetIcon';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { ApiService } from 'src/app/common/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AssetDesign } from '../../profiles/models/profile';
import { IndividualAssetDesignService } from './individual-asset-design.service';
import { IndividualScreenAsset } from '../models/individual-asset.model';
import { DragService } from 'src/app/common/drag-and-drop/drag.service';
import { IndividualConfigurationService } from './individual-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class IndividualSaveService {

  assetIcons: Array<AssetIcon> = [];

  private individualConfigurationService = inject(IndividualConfigurationService);
  
  constructor(
      private labelSelectorService: LabelSelectorService, private individualAssetDesignService: IndividualAssetDesignService,
          private apiService: ApiService, private dragService: DragService) {
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.getAssetIcons(currentLabel).subscribe((assetIcons: Array<AssetIcon>) => {
        this.assetIcons = assetIcons;
      });
    });

    effect(() => {
      this.individualConfigurationService._gantryLayouts();
    })

   }

   
  getAssetIcons(currentLabel: string): Observable<AssetIcon[]> {
    let params = new HttpParams().append('currentLabel', currentLabel);
    return this.apiService.get('/sitecore/api/displayManager/assetIcons/GetAssetIcons', params);
  }


  public onZoneDrop(droppedItem: IndividualScreenAsset | any, data: ScreenData | undefined, screenInfo: ScreenInfo | undefined) {

    this.dragService.draggingAsset.NewAssetToSave = null;
    this.dragService.draggingAsset.IsTouched = true;

    if(screenInfo){
      let assetToSaveObj: IndividualScreenAsset;
      if (!!droppedItem?.hasOwnProperty('nodeProperties') ) {
        let droppedItemToSave = droppedItem.nodeProperties;
        droppedItemToSave.racingEvent = droppedItem.event;
        assetToSaveObj = this.prepareObject(droppedItemToSave, data, screenInfo);
      } else {
        assetToSaveObj = droppedItem?.NewAssetToSave ? droppedItem?.NewAssetToSave.AssetToSave : droppedItem?.NowPlaying;
      }

      screenInfo.IsTouched = true;
      screenInfo.NewAssetToSave = {
        AssetToSave : assetToSaveObj,
        AssetDesign: this.individualAssetDesignService.getAssetDesign(screenInfo, assetToSaveObj),
      }
    }
    this.individualConfigurationService.gantryLayoutTouched();
  }

  private prepareObject(droppedItemToSave: any, data: ScreenData | undefined, screenInfo: ScreenInfo | undefined){

    let obj: IndividualScreenAsset;
    let assetType = this.individualAssetDesignService.getAssetType(droppedItemToSave);

    obj = {
      Name : droppedItemToSave.name,
      AssetType : assetType,
      ContentMediaType : droppedItemToSave.ContentMediaType,
      ContentProvider : droppedItemToSave.ContentProvider, 
    }
    
    switch(assetType){
      case AssetTypes.Horses :
        obj.RacingEvent = droppedItemToSave.racingEvent;
        obj.RacingAssetType = droppedItemToSave.assetType;
        obj.SplitScreen = droppedItemToSave.racingEvent.splitScreen;
        obj.IsVirtual = droppedItemToSave.racingEvent?.virtual;
        obj.Target = droppedItemToSave.racingEvent?.targetLink;
            break;
      case AssetTypes.HorseMeetingResult :
        obj.RacingEvent = droppedItemToSave.racingEvent;
        obj.TypeId = droppedItemToSave.racingEvent?.typeId;
        obj.Target = droppedItemToSave.racingEvent?.targetLink;
            break;
      case AssetTypes.HorseRacingMultiEvent :
        obj.ContentItemId = droppedItemToSave.nodeId;
        obj.Target = droppedItemToSave.id;
            break;

      case AssetTypes.GreyHounds :
        obj.RacingEvent = droppedItemToSave.racingEvent;
        obj.RacingAssetType = droppedItemToSave.assetType;
        obj.SplitScreen = droppedItemToSave.racingEvent.splitScreen;
        obj.IsVirtual = droppedItemToSave.racingEvent?.virtual;
        obj.Target = droppedItemToSave.racingEvent?.targetLink;
            break;
      case AssetTypes.GreyhoundsMeetingResult :
        obj.RacingEvent = droppedItemToSave.racingEvent;
        obj.TypeId = droppedItemToSave.racingEvent?.typeId;
        obj.Target = droppedItemToSave.racingEvent?.targetLink;
        break;
      case AssetTypes.GreyhoundsMultiEvent :
        obj.ContentItemId = droppedItemToSave.nodeId;
        obj.Target = droppedItemToSave.id;
            break;

      case AssetTypes.Sports :
        obj.RacingEvent = droppedItemToSave.racingEvent;
        obj.Target = droppedItemToSave.racingEvent?.targetLink;
        obj.TradingPartitionId = droppedItemToSave.racingEvent?.tradingPartitionId;
            break;
      case AssetTypes.SportsMultiEvent :
        obj.ContentItemId = droppedItemToSave.nodeId;
        obj.Target = droppedItemToSave.id;
            break;
            
      case AssetTypes.Promotion :
        obj.Target = droppedItemToSave.id;
            break;
      case AssetTypes.Carousel :
        obj.Target = droppedItemToSave.nodeId;
            break;
      case AssetTypes.Sky :
        obj.DecoderId = screenInfo?.DecoderId;
        obj.Target = droppedItemToSave.nodeId;
            break;
      case AssetTypes.ManualCreateTemplate :
        obj.ContentItemId = droppedItemToSave.id;
        obj.Target = droppedItemToSave.targetId;
            break;
      default :
      obj.Target = droppedItemToSave.targetLink;
            break;
    }

    return obj;
  }

  save(label: string) {

    let saveAssets: SaveGantryAsset[] = [];
    this.individualConfigurationService._gantryLayouts().forEach(gantryLayout => {
        [gantryLayout.GantryType.SortedGantryScreenData, gantryLayout.GantryType.SortedPeripheralScreenData].forEach((sortedScreens: SortedScreensData) => {
          sortedScreens.rows.forEach(row => {
            row.columns.forEach(col => {
              let layoutScreens: SaveAsset[] = [];
              if(!!col.screens){
              col.screens.forEach(subScreen => {
                let screenDetails = this.individualConfigurationService.GetScreenDetails(subScreen);
                screenDetails.forEach( screen => {
                  if(screen.IsTouched){
                    console.log(gantryLayout.GantryType.Name, screen);
                    if(screen.NewAssetToSave && screen.ScreenPath)
                      layoutScreens.push({screenAsset: screen.NewAssetToSave?.AssetToSave, screenPath: screen.ScreenPath});
                    else 
                      console.log('Skipping because no asset or screenpath', screen.NewAssetToSave, screen.ScreenPath);
                  }
                })
                if(layoutScreens.length > 0)
                  saveAssets.push({ 
                    gantryType: gantryLayout.GantryType.Name, 
                    screenAssets: layoutScreens,
                    mappingPath: subScreen.MappingPath, 
                    screenLayout: subScreen.ScreenType
                  });
                });
              }
            })
          });
        });
    });

    console.log(saveAssets);

    if(saveAssets.length > 0){
      let params = new HttpParams().append('label', label);
      this.apiService.post('/sitecore/api/displayManager/individualGantryType/SaveScreenAssets', {SaveGantryAssets: saveAssets}, params).subscribe((data) => {
        console.log(data);
        this.individualConfigurationService.getAllIndividualTabGantryLayoutTypeDetails();
      });
    }

  }

}
