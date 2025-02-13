import { TestBed } from '@angular/core/testing';

import { NetworkService, NetworkStatusSource, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';

describe('NetworkService', () => {
    let service: NetworkService;
    let windowMock: WindowMock;
    let eventsSpy: jasmine.Spy;

    beforeEach(() => {
        windowMock = new WindowMock();
        windowMock.navigator.onLine = true;

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                NetworkService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(NetworkService);

        eventsSpy = jasmine.createSpy();
        service.events.subscribe(eventsSpy);
    });

    it('should start with default navigator value', () => {
        expectNetworkStatus(true, NetworkStatusSource.Initial);
    });

    describe('windowEvents', () => {
        it('should be offline after window offline event', () => {
            windowEvent('offline');

            expectNetworkStatus(false, NetworkStatusSource.WindowEvent);
        });

        it('should be online after window online event', () => {
            windowEvent('offline');
            windowEvent('online');

            expectNetworkStatus(true, NetworkStatusSource.WindowEvent);
        });
    });

    describe('apiRequests', () => {
        it('should be offline after more than configured number of requests are reported as offline', () => {
            service.reportOfflineRequest(0);
            expectNetworkStatus(true, NetworkStatusSource.Initial);
            service.reportOfflineRequest(1);
            expectNetworkStatus(false, NetworkStatusSource.ApiRequest);
        });

        it('should be online after a request is reported as online', () => {
            service.reportOfflineRequest(1);
            service.reportOfflineRequest(2);
            service.reportOnlineRequest(3);
            expectNetworkStatus(true, NetworkStatusSource.ApiRequest);
        });

        it('should still be online if offline requests which started sooner than last online request are reported', () => {
            service.reportOnlineRequest(3);
            service.reportOfflineRequest(1);
            service.reportOfflineRequest(2);
            expectNetworkStatus(true, NetworkStatusSource.Initial);
        });
    });

    it('should reset offline request counter when going online', () => {
        windowEvent('offline');
        service.reportOfflineRequest(1);
        service.reportOfflineRequest(2);
        windowEvent('online');
        expectNetworkStatus(true, NetworkStatusSource.WindowEvent);
    });

    function windowEvent(name: string) {
        windowMock.navigator.onLine = name === 'online';
        windowMock.addEventListener.calls
            .all()
            .find((c) => c.args[0] == name)!
            .args[1]();
    }

    function expectNetworkStatus(online: boolean, source: NetworkStatusSource) {
        expect(service.isOnline).toBe(online);

        expect(eventsSpy).toHaveBeenCalledWith(jasmine.objectContaining({ online: online, source: source }));
    }
});
