import { Injectable } from '@angular/core';

import { CookieService } from '../../browser/cookie/cookie.service';
import { DateTimeService } from '../../browser/datetime.service';
import { WorkerType } from '../../web-worker/web-worker.models';
import { WebWorkerService } from '../../web-worker/web-worker.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';
import { DslTimeConverterService } from './time/dsl-time-converter.service';

export const ABSOLUTE_EXPIRATION_BOUNDARY = 946684800; // 2000-01-01; same constant is in server-side service

@Injectable()
export class CounterDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private cookieService: CookieService,
        private dateTimeService: DateTimeService,
        private dslTimeConverter: DslTimeConverterService,
        dslCacheService: DslCacheService,
        webWorkerService: WebWorkerService,
    ) {
        webWorkerService.createWorker(WorkerType.CounterDslValuesProviderInterval, { interval: 1000 }, () =>
            dslCacheService.invalidate(['counter.Get', 'counter.Increment']),
        );
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Counter: this.dslRecorderService
                .createRecordable('counter')
                .createFunction({
                    name: 'Get',
                    get: (name: string) => {
                        const counter = this.cookieService.getObject(name);
                        return counter?.count || 0;
                    },
                    deps: ['counter.Get'],
                })
                .createFunction({
                    name: 'Increment',
                    get: (name: string, expiration: number) => {
                        const counter = this.cookieService.getObject(name);
                        const newCounter = { count: 1, expiration: this.calculatePersistentExpires(expiration) };

                        if (!counter || (counter && this.dateTimeService.now() > new Date(counter.expiration))) {
                            this.cookieService.putRaw(name, JSON.stringify(newCounter), {
                                expires: newCounter.expiration,
                            });
                        } else {
                            counter.count = (counter?.count || 0) + 1;
                            this.cookieService.putRaw(name, JSON.stringify(counter), {
                                expires: counter.expiration,
                            });
                        }
                    },
                    deps: ['counter.Increment'],
                }),
        };
    }

    private calculatePersistentExpires(expiration: number): Date {
        if (expiration <= 0) {
            throw new Error(
                `Expiration must be a positive number but it's ${expiration}. If you want to delete the cookie or set session expiration then use corresponding function.`,
            );
        }

        // So that consumers can specify both relative Time.Days(10) or absolute DateTime.Date(2025, 8, 6)
        let expires: Date;

        if (expiration > ABSOLUTE_EXPIRATION_BOUNDARY) {
            expires = new Date(this.dslTimeConverter.fromDslToTime(expiration).unixMilliseconds);
        } else {
            expires = this.dateTimeService.now();
            expires.setTime(expires.getTime() + this.dslTimeConverter.fromDslToTimeSpan(expiration).totalMilliseconds);
        }

        return expires;
    }
}

export interface Counter {
    count: number;
    expiration: Date;
}
