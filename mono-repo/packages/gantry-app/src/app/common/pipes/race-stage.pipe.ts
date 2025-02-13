import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'raceStage',
    pure: true,
})
export class RaceStagePipe implements PipeTransform {
    transform(value: string, ApproachingTraps: string): string {
        return value && value[0]?.toLocaleUpperCase() === 'F'
            ? ApproachingTraps
            : value[0]?.toLocaleUpperCase() !== 'O'
              ? value.substring(value.indexOf('[') + 1, value.indexOf(']'))?.toLocaleUpperCase()
              : '';
    }
}
