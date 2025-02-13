import { Pipe, PipeTransform } from '@angular/core';
import { StringUtilities } from 'src/app/helpers/string-utilities';

import { Event, Market } from "../../tree-view/models/event.model";

@Pipe({
  name: 'carouselItemName'
})
export class CarouselItemNamePipe implements PipeTransform {

  transform(event: Event | undefined, targetItemName: string | undefined): string {
    let carouselItemName = '';

    if(event && event?.name){
      let getHours = new Date(event?.startTime!).getHours();
      let getMinutes = new Date(event?.startTime!).getMinutes();
      carouselItemName = event?.eventName ?(((getHours<10?'0':'')+getHours)+':'+((getMinutes<10?'0':'')+getMinutes) +" "+ event?.eventName) :'' ;
    }
    
    if(carouselItemName == ''){
      carouselItemName = StringUtilities.removeNamePrefix(targetItemName);
    }

    //TODO: Have to enable if still market names required to display in Item name

    // event?.markets?.forEach((market: Market, index: number) => {
    //   carouselItemName += ' - ';
    //   if(index + 1 === event?.markets?.length){
    //     carouselItemName += market.name;
    //    } else {
    //     carouselItemName += market.name +" + " ;
    //    }
    // });
    return carouselItemName;
  }

}
