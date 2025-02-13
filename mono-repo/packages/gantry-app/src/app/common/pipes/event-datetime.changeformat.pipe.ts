import { Pipe, PipeTransform } from '@angular/core';

import { StringHelper } from '../helpers/string.helper';

@Pipe({
    name: 'eventDatetimeChangeformat',
})
export class EventDatetimeChangeformatPipe implements PipeTransform {
    transform(eventDateTime: Date): string {
        const eventStartTime = eventDateTime ? StringHelper.getBtcTime(eventDateTime) : '';
        return eventStartTime;
    }
}
