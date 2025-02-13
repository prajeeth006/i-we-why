import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    CookieName,
    CookieService,
    LocalStoreKey,
    LocalStoreService,
    Logger,
    MenuContentItem,
    SharedFeaturesApiService,
    TimerService,
    TriggerEventPromiseResult,
    WINDOW,
    WebAnalyticsEventType,
    WebWorkerService,
    WindowEvent,
    WorkerType,
} from '@frontend/vanilla/core';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { DataLayerTrackingService } from '../src/data-layer-tracking.service';
import { TrackingValueGettersService } from '../src/tracking-value-getters.service';
import { TrackingConfig } from '../src/tracking.client-config';
import { eventNames } from '../src/tracking.models';
import { CookieServiceMock } from './mocks/cookie-service.mock';
import { LocalStoreServiceMock } from './mocks/local-store-service.mock';
import { LoggerMock } from './mocks/logger.mock';
import { ParsedUrlMock } from './mocks/parsed-url.mock';
import { SharedFeaturesApiServiceMock } from './mocks/shared-features-api-service.mock';
import { TimerServiceMock } from './mocks/timer-service.mock';
import { TrackingConfigMock } from './mocks/tracking-config.mock';
import { TrackingValueGettersServiceMock } from './mocks/tracking-value-getters.service.mock';
import { WebWorkerServiceMock } from './mocks/webworker-service.mock';
import { WindowMock } from './mocks/window.mock';

