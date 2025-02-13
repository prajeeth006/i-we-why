import { Injectable, inject } from '@angular/core';

import {
    CookieName,
    CookieService,
    LocalStoreKey,
    LocalStoreService,
    Logger,
    MenuContentItem,
    SharedFeaturesApiService,
    TimerService,
    TrackingServiceProvider,
    TriggerEventPromiseResult,
    WINDOW,
    WebAnalyticsEventType,
    WebAnalyticsEvents,
    WebWorkerService,
    WindowEvent,
    WorkerType,
} from '@frontend/vanilla/core';
import { isObject, mapKeys, pickBy } from 'lodash-es';

import { TrackingValueGettersService } from './tracking-value-getters.service';
import { TrackingConfig } from './tracking.client-config';
import { CommunicationSettings, CommunicationType, ContentItemTracking, TrackingServiceOptions, eventNames } from './tracking.models';

@Injectable({
    providedIn: 'root',
})
export class DataLayerTrackingService implements TrackingServiceProvider {
    readonly #window = inject(WINDOW);

    constructor(
        private trackingValueGettersService: TrackingValueGettersService,
        private trackingConfig: TrackingConfig,
        private cookieService: CookieService,
        private apiService: SharedFeaturesApiService,
        private log: Logger,
        private timerService: TimerService,
        private localStoreService: LocalStoreService,
        webWorkerService: WebWorkerService,
    ) {
        // Create interval to update data layer when GTM script loads.
        webWorkerService.createWorker(WorkerType.DataLayerTrackingInterval, { interval: 500 }, () => {
            if (this.gtmLoaded) {
                this.processLocalStore();
                webWorkerService.removeWorker(WorkerType.DataLayerTrackingInterval);
            }
        });
    }

    private get gtmEnabled(): boolean {
        return this.trackingConfig.tagManagerRenderers.includes('GoogleTagManagerRenderer') && !!this.#window.google_tag_manager;
    }

    private get gtmLoaded(): boolean {
        return (
            this.#window.dataLayer?.some((x: { event: string }) => x.event === WindowEvent.VanillaGtmLoaded) &&
            this.#window.dataLayer?.some((x: { event: string }) => x.event === WindowEvent.GtmLoad)
        );
    }

    async addInitialValues() {
        this.updateDataLayerEntryInfo();
        await this.updateUserValues();
        this.updateDataLayer({
            'browser.userAgent': this.trackingValueGettersService.userAgent(),
            'browser.isTouch': this.trackingValueGettersService.isTouch(),
            'page.trackerID': this.trackingValueGettersService.trackerID(),
            'page.redirectedFrom': this.trackingValueGettersService.redirectedFrom(),
            'page.nightModeStatus': this.trackingValueGettersService.nightMode(),
            'page.language': this.trackingValueGettersService.lang(),
            'page.culture': this.trackingValueGettersService.culture(),
            'page.frontend': this.trackingValueGettersService.frontend(),
            'page.domain': this.trackingValueGettersService.domain(),
            'page.medium': this.trackingValueGettersService.medium(),
            'native.nativeMode': this.trackingValueGettersService.nativeMode(),
            'user.profile.dvID': this.trackingValueGettersService.deviceId(),
            'user.session.internalCampaign': this.trackingValueGettersService.internalCampaign(),
            'device.cpuCores': this.trackingValueGettersService.cpuCores(),
            'device.cpuMaxFrequency': this.trackingValueGettersService.cpuMaxFrequency(),
            'device.totalRam': this.trackingValueGettersService.totalRam(),
            'device.model': this.trackingValueGettersService.model(),
            'page.trackingAffiliate': this.trackingValueGettersService.trackingAffiliate(),
            'browser.orientation': this.trackingValueGettersService.browserOrientation(),
            'browser.screenResolution': this.trackingValueGettersService.browserScreenResolution(),
        });

        this.updateDataLayerSessionId();
    }

