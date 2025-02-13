import { Pipe, PipeTransform } from '@angular/core';
import { HorseRacingResultDetails } from '../models/horse-racing-meeting-results.model';

@Pipe({
    name: 'nonRunnerList'
})
export class NonRunnerListPipe implements PipeTransform {

    transform(entries: Array<HorseRacingResultDetails>): string {
        let nonRunnerList = "";
        let count = 0;
        entries?.forEach(horse => {
            nonRunnerList += " " + horse.horseRunnerNumber + ","
            count = count + 1;
            if (count === entries.length) {
                nonRunnerList = nonRunnerList.slice(0, -1).trim();
            }
        });
        return nonRunnerList;
    }

}
