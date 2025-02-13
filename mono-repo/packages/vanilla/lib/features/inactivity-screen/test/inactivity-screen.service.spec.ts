import { TestBed } from '@angular/core/testing';

import { NativeEventType, RtmsMessage } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Observable } from 'rxjs';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { IdleServiceMock } from '../../../shared/idle/test/idle.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { InactivityScreenService } from '../src/inactivity-screen.service';
import { InactivityScreenConfigMock } from './inactivity-screen-config.mock';

describe('InactivityScreenService', () => {
    let service: InactivityScreenService;
    let idleServiceMock: IdleServiceMock;
    let rtmsServiceMock: RtmsServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let activitySpy: jasmine.Spy;

    beforeEach(() => {
        MockContext.useMock(InactivityScreenConfigMock);
        idleServiceMock = MockContext.useMock(IdleServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InactivityScreenService],
        });

        service = TestBed.inject(InactivityScreenService);
        activitySpy = jasmine.createSpy('activitySpy');
        service.activity.subscribe(activitySpy);
    });

    describe('detect activity', () => {
        it('on DOM event', () => {
            idleServiceMock.activity.next({});

            expect(activitySpy).toHaveBeenCalled();
        });

        it('on RTMS message with type BALANCE_UPDATE', () => {
            rtmsServiceMock.messages.next(<RtmsMessage>{ type: 'Overlay' });
            expect(activitySpy).not.toHaveBeenCalled();

            rtmsServiceMock.messages.next(<RtmsMessage>{ type: 'BALANCE_UPDATE' });

            expect(activitySpy).toHaveBeenCalled();
        });

        it('on CCB event BARCODESCANNED', () => {
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'logout' });

            expect(activitySpy).not.toHaveBeenCalled();

            nativeAppServiceMock.eventsFromNative.next({ eventName: 'BARCODESCANNED' });

            expect(activitySpy).toHaveBeenCalled();
        });
    });

    describe('whenIdle', () => {
        it('should subscribe to inner observable', () => {
            service.whenIdle();

            expect(idleServiceMock.whenIdle).toHaveBeenCalledWith(600, {
                additionalActivityEvent: jasmine.any(Observable),
                watchForIdleAfterFirstActivity: true,
            });

            idleServiceMock.whenIdle.calls.reset();

            cookieServiceMock.get.and.returnValue('true');

            service.whenIdle();

            expect(idleServiceMock.whenIdle).toHaveBeenCalledWith(600, {
                additionalActivityEvent: jasmine.any(Observable),
                watchForIdleAfterFirstActivity: false,
            });
        });

        it('should emit when inner observable emit', () => {
            const idleSpy = jasmine.createSpy('idleSpy');
            service.whenIdle().subscribe(idleSpy);
            idleServiceMock.whenIdle.next();

            expect(idleSpy).toHaveBeenCalled();

            idleSpy.calls.reset();
            eventsServiceMock.events.next({ eventName: NativeEventType.RESET_TERMINAL });
            idleServiceMock.whenIdle.next();

            expect(idleSpy).not.toHaveBeenCalled();
        });
    });
});
