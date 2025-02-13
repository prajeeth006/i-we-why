import { Pipe, PipeTransform } from '@angular/core';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { Event } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/event.model';

@Pipe({
  name: 'presetassetname',
  standalone: true
})
export class PresetAssetNamePipe implements PipeTransform {

  transform(event: Event | null | undefined): string {
    let assetName = '-';
    let timeString = '';

    if (event?.eventName && event?.id != "0") {
      if (event?.categoryCode?.toLowerCase() == FilterRacingCategories.Horses.toLowerCase() || event?.categoryCode?.toLowerCase() == FilterRacingCategories.GreyHounds.toLowerCase()) {
        if (event?.typeName) {
          assetName = ' ' + event?.typeName;
          if (event?.startTime) {
            try {
              var dateFormat = new Date(event?.startTime + " UTC");
              var hour = dateFormat.getUTCHours()?.toString().padStart(2, "0") || "";
              var minute = dateFormat.getUTCMinutes()?.toString().padStart(2, "0") || "";
              timeString = hour + ':' + minute;
            } catch { }
          }
        }
        else {
          return timeString + event?.eventName
        }
      }
      else {
        if (event?.eventName) {
          assetName = ' ' + event?.eventName;
        }
      }
    }
    else {
      return timeString + event?.eventName
    }
    return timeString + assetName;
  }

}
