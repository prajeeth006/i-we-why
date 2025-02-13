import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true
})
export class RangePipe implements PipeTransform {

  transform(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }

}
