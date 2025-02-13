import { Injectable } from '@angular/core';

import { ClockService } from '../../../time/clock.service';
import { TimeSpan } from '../../../time/time-span';
import { WorkerType } from '../../../web-worker/web-worker.models';
import { WebWorkerService } from '../../../web-worker/web-worker.service';
import { DslCacheService } from '../../dsl-cache.service';
import { DslRecorderService } from '../../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../../dsl.models';
import { DateTimeDslCalculatorService } from './datetime-dsl-calculator.service';

const DEPENDENCIES = ['datetime'];

@Injectable()
export class DateTimeDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private clock: ClockService,
        private calculator: DateTimeDslCalculatorService,
        dslCacheService: DslCacheService,
        webWorkerService: WebWorkerService,
    ) {
        webWorkerService.createWorker(WorkerType.DateTimeDslValuesProviderInterval, { interval: 2000 }, () =>
            dslCacheService.invalidate(DEPENDENCIES),
        );
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('datetime');

        createProperty('Now', () => this.calculator.getTime(this.clock.userLocalNow));
        createProperty('UtcNow', () => this.calculator.getTime(this.clock.utcNow));
        createProperty('Today', () => this.calculator.getDate(this.clock.userLocalNow));
        createProperty('UtcToday', () => this.calculator.getDate(this.clock.utcNow));
        createProperty('TimeOfDay', () => this.calculator.getTimeOfDay(this.clock.userLocalNow));
        createProperty('UtcTimeOfDay', () => this.calculator.getTimeOfDay(this.clock.utcNow));
        createProperty('DayOfWeek', () => this.calculator.getDayOfWeek(this.clock.userLocalNow));
        createProperty('UtcDayOfWeek', () => this.calculator.getDayOfWeek(this.clock.utcNow));

        createFunction('DateTime', (year, month, day, hour, minute) =>
            this.calculator.createTime(year, month, day, hour, minute, this.clock.userTimeZoneOffset),
        );
        createFunction('UtcDateTime', (year, month, day, hour, minute) => {
            if (isNaN(year)) {
                const date = new Date(year);
                return this.calculator.createTime(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDay(),
                    date.getUTCHours(),
                    date.getUTCMinutes(),
                    TimeSpan.ZERO,
                );
            }

            return this.calculator.createTime(year, month, day, hour, minute, TimeSpan.ZERO);
        });
        createFunction('Date', (year, month, day) => this.calculator.createTime(year, month, day, 0, 0, this.clock.userTimeZoneOffset));
        createFunction('UtcDate', (year, month, day) => this.calculator.createTime(year, month, day, 0, 0, TimeSpan.ZERO));
        createFunction('Time', (hour, minute) => this.calculator.createTimeOfDay(hour, minute));

        return { DateTime: recordable };

        function createProperty(name: string, get: () => number | string) {
            recordable.createProperty({ name, get, deps: DEPENDENCIES });
        }

        function createFunction(name: string, get: (...args: any[]) => number) {
            recordable.createFunction({ name, get });
        }
    }
}
