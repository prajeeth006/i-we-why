import { Injectable, NgZone, inject } from '@angular/core';

import { CookieOptions } from '../../browser/cookie/cookie.models';
import { CookieService } from '../../browser/cookie/cookie.service';
import { DateTimeService } from '../../browser/datetime.service';
import { WINDOW } from '../../browser/window/window.token';
import { WorkerType } from '../../web-worker/web-worker.models';
import { WebWorkerService } from '../../web-worker/web-worker.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';
import { DslTimeConverterService } from './time/dsl-time-converter.service';

export const ABSOLUTE_EXPIRATION_BOUNDARY = 946684800; // 2000-01-01; same constant is in server-side service

@Injectable()
export class CookieDslValuesProvider implements DslValuesProvider {
    private cookieSnapshot: string;
    private cookieValues: any;

    readonly #window = inject(WINDOW);

    constructor(
        private dslRecorderService: DslRecorderService,
        private cookieService: CookieService,
        private dateTimeService: DateTimeService,
        private dslTimeConverter: DslTimeConverterService,
        dslCacheService: DslCacheService,
        webWorkerService: WebWorkerService,
        zone: NgZone,
    ) {
        this.cookieSnapshot = this.#window.document.cookie;
        this.cookieValues = this.cookieService.getAll();

        webWorkerService.createWorker(WorkerType.CookieDslValuesProviderInterval, { interval: 100 }, () => {
            if (this.cookieSnapshot !== this.#window.document.cookie) {
                const currentValues = this.cookieService.getAll();

                const changed = Object.keys(this.cookieValues)
                    .filter((k) => !currentValues.hasOwnProperty(k))
                    .concat(Object.keys(currentValues).filter((k) => currentValues[k] !== this.cookieValues[k]));

                zone.run(() => dslCacheService.invalidate(changed.map((c) => `cookie.Get.${c}`)));

                this.cookieSnapshot = this.#window.document.cookie;
                this.cookieValues = currentValues;
            }
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Cookies: this.dslRecorderService
                .createRecordable('cookie')
                .createFunction({
                    name: 'Get',
                    get: (name: string) => this.cookieService.get(name) || '',
                    deps: [{ key: 'cookie.Get', args: 1 }],
                })
                .createAction({
                    name: 'SetSession',
                    fn: (name: string, value: string) => this.cookieService.put(name, value),
                })
                .createAction({
                    name: 'SetPersistent',
                    fn: (name: string, value: string, expiration: number) =>
                        this.cookieService.putRaw(name, value, {
                            expires: this.calculatePersistentExpires(expiration),
                        }),
                })
                .createAction({
                    name: 'Delete',
                    fn: (name: string) => this.cookieService.remove(name),
                })
                .createAction({
                    name: 'Set',
                    fn: (name: string, value: string, expiration: number, httpOnly: boolean, domain: string, path: string) => {
                        const options: CookieOptions = {
                            domain,
                            path,
                            httpOnly,
                        };

                        if (expiration < 0) {
                            this.cookieService.remove(name, options);
                        } else if (expiration === 0) {
                            this.cookieService.put(name, value, options);
                        } else {
                            options.expires = this.calculatePersistentExpires(expiration);
                            this.cookieService.put(name, value, options);
                        }
                    },
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
