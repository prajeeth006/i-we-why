import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'racingPostTipPipe',
})
export class RacingPostTipPipe implements PipeTransform {
    transform(value: string[], napOrNb: string): string {
        const postTipOrder = [...value];
        let racingPostTipString = postTipOrder?.toString()?.replaceAll(',', '-');
        if (napOrNb) {
            racingPostTipString += ` ${napOrNb}`;
        }

        return racingPostTipString;
    }
}
