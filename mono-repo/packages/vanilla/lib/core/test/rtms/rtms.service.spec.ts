import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RtmsService, WINDOW } from '@frontend/vanilla/core';
import { ConnectionState, Notification } from '@rtms/client';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { UserLoginEvent } from '../../src/core';
import { RtmsServiceFactoryMock } from '../../src/rtms/test/rtms-service-factory.mock';
import { DslServiceMock } from '../dsl/dsl.mock';
import { UserServiceMock } from '../user/user.mock';
import { PlatformRtmsServiceMock } from './platform-rtms.mock';
import { RtmsConfigMock } from './rtms-config.mock';

describe('RtmsService', () => {
    let service: RtmsService;
    let windowMock: WindowMock;
    let userMock: UserServiceMock;
    let rtmsServiceFactoryMock: RtmsServiceFactoryMock;
    let platformRtmsServiceMock: PlatformRtmsServiceMock;
    let dslServiceMock: DslServiceMock;
    let rtmsConfigMock: RtmsConfigMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        windowMock = new WindowMock();
        rtmsServiceFactoryMock = MockContext.useMock(RtmsServiceFactoryMock);
        platformRtmsServiceMock = MockContext.createMock(PlatformRtmsServiceMock);
        dslServiceMock = MockContext.createMock(DslServiceMock);
        rtmsConfigMock = MockContext.useMock(RtmsConfigMock);

        rtmsServiceFactoryMock.create.and.returnValue(platformRtmsServiceMock);
        windowMock.document.visibilityState = 'visible';

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                RtmsService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(RtmsService);
    });

    describe('init', () => {
        it('should create platform RTMS service', () => {
            expect(rtmsServiceFactoryMock.create).toHaveBeenCalled();
        });

        it('should not close the connection if RTMS state is disconnected', () => {
            platformRtmsServiceMock.state = ConnectionState.DISCONNECTED;

            userMock.triggerEvent(new UserLoginEvent());

            expect(platformRtmsServiceMock.close).not.toHaveBeenCalled();
        });

        it('should connect when user logs in', fakeAsync(() => {
            userMock.triggerEvent(new UserLoginEvent());

            expect(platformRtmsServiceMock.close).toHaveBeenCalled();
            expect(platformRtmsServiceMock.connect).not.toHaveBeenCalled();

            tick();

            expect(platformRtmsServiceMock.connect).toHaveBeenCalled();
        }));
    });

    describe('messages', () => {
        it('should proxy messages from platform RTMS when document is in visible state', () => {
            const message: Notification = { eventId: 'a', type: 'b', payload: 'c' };
            const spy = jasmine.createSpy();

            service.messages.subscribe(spy);

            platformRtmsServiceMock.messages.next(message);
            dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(of(false));

            expect(spy).toHaveBeenCalledWith(message);
        });

        it('should proxy messages from platform RTMS when document is not visible but event is in backgroundevents config', () => {
            windowMock.document.visibilityState = 'hidden';
            rtmsConfigMock.backgroundEvents = ['b'];
            const message: Notification = { eventId: 'a', type: 'b', payload: 'c' };
            const spy = jasmine.createSpy();

            service.messages.subscribe(spy);

            platformRtmsServiceMock.messages.next(message);
            dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(of(false));

            expect(spy).toHaveBeenCalledWith(message);
        });

        it('should not proxy messages from platform RTMS when document is not in visible state and events in not in the config', () => {
            windowMock.document.visibilityState = 'hidden';
            const message: Notification = { eventId: 'a', type: 'b', payload: 'c' };
            const spy = jasmine.createSpy();

            service.messages.subscribe(spy);

            platformRtmsServiceMock.messages.next(message);
            dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(of(false));

            expect(spy).not.toHaveBeenCalledWith(message);
        });

        it('should not propagate message is event type is disabled', () => {
            const message: Notification = { eventId: 'a', type: 'test_event', payload: 'c' };
            const spy = jasmine.createSpy();

            service.messages.subscribe(spy);

            platformRtmsServiceMock.messages.next(message);
            dslServiceMock.evaluateExpression.withArgs('test_event').and.returnValue(of(true));

            expect(spy).not.toHaveBeenCalledWith(message);
        });
    });
});
