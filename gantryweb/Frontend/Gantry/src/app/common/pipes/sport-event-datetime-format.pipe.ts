import { Pipe, PipeTransform } from '@angular/core';
import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { TimeStampOptions } from '../models/time-stamp-options.model';

@Pipe({
  name: 'sportEventDateFormat'
})
export class SportEventDateFormatPipe implements PipeTransform {

  transform(eventDateTime: Date, gantryCommonContent: GantryCommonContent, timeStampOptions?: Intl.DateTimeFormatOptions): string {
    let eventDate: string;
    if (!eventDateTime) {
      return "";
    }
    let finalTimeStampOptions: Intl.DateTimeFormatOptions = timeStampOptions ?? {
      weekday: 'long',
      timeStyle: 'short'
    }
    let todayDate: Date = new Date();
    eventDateTime = new Date(eventDateTime);
    if (eventDateTime?.getDate() - todayDate.getDate() == 0 && eventDateTime?.getMonth() == todayDate.getMonth() && eventDateTime?.getFullYear() == todayDate.getFullYear()) {
      eventDate = this.getTodayAndTomorrowDates(finalTimeStampOptions, eventDateTime, gantryCommonContent?.contentParameters?.Today);
    }
    else if (eventDateTime?.getDate() - todayDate.getDate() == 1 && eventDateTime?.getMonth() == todayDate.getMonth() && eventDateTime?.getFullYear() == todayDate.getFullYear()) {
      eventDate = this.getTodayAndTomorrowDates(finalTimeStampOptions, eventDateTime, gantryCommonContent?.contentParameters?.Tomorrow);
    }
    else {
      eventDate = finalTimeStampOptions.weekday == TimeStampOptions.weekday ? eventDateTime?.toLocaleString('en-us', { timeStyle: finalTimeStampOptions.timeStyle }) : eventDateTime?.toLocaleString('en-us', { weekday: finalTimeStampOptions.weekday }) + " " + eventDateTime?.toLocaleString('en-us', { timeStyle: finalTimeStampOptions.timeStyle })
    }
    return eventDate?.toUpperCase();
  }

  private getTodayAndTomorrowDates(finalTimeStampOptions: Intl.DateTimeFormatOptions, eventDateTime: Date, todayOrTomorrow: string): string {
    let eventDate = finalTimeStampOptions.weekday == TimeStampOptions.weekday ? eventDateTime?.toLocaleString('en-us', { timeStyle: finalTimeStampOptions.timeStyle }) :
      todayOrTomorrow + " " + eventDateTime?.toLocaleString('en-us', { timeStyle: finalTimeStampOptions.timeStyle });
    return eventDate;
  }

}
