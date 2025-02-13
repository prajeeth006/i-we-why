import { Pipe, PipeTransform } from '@angular/core';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { PresentAsset } from '../../profiles/models/profile';
import { Event } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/event.model';

@Pipe({
  name: 'assetname'
})
export class AssetnamePipe implements PipeTransform {

  transform(nowPlayingItem: PresentAsset|null | undefined): string {
    let assetName = '-';
    let timeString = '';
    let event: Event | undefined;
    if(nowPlayingItem?.Asset || nowPlayingItem?.ScreenRuleRequest){
      if(nowPlayingItem?.Asset){
        event = nowPlayingItem?.Asset?.event;
      }else if(nowPlayingItem?.ScreenRuleRequest){
        event = nowPlayingItem?.ScreenRuleRequest?.racingEvent;
      }
    }
    if(event && event?.id != "0"){
      if(event?.categoryCode?.toLowerCase() == FilterRacingCategories.Horses.toLowerCase() || event?.categoryCode?.toLowerCase() == FilterRacingCategories.GreyHounds.toLowerCase()){
        if(event?.typeName){
          assetName = event?.typeName;
          if(event?.startTime){
            try {
              var d1 = new Date(event?.startTime + " UTC");
              var minute = d1.getUTCMinutes();
              var hour = d1.getUTCHours();
              timeString = ' ' + this.pad(hour) + ':' + this.pad(minute);
            } catch { }
          }
        }
      }
      else{
        if(event?.eventName){
          assetName = event?.eventName;
        }
      }
    }
    else{
      if(nowPlayingItem?.Name){
        assetName = nowPlayingItem?.Name;
      }
    }

    if(assetName?.length > 32){
      assetName = assetName.substring(0,29) + '...'
    }
    return assetName + timeString;
  }

  pad(n: number) {
      return (n < 10) ? ("0" + n) : n;
  }
}
