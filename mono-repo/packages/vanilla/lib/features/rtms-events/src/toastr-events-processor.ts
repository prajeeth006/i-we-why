import { Injectable, inject } from '@angular/core';

import { EventContext, EventProcessor, EventType, IntlService, ToastrQueueService, ToastrSchedule } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { RtmsEventsConfig } from './rtms-events-processor.client-config';

@Injectable()
export class ToastrEventsProcessor implements EventProcessor {
    private toastrQueueService = inject(ToastrQueueService);
    private config = inject(RtmsEventsConfig);
    private intlService = inject(IntlService);

    async process(event: EventContext<any>) {
        if (event.type !== EventType.Rtms) {
            return;
        }

        await firstValueFrom(this.config.whenReady);

        const toastr = this.config.rtmsEventToToastr[event.name.toLowerCase()];

        if (toastr?.name) {
            const schedule =
                toastr.schedule && Object.values(ToastrSchedule).includes(toastr.schedule as ToastrSchedule)
                    ? (toastr.schedule as ToastrSchedule)
                    : ToastrSchedule.Immediate;

            const placeholders: { [key: string]: string } = {};

            for (const [key, placeholderInfo] of Object.entries(toastr.placeholders || {})) {
                if (placeholderInfo && event.data?.hasOwnProperty(placeholderInfo.propertyName)) {
                    const placeholderValue = event.data[placeholderInfo.propertyName];
                    const parameters = placeholderInfo?.parameters ?? {};

                    placeholders[key] = this.formatPlaceholderValue(placeholderValue, placeholderInfo.format, parameters);
                }
            }

            this.toastrQueueService.add(toastr.name, {
                schedule,
                placeholders,
            });
        }
    }

    private formatPlaceholderValue(value: any, format: string | undefined, parameters: any): string {
        switch (format) {
            case 'number':
                return this.intlService.formatNumber(value, parameters?.digitsInfo);
            case 'currency':
                return this.intlService.formatCurrency(value, parameters?.currencyCode, parameters?.digitsInfo);
            case 'date':
                return this.intlService.formatDate(value, parameters?.dateFormat, parameters?.timezone);
            default:
                return value.toString();
        }
    }
}
