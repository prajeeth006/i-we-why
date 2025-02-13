/* eslint-disable deprecation/deprecation */
import { DOCUMENT } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DeviceService, NavigationService, WINDOW } from '@frontend/vanilla/core';
import { MockProvider } from 'ng-mocks';

import { DataLayerProxyService } from '../src/data-layer-proxy.service';
import { PartytownService } from '../src/partytown.service';
import { TagManagerService } from '../src/tag-manager.service';
import { TrackingConfig } from '../src/tracking.client-config';
import { DataLayerProxyMock } from './mocks/data-layer-proxy.mock';
import { DeviceServiceMock } from './mocks/device-service.mock';
import { NavigationServiceMock } from './mocks/navigation-service.mock';
import { PartytownServiceMock } from './mocks/partytown-service.mock';
import { TrackingConfigMock } from './mocks/tracking-config.mock';
import { WindowMock } from './mocks/window.mock';

describe('TagManagerService', () => {
    let trackingConfigMock: typeof TrackingConfigMock;
    let service: TagManagerService;
    let documentMock: (typeof WindowMock)['document'];

    beforeEach(() => {
        documentMock = WindowMock.document;
        trackingConfigMock = { ...TrackingConfigMock, schedulerEnabled: true };

        jest.spyOn(documentMock, 'createElement').mockImplementation(() => {
            const element = {
                onload: () => {},
                addEventListener: () => {},
            };
            Promise.resolve().then(() => {
                element.onload?.();
            });
            return element as unknown as HTMLElement;
        });

        const clientTagManagers = [
            {
                name: 'included',
                script: 'included',
            },
            {
                name: 'excluded',
                script: 'excluded',
            },
        ];

        trackingConfigMock.clientTagManagers = clientTagManagers;
        trackingConfigMock.clientInjectionExcludes = ['excluded'];

        trackingConfigMock.clientTagManagers = clientTagManagers;

        TestBed.configureTestingModule({
            providers: [
                TagManagerService,
                {
                    provide: DataLayerProxyService,
                    useClass: DataLayerProxyMock,
                },
                MockProvider(TrackingConfig, trackingConfigMock),
                MockProvider(PartytownService, PartytownServiceMock),
                MockProvider(DeviceService, DeviceServiceMock),
                MockProvider(NavigationService, NavigationServiceMock),
                {
                    provide: WINDOW,
                    useValue: WindowMock,
                },
                {
                    provide: DOCUMENT,
                    useValue: documentMock,
                },
            ],
        });
        // trackingConfig.whenReady = new BehaviorSubject<void>(void 0);
        service = TestBed.inject(TagManagerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('init', () => {
        it('should do nothing if not enabled', () => {
            service['trackingConfig'].isEnabled = false;

            service.init(); //Act

            expect(documentMock.createElement).not.toHaveBeenCalled();
        });

        it('should add configured non-excluded scripts', () => {
            const spy = jest.spyOn(documentMock.body, 'append');
            service.init(); //Act

            expect(documentMock.createElement).toHaveBeenCalledTimes(1);
            expect(documentMock.createElement).toHaveBeenCalledWith('script');

            const el = spy.mock.calls[0][0] as Node & { id: string; text: string; async: boolean; type: string };
            expect(el.id).toBe('included');
            expect(el.text).toBe('included');
            expect(el.async).toBeTruthy();
            expect(el.type).toBe('text/javascript');
        });
    });

    describe('load', () => {
        it('should add configured script', async () => {
            const spy = jest.spyOn(documentMock.body, 'append');
            await service.load('excluded'); //Act
            expect(documentMock.createElement).toHaveBeenCalledWith('script');
            const el = spy.mock.calls[0][0] as Node & { id: string; text: string; async: boolean; type: string };

            expect(el.id).toBe('excluded');
            expect(el.text).toBe('excluded');
            expect(el.async).toBeTruthy();
            expect(el.type).toBe('text/javascript');
        });

        it('should add configured script with specified type', async () => {
            const spy = jest.spyOn(documentMock.body, 'append');

            await service.load('excluded', 'custom/type'); //Act
            expect(documentMock.createElement).toHaveBeenCalledWith('script');
            const el = spy.mock.calls[0][0] as Node & { id: string; text: string; async: boolean; type: string };
            expect(el.id).toBe('excluded');
            expect(el.text).toBe('excluded');
            expect(el.async).toBeTruthy();
            expect(el.type).toBe('custom/type');
        });

        it('should do nothing if unknown', fakeAsync(() => {
            let error: any;

            service
                .load('unknown') //Act
                .then(
                    () => {},
                    (err: any) => (error = err.message),
                );

            tick();

            expect(error).toBe('Client TagManager "unknown" does not exist.');
            expect(documentMock.createElement).not.toHaveBeenCalledWith('script');
        }));

        it('should fallback to scheduling', async () => {
            const dataLayerProxy = TestBed.inject(DataLayerProxyService);
            const patchDataLayerSpy = jest.spyOn(dataLayerProxy, 'patchDataLayer').mockReturnValue(Promise.resolve());

            await service.load('included', 'text/javascript');

            expect(patchDataLayerSpy).toHaveBeenCalledWith(false);
        });

        it('should not add script if already exists', async () => {
            jest.spyOn(documentMock, 'querySelector').mockReturnValue({} as Element);

            await service.load('included'); //Act

            expect(documentMock.createElement).not.toHaveBeenCalledWith('script');
        });
    });
});
