import { Injectable } from '@angular/core';

import { TimeSpan } from '../../../time/time-span';
import { DslRecorderService } from '../../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../../dsl.models';
import { DslTimeConverterService } from './dsl-time-converter.service';

@Injectable()
export class TimeDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private dslTimeConverter: DslTimeConverterService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('time');
        const convert = this.dslTimeConverter.fromTimeSpanToDsl;

        create('Seconds', TimeSpan.fromSeconds);
        create('Minutes', TimeSpan.fromMinutes);
        create('Hours', TimeSpan.fromHours);
        create('Days', TimeSpan.fromDays);
        create('Weeks', (x) => TimeSpan.fromDays(x * 7));
        create('Years', (x) => TimeSpan.fromDays(x * 365));

        return { Time: recordable };

        function create(name: string, parseValue: (value: number) => TimeSpan) {
            recordable.createFunction({
                name,
                get: (value: number) => {
                    const timeSpan = parseValue(value);
                    return convert(timeSpan);
                },
            });
        }
    }
}
