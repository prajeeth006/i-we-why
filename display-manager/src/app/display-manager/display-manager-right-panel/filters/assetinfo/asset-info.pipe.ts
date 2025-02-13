import { Pipe, PipeTransform } from '@angular/core';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { ScreenInfo } from '../../individual-layout/models/individual-gantry-screens.model';

@Pipe({
  name: 'assetInfo',
  standalone: true,
  pure: false
})
export class AssetInfoPipe implements PipeTransform {

  emptyAssetIcon = "/-/media/Vanilla,-d-,Mobile/Display_Manager/rightside_tabs/config/placeholder_icons/default_placeholder.svg";
  transform(screenInfo?: ScreenInfo, isReadOnly?: boolean, options?: {IsName?: boolean, IsTooltipName?: boolean, IsAssetImage?: boolean, IsAssetColor?: boolean, IsScreenBorderColor?: boolean}): string {

    // Name pipe transformation
    if(options?.IsTooltipName || options?.IsName){
      let assetObject = screenInfo?.NowPlaying;
      if(!isReadOnly)   
        if(screenInfo?.IsTouched) 
          assetObject = screenInfo?.NewAssetToSave?.AssetToSave;
        
      let assetName = '', timeString = '';

      if(assetObject?.AssetType == AssetTypes.Horses || assetObject?.AssetType == AssetTypes.GreyHounds){
  
        if(assetObject?.RacingEvent?.typeName){
          assetName = assetObject?.RacingEvent?.typeName;
          if(assetObject?.RacingEvent?.startTime){
            try {
              var d1 = new Date(assetObject?.RacingEvent?.startTime + " UTC");
              var minute = d1.getUTCMinutes();
              var hour = d1.getUTCHours();
              timeString = ' ' + this.pad(hour) + ':' + this.pad(minute);
            } catch { }
          }
        }
      } else if(assetObject?.AssetType == AssetTypes.HorseMeetingResult || assetObject?.AssetType == AssetTypes.GreyhoundsMeetingResult){
          assetName = assetObject?.RacingEvent?.name ?? '';
      } else if(assetObject?.AssetType == AssetTypes.Sports){
          assetName = assetObject?.RacingEvent?.eventName ?? '';
      } else {
        assetName = assetObject?.Name ?? '';
    }

  
      if(options?.IsTooltipName){
        if(assetName?.length < 32)
          return '';
      else
          return assetName + timeString;
      }
      if(assetName?.length > 32){
        assetName = assetName.substring(0,29) + '...'
      }
  
      return assetName + timeString;
    }
    else {
      let assetDesign = screenInfo?.AssetDesign;
        if(!isReadOnly)   
          if(screenInfo?.IsTouched) 
            assetDesign = screenInfo?.NewAssetToSave?.AssetDesign;

      if(options?.IsAssetImage){
        return assetDesign?.Image ?? this.emptyAssetIcon;
      }
      else if(options?.IsAssetColor){
        return assetDesign?.AssetColor ?? '';
      }
      else if(options?.IsScreenBorderColor){
        return assetDesign?.ScreenBorderColor ?? '';
      }
    }
    
    
    return '';

  }

  pad(n: number) {
    return (n < 10) ? ("0" + n) : n;
  } 

}
