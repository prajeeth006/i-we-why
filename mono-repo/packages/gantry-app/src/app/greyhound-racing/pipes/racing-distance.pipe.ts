import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'racingDistanceTransform',
})
export class RacingDistanceTransform implements PipeTransform {
    transform(distance: string): string {
        if (distance) {
            return distance?.toLowerCase()?.replace('m', '') + ' ' + 'MTRS';
        }
        return distance;
    }
}
