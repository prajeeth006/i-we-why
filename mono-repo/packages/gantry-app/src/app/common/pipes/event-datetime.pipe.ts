import { formatDate } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { SportContentParameters } from '../models/sport-content/sport-content-parameters.model';
import { TimeStampOptions } from '../models/time-stamp-options.model';

@Injectable({
    providedIn: 'root',
})
@Pipe({
    name: 'eventDatetime',
})
export class EventDatetimePipe implements PipeTransform {
    transform(
        value: string,
        eventDateTime: Date,
        gantryCommonContent: SportContentParameters,
        timeStampOptions?: Intl.DateTimeFormatOptions,
        isGolf: boolean = false,
    ): string {
        let eventDate: string;
        eventDateTime = new Date(eventDateTime);
        if (isGolf) {
            const finalTimeStampOptions: Intl.DateTimeFormatOptions = timeStampOptions ?? {
                weekday: 'long',
                timeStyle: 'short',
            };
            const todayDate: Date = new Date();
            if (
                eventDateTime?.getDate() - todayDate.getDate() == 0 &&
                eventDateTime?.getMonth() == todayDate.getMonth() &&
                eventDateTime?.getFullYear() == todayDate.getFullYear()
            ) {
                eventDate = this.getTodayAndTomorrowDates(
                    finalTimeStampOptions,
                    eventDateTime,
                    gantryCommonContent?.contentParameters ? gantryCommonContent?.contentParameters?.Today : '',
                );
            } else if (
                eventDateTime?.getDate() - todayDate.getDate() == 1 &&
                eventDateTime?.getMonth() == todayDate.getMonth() &&
                eventDateTime?.getFullYear() == todayDate.getFullYear()
            ) {
                eventDate = this.getTodayAndTomorrowDates(
                    finalTimeStampOptions,
                    eventDateTime,
                    gantryCommonContent?.contentParameters ? gantryCommonContent?.contentParameters?.Tomorrow : '',
                );
            } else {
                eventDate = this.getformatDate(eventDate!, eventDateTime);
            }
        } else {
            eventDate = this.getformatDate(eventDate!, eventDateTime);
        }

        return value?.replace('{0}', eventDate)?.toUpperCase();
    }

    private getTodayAndTomorrowDates(finalTimeStampOptions: Intl.DateTimeFormatOptions, eventDateTime: Date, todayOrTomorrow: string): string {
        const eventDate =
            finalTimeStampOptions.weekday == TimeStampOptions.weekday
                ? eventDateTime?.toLocaleString('en-us', { timeStyle: finalTimeStampOptions.timeStyle })
                : todayOrTomorrow;
        return eventDate;
    }

    getformatDate(eventDate: string, eventDateTime: Date): string {
        return (eventDate = formatDate(eventDateTime, 'EEEE d MMMM', 'en_US'));
    }
}