describe('DataLayerTrackingService', () => {
    let service: DataLayerTrackingService;
    let trackingValueGettersServiceMock: typeof TrackingValueGettersServiceMock;
    let trackingConfigMock: typeof TrackingConfigMock;
    let cookieServiceMock: typeof CookieServiceMock;
    let windowMock: typeof WindowMock;
    let apiServiceMock: typeof SharedFeaturesApiServiceMock;
    let loggerMock: typeof LoggerMock;
    let timerServiceMock: typeof TimerServiceMock;
    let localStoreServiceMock: typeof LocalStoreServiceMock;
    let webWorkerServiceMock: typeof WebWorkerServiceMock;
    let menuContentItem: MenuContentItem;

    beforeEach(() => {
        trackingValueGettersServiceMock = TrackingValueGettersServiceMock;
        trackingConfigMock = TrackingConfigMock;
        cookieServiceMock = CookieServiceMock;
        windowMock = WindowMock;
        apiServiceMock = SharedFeaturesApiServiceMock;
        loggerMock = LoggerMock;
        timerServiceMock = TimerServiceMock;
        localStoreServiceMock = LocalStoreServiceMock;
        webWorkerServiceMock = WebWorkerServiceMock;

        TestBed.configureTestingModule({
            providers: [
                DataLayerTrackingService,
                MockProvider(TrackingValueGettersService, trackingValueGettersServiceMock),
                MockProvider(TrackingConfig, trackingConfigMock),
                MockProvider(TimerService, timerServiceMock),
                MockProvider(CookieService, cookieServiceMock),
                MockProvider(SharedFeaturesApiService, apiServiceMock),
                MockProvider(Logger, loggerMock),
                MockProvider(LocalStoreService, localStoreServiceMock),
                MockProvider(WebWorkerService, webWorkerServiceMock),
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        // setup the initial data layer (as if obtained from server)
        windowMock[trackingConfigMock.dataLayerName] = [];
        windowMock.dataLayer = [{ event: WindowEvent.VanillaGtmLoaded }];
        windowMock.location.href = 'http://bwin.com/en/path';
        windowMock.google_tag_manager = { dataLayer: { gtmDom: true } };
        windowMock.VERSIONS = { '@frontend/vanilla': 123 };

        jest.spyOn(localStoreServiceMock, 'get').mockReturnValue('[{ "event": "track" }]');

        menuContentItem = <MenuContentItem>{
            clickAction: 'testFn',
            url: 'url',
            target: 'target',
            parameters: <any>{
                'tracking.LoadedEvent': 'LoadedEvt',
                'tracking.LoadedEvent.page.referringAction': 'Some_Action',
            },
            webAnalytics: `{
                "load": {
                    "eventName": "contentView",
                    "data": {}
                },
                "click": {
                    "eventName": "Event.Tracking.Click",
                    "data": {}
                },
                "close": {
                    "eventName": "Event.Tracking.Close",
                    "data": {}
                }
            }`,
        };

        service = TestBed.inject(DataLayerTrackingService);
    });

    describe('init', () => {
        it('should create Web worker and update data layer when tracking container loads', () => {
            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(
                WorkerType.DataLayerTrackingInterval,
                { interval: 500 },
                expect.any(Function),
            );

            expect(webWorkerServiceMock.removeWorker).not.toHaveBeenCalled();

            windowMock.dataLayer.push({ event: WindowEvent.GtmLoad });
            (webWorkerServiceMock.createWorker as jest.Mock).mock.calls[(webWorkerServiceMock.createWorker as jest.Mock).mock.calls.length - 1][2]();

            expect(localStoreServiceMock.get).toHaveBeenCalledWith(LocalStoreKey.Tracking);
            expect(updateDataLayerSpy).toHaveBeenCalledWith({ event: 'track' });
            expect(localStoreServiceMock.remove).toHaveBeenCalledWith(LocalStoreKey.Tracking);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.DataLayerTrackingInterval);
        });
    });

    describe('addInitialValues', () => {
        it('should update initial values; data layer entry info; user values; data layer session ID', fakeAsync(() => {
            jest.spyOn(cookieServiceMock, 'get').mockImplementation((name: string): string => {
                if (name === CookieName.EntryUrl) {
                    return 'http://bwin.com/en/path';
                }
                return '';
            });

            jest.spyOn(trackingValueGettersServiceMock, 'fullEntryUrl').mockReturnValue(ParsedUrlMock);
            jest.spyOn(trackingValueGettersServiceMock, 'entryUrlReferrer').mockReturnValue('referrer');

            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');
            const updateUserValuesSpy = jest.spyOn(service, 'updateUserValues');

            service.addInitialValues();
            tick();

            expect(updateDataLayerSpy).toHaveBeenCalledTimes(4);
            expect(updateUserValuesSpy).toHaveBeenCalledTimes(1);
            expect(updateUserValuesSpy).toHaveBeenCalledWith();
            expect(trackingValueGettersServiceMock.setEntryUrl).toHaveBeenCalledTimes(1);
            expect(trackingValueGettersServiceMock.setEntryUrl).toHaveBeenCalledWith('http://bwin.com/en/path');
            expect(windowMock.decibelInsight).toHaveBeenCalledWith('ready', expect.any(Function));
            expect(windowMock.decibelInsight).toHaveBeenCalledWith('getSessionId');
        }));
    });

    describe('updateUserValues', () => {
        it('should update data layer with user values', fakeAsync(() => {
            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');

            service.updateUserValues();
            tick();

            expect(updateDataLayerSpy).toHaveBeenCalledWith({
                'user.profile.accountID': undefined,
                'user.profile.bal': undefined,
                'user.profile.currency': undefined,
                'user.profile.country': undefined,
                'user.profile.loyaltyStatus': undefined,
                'user.profile.opid': undefined,
                'user.profile.vid': undefined,
                'user.profile.stage': undefined,
                'user.profile.prestage': undefined,
                'user.profile.mid': undefined,
                'user.profile.chid': undefined,
                'user.profile.fvid': undefined,
                'user.profile.pvid': undefined,
                'user.session.geoIPCountry': undefined,
                'user.session.abTestGroup': undefined,
                'user.hasPositiveBalance': undefined,
                'user.isAuthenticated': undefined,
                'user.isExisting': undefined,
                'browser.orientation': undefined,
                'browser.screenResolution': undefined,
            });
        }));
    });

    describe('updateDataLayer', () => {
        it('should update data layer if tracking container is loaded', () => {
            windowMock.dataLayer.push({ event: WindowEvent.GtmLoad });

            service.updateDataLayer({ event: 'test' });

            expect(windowMock[trackingConfigMock.dataLayerName]).toEqual([{ event: 'test' }]);
        });

        it('should schedule idle callback if update timeout is configured', () => {
            windowMock.dataLayer.push({ event: WindowEvent.GtmLoad });

            service['trackingConfig'].dataLayerUpdateTimeoutInMilliseconds = 1000;

            service.updateDataLayer({ event: 'test' });

            expect(timerServiceMock.scheduleIdleCallback).toHaveBeenCalledWith(
                expect.any(Function),
                service['trackingConfig'].dataLayerUpdateTimeoutInMilliseconds,
            );
        });

        it('should add tracking data to store if tracking container is not loaded', () => {
            service.updateDataLayer({ event: 'test' });

            expect(localStoreServiceMock.get).toHaveBeenCalledWith(LocalStoreKey.Tracking);
            expect(localStoreServiceMock.set).toHaveBeenCalledWith(LocalStoreKey.Tracking, '[{"event":"track"},{"event":"test"}]');
        });

        it('should not update data layer if value is not valid', () => {
            windowMock.dataLayer.push({ event: WindowEvent.GtmLoad });

            service.updateDataLayer([{ event: 'test' }]);

            expect(windowMock[trackingConfigMock.dataLayerName]).toStrictEqual([]);
        });
    });

    describe('trackEvents', () => {
        it('should track event from menu content item', () => {
            const triggerEventSpy = jest.spyOn(service, 'triggerEvent');

            service.trackEvents(menuContentItem, WebAnalyticsEventType.load);

            expect(triggerEventSpy).toHaveBeenCalledWith('contentView', {});
        });

        it('should log error if tracking data is not valid', () => {
            menuContentItem.webAnalytics = '{ event: test }';

            service.trackEvents(menuContentItem, WebAnalyticsEventType.load);

            expect(loggerMock.errorRemote).toHaveBeenCalledWith(
                `Failed to parse or track WebAnalytics data from item:${menuContentItem.name}. Provided WebAnalytics data:${menuContentItem.webAnalytics}`,
                expect.any(Error),
            );
        });
    });

    describe('triggerEvent', () => {
        beforeEach(() => jest.spyOn(timerServiceMock, 'scheduleIdleCallback').mockReturnValue(() => {}));

        it('should trigger event and reject if event name contains "error."', async () => {
            await expect(service.triggerEvent('error.test', { test: 'failed' })).rejects.toEqual(
                'The "error.*" eventName is reserved for errors reporting',
            );
        });

        it('should trigger event and reject if tracking data is missing', async () => {
            await expect(service.triggerEvent('test', {})).rejects.toEqual('Tracking data is required');
        });

        it(`should update user values if event name is ${eventNames.userLogout}`, () => {
            const updateUserValuesSpy = jest.spyOn(service, 'updateUserValues');

            service.triggerEvent(eventNames.userLogout, { event: 'test' });

            expect(updateUserValuesSpy).toHaveBeenCalled();
        });

        it(`should update data layer and remove ${CookieName.RedirexOriginal} cookie`, () => {
            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');

            service.triggerEvent(eventNames.userLogout, { event: 'test' });

            expect(updateDataLayerSpy).toHaveBeenCalled();
            expect(cookieServiceMock.remove).toHaveBeenCalledWith(CookieName.RedirexOriginal);
        });

        it(`should resolve with ${TriggerEventPromiseResult.Normal} if GTM is not available`, async () => {
            windowMock.google_tag_manager = undefined;
            await expect(service.triggerEvent('test', { event: 'test' })).resolves.toEqual(TriggerEventPromiseResult.Normal);
        });

        it('should update data layer with event callback when GTM is available', fakeAsync(() => {
            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');
            trackingConfigMock.tagManagerRenderers.push('test');

            service.triggerEvent('test', { event: 'test' });

            expect(updateDataLayerSpy).toHaveBeenCalledWith({
                eventCallback: expect.any(Function),
                eventTimeout: 100,
                event: 'test',
            });
        }));
    });

    describe('reportErrorObject', () => {
        it('should update data layer with error object', () => {
            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');

            service.reportErrorObject({ test: 'failed' });

            expect(updateDataLayerSpy).toHaveBeenCalledWith({ event: 'error', error: { test: 'failed' } });
        });
    });

    describe('reportError', () => {
        it('should update data layer with encoded error object', () => {
            const updateDataLayerSpy = jest.spyOn(service, 'updateDataLayer');

            service.reportError('test');

            expect(updateDataLayerSpy).toHaveBeenCalledWith({ event: 'error.%22test%22' });
        });
    });

    describe('trackContentItemEvent', () => {
        it('should track content item event', () => {
            const triggerEventSpy = jest.spyOn(service, 'triggerEvent');

            service.trackContentItemEvent(menuContentItem.parameters, 'tracking.LoadedEvent');

            expect(triggerEventSpy).toHaveBeenCalledWith('LoadedEvt', { 'page.referringAction': 'Some_Action' });
        });

        it('should not track content item event if tracking is missing', () => {
            const triggerEventSpy = jest.spyOn(service, 'triggerEvent');

            service.trackContentItemEvent(menuContentItem.parameters, 'test');

            expect(triggerEventSpy).not.toHaveBeenCalled();
        });
    });

    describe('setReferrer', () => {
        it('should set referrer', () => {
            service.setReferrer('test');

            expect(trackingValueGettersServiceMock.setReferrer).toHaveBeenCalledWith('test');
        });
    });

    describe('updateUserContactabilityStatus', () => {
        it('should call communicationsettings API and trigger event with the response', () => {
            const triggerEventSpy = jest.spyOn(service, 'triggerEvent');
            jest.spyOn(apiServiceMock, 'get').mockReturnValue(
                of({
                    settings: [
                        {
                            id: 0,
                            name: 'Email',
                            selected: true,
                        },
                        {
                            id: 1,
                            name: 'SMS',
                            selected: false,
                        },
                    ],
                }),
            );

            service.updateUserContactabilityStatus();

            expect(apiServiceMock.get).toHaveBeenCalledWith('communicationsettings');
            expect(triggerEventSpy).toHaveBeenCalledWith('Event.Functionality.Cts', { 'user.profile.cts': 'Email:Yes|SMS:No' });
        });
    });

    describe('getContentItemTracking', () => {
        it('should return tracking data from menu content item', () => {
            const result = service.getContentItemTracking(menuContentItem.parameters, 'tracking.LoadedEvent');

            expect(result).toEqual({ event: 'LoadedEvt', data: { 'page.referringAction': 'Some_Action' } });
        });
    });
});
