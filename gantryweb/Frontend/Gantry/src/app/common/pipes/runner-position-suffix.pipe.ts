import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runnerPositionSuffix'
})
export class RunnerPositionSuffixPipe implements PipeTransform {

  transform(value: string): string {
    switch (+value) {
      case 1:
        return value + 'st';
      case 2:
        return value + 'nd';
      case 3:
        return value + 'rd';
      default:
        return value + 'th';
    }
  }

}