    async updateUserValues() {
        this.updateDataLayer({
            'user.profile.accountID': this.trackingValueGettersService.accountId(),
            'user.profile.bal': await this.trackingValueGettersService.userBalance(),
            'user.profile.currency': this.trackingValueGettersService.userCurrency(),
            'user.profile.country': this.trackingValueGettersService.userCountry(),
            'user.profile.loyaltyStatus': this.trackingValueGettersService.userLoyalty(),
            'user.profile.opid': this.trackingValueGettersService.userCustomerId(),
            'user.profile.vid': this.trackingValueGettersService.userSegmentId(),
            'user.profile.stage': this.trackingValueGettersService.userStage(),
            'user.profile.prestage': this.trackingValueGettersService.userPrestage(),
            'user.profile.mid': this.trackingValueGettersService.userMicroSegmentId(),
            'user.profile.chid': this.trackingValueGettersService.userChurnRate(),
            'user.profile.fvid': this.trackingValueGettersService.userFutureValue(),
            'user.profile.pvid': this.trackingValueGettersService.userPotentialVip(),
            'user.session.geoIPCountry': this.trackingValueGettersService.userGeoCountry(),
            'user.session.abTestGroup': this.trackingValueGettersService.abTestGroup(),
            'user.hasPositiveBalance': await this.trackingValueGettersService.hasPositiveBalance(),
            'user.isAuthenticated': this.trackingValueGettersService.isAuthenticated(),
            'user.isExisting': this.trackingValueGettersService.userKnown(),
            'browser.orientation': this.trackingValueGettersService.browserOrientation(),
            'browser.screenResolution': this.trackingValueGettersService.browserScreenResolution(),
        });
    }

    async updateDataLayer(data?: any): Promise<void> {
        return new Promise((resolve) => {
            if (isObject(data) && !Array.isArray(data)) {
                if (this.gtmLoaded) {
                    if (!this.trackingConfig.schedulerEnabled && this.trackingConfig.dataLayerUpdateTimeoutInMilliseconds) {
                        this.timerService.scheduleIdleCallback(() => {
                            this.#window[this.trackingConfig.dataLayerName].push(data);
                            resolve();
                        }, this.trackingConfig.dataLayerUpdateTimeoutInMilliseconds);
                    } else {
                        this.#window[this.trackingConfig.dataLayerName].push(data);
                        resolve();
                    }
                } else {
                    const tracking = this.getDataFromStore();
                    tracking.push(data);

                    this.localStoreService.set(LocalStoreKey.Tracking, JSON.stringify(tracking));
                    resolve();
                }
            }
        });
    }

    async trackEvents(item: MenuContentItem, eventType: WebAnalyticsEventType) {
        if (item.webAnalytics) {
            try {
                const parsedValue: WebAnalyticsEvents = JSON.parse(item.webAnalytics);

                switch (eventType) {
                    case WebAnalyticsEventType.load:
                        const load = parsedValue?.load;

                        if (load) {
                            await this.triggerEvent(load.eventName, load.data);
                        }
                        break;
                    case WebAnalyticsEventType.click:
                        const click = parsedValue?.click;

                        if (click) {
                            if (click.data['component.URLClicked'] === 'link') {
                                click.data['component.URLClicked'] = item.url;
                            }
                            await this.triggerEvent(click.eventName, click.data);
                        }
                        break;
                    case WebAnalyticsEventType.close:
                        const close = parsedValue?.close;

                        if (close) {
                            await this.triggerEvent(close.eventName, close.data);
                        }
                        break;
                }
            } catch (error) {
                this.log.errorRemote(
                    `Failed to parse or track WebAnalytics data from item:${item.name}. Provided WebAnalytics data:${item.webAnalytics}`,
                    error,
                );
            }
        }
    }

    async triggerEvent(eventName: string, data?: any, options?: TrackingServiceOptions): Promise<TriggerEventPromiseResult> {
        // GTM must be enabled, not only loaded to make sure it's injected into a page via Vanilla's data layer tracking implementation.
        const eventTimeout = this.gtmEnabled ? options?.timeout || this.trackingConfig.eventCallbackTimeoutInMilliseconds : 0;

        return this.runWithTimeout(
            new Promise((resolve, reject) => {
                if (eventName.indexOf('error.') === 0) {
                    // "error.*" eventName is reserved for errors reporting
                    return reject('The "error.*" eventName is reserved for errors reporting');
                }

                if (!data || Object.keys(data).length === 0) {
                    return reject('Tracking data is required');
                }

                if (eventName === eventNames.userLogout) {
                    this.updateUserValues();
                }

                data = {
                    event: eventName,
                    ...data,
                };

                if (this.gtmEnabled) {
                    data = {
                        eventCallback: resolve.bind(null, TriggerEventPromiseResult.Normal),
                        eventTimeout,
                        ...data,
                    };
                }

                this.updateDataLayer(data);

                // Tracking cleanup
                this.cookieService.remove(CookieName.RedirexOriginal);

                // Resolve immediately when GTM is not present (other tag managers don't support event callback)
                if (!this.gtmEnabled) {
                    resolve(TriggerEventPromiseResult.Normal);
                }
            }),
            eventTimeout,
        );
    }

