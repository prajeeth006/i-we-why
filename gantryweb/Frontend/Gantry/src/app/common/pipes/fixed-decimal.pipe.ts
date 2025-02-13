import { Pipe, PipeTransform } from '@angular/core';
import { StringHelper } from '../helpers/string.helper';

@Pipe({
  name: 'fixedDecimal'
})
export class FixedDecimalPipe implements PipeTransform {

  transform(stringToModify: string): string {
    if (!!stringToModify) {
      stringToModify = StringHelper.checkToteResults(stringToModify)
      return stringToModify;
    }
  }

}
