import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';

@Pipe({
  name: 'marketNameFormat',
  standalone: true
})
export class MarketNameFormatPipe implements PipeTransform {

  transform(marketName: string): string {
    // Normalize spaces and fix "Win or Each Way"
    if (marketName.trim().toLowerCase() === Constants.win_or_each_way.toLowerCase()) {
      return Constants.win_slash_each_way;
    }

    // Handle "Betting without" transformation
    if (marketName.toLowerCase().startsWith(Constants.betting_without)) {
      return Constants.betting_wo;
    }

    return marketName;
  }

}