    async reportErrorObject(error: any) {
        return this.updateDataLayer({
            event: 'error',
            error,
        });
    }

    reportError(errorDetail: any) {
        this.updateDataLayer({
            event: encodeURIComponent(`error.${JSON.stringify(errorDetail)}`),
        });
    }

    trackContentItemEvent(parameters: { [name: string]: string } | undefined, parameterName: string) {
        const tracking = this.getContentItemTracking(parameters, parameterName);

        if (tracking) {
            this.triggerEvent(tracking.event, tracking.data);
        }
    }

    setReferrer(referrer: string) {
        this.trackingValueGettersService.setReferrer(referrer);
    }

    /**
     * Gets user communication settings and trigger the tracking event `Event.Functionality.Cts`
     * with data formatted as follows: **Email:Yes|Post:No|SMS:Yes|Phone:No**
     */
    updateUserContactabilityStatus() {
        this.apiService.get('communicationsettings').subscribe((data: CommunicationSettings) => {
            const cts = data.settings.map((c: CommunicationType) => `${c.name}:${c.selected ? 'Yes' : 'No'}`).join('|');
            this.triggerEvent('Event.Functionality.Cts', { 'user.profile.cts': cts }); //Format to Send: Email:Yes|Post:No|SMS:Yes|Phone:No.
        });
    }

    getContentItemTracking(parameters: { [name: string]: string } | undefined, parameterName: string): ContentItemTracking | null {
        parameters = parameters || {};
        const event = parameters[parameterName];

        if (!event) {
            return null;
        }

        const trackingDataPrefix = parameterName + '.';
        const data = mapKeys(
            pickBy(parameters, (_: string, k: string) => k.startsWith(trackingDataPrefix)),
            (_: string, k: string) => k.replace(trackingDataPrefix, ''),
        );

        return { event, data };
    }

    private getDataFromStore(): any[] {
        const trackingData = this.localStoreService.get<string>(LocalStoreKey.Tracking);

        return trackingData ? JSON.parse(trackingData) : [];
    }

    private processLocalStore() {
        const trackings = this.getDataFromStore();

        if (trackings.length > 0) {
            trackings.forEach((data: any) => this.updateDataLayer(data));

            this.localStoreService.remove(LocalStoreKey.Tracking);
        }
    }

    private runWithTimeout(promise: Promise<TriggerEventPromiseResult>, timeout: number): Promise<TriggerEventPromiseResult> {
        return new Promise((resolve, reject) => {
            const timeoutId = this.timerService.scheduleIdleCallback(() => resolve(TriggerEventPromiseResult.Timeout), timeout);

            promise.then(
                (result: TriggerEventPromiseResult) => {
                    timeoutId();
                    resolve(result);
                },
                (error: any) => {
                    timeoutId();
                    reject(error);
                },
            );
        });
    }

    private updateDataLayerEntryInfo() {
        const entryUrl = this.cookieService.get(CookieName.EntryUrl);

        if (entryUrl) {
            this.trackingValueGettersService.setEntryUrl(entryUrl);
            this.updateDataLayer({
                event: 'v8Launch',
                v8: {
                    tech: {
                        build: this.trackingValueGettersService.packageVersion('@frontend/vanilla'),
                        label: this.trackingValueGettersService.domain(),
                    },
                    entry: {
                        url: this.trackingValueGettersService.fullEntryUrl().absUrl(),
                        path: this.trackingValueGettersService.fullEntryUrl().path(),
                        referrer: this.trackingValueGettersService.entryUrlReferrer(),
                        utms: {
                            source: this.trackingValueGettersService.fullEntryUrl().search.get('utm_source'),
                            medium: this.trackingValueGettersService.fullEntryUrl().search.get('utm_medium'),
                            campaign: this.trackingValueGettersService.fullEntryUrl().search.get('utm_campaign'),
                            content: this.trackingValueGettersService.fullEntryUrl().search.get('utm_content'),
                            keyword: this.trackingValueGettersService.fullEntryUrl().search.get('utm_term'),
                        },
                    },
                },
            });
        }
    }

    private updateDataLayerSessionId() {
        if (this.#window.hasOwnProperty('decibelInsight')) {
            this.#window.decibelInsight('ready', () => {
                this.updateDataLayer({ 'user.decibelID': this.#window.decibelInsight('getSessionId') });
            });
        } else {
            this.#window._da_ready = () => {
                this.updateDataLayer({ 'user.decibelID': this.#window.decibelInsight('getSessionId') });
            };
        }
    }
}
