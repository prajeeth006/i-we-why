import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QuerySearchParams, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { IdleServiceMock } from '../../../shared/idle/test/idle.mock';
import { LivePersonBootstrapService } from '../src/live-person-bootstrap.service';
import { LivePersonApiServiceMock, LivePersonConfigMock } from './live-person.mocks';

describe('LivePersonBootstrapService', () => {
    let service: LivePersonBootstrapService;
    let livePersonApiServiceMock: LivePersonApiServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let urlServiceMock: UrlServiceMock;
    let windowMock: WindowMock;
    let livePersonConfigMock: LivePersonConfigMock;
    let idleServiceMock: IdleServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        livePersonApiServiceMock = MockContext.useMock(LivePersonApiServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        windowMock = new WindowMock();
        MockContext.useMock(LoggerMock);
        livePersonConfigMock = MockContext.useMock(LivePersonConfigMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        idleServiceMock = MockContext.useMock(IdleServiceMock);

        TestBed.configureTestingModule({
            providers: [
                LivePersonBootstrapService,
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        (windowMock as any).bwin = { livepersonchat: {} };
        livePersonConfigMock.conditionalEvents = [
            { eventName: 'regidle', urlRegex: 'test-page', timeoutMilliseconds: 1000 },
            { eventName: 'cashieridle', urlRegex: 'cashier-page', timeoutMilliseconds: 2000 },
        ];
        userServiceMock.accountId = 'id_account';
    });

    beforeEach(() => {
        service = TestBed.inject(LivePersonBootstrapService);
    });

    describe('sendCashierLiveChatEvent - should open chat via querystring parameter and remove querystring', () => {
        it('on bootstrap', fakeAsync(() => {
            const parsedUrlMock = new ParsedUrlMock();
            parsedUrlMock.url.and.returnValue('www.bwin.com');
            parsedUrlMock.search = new QuerySearchParams('launchLiveChatFromCashier=true&lpCashierEvent=deposit_abandoned');
            urlServiceMock.current.and.returnValue(parsedUrlMock);

            service.onFeatureInit();
            livePersonConfigMock.whenReady.next();
            navigationServiceMock.goTo.resolve();
            tick(200);

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('www.bwin.com');
            expect(livePersonApiServiceMock.triggerEvent).toHaveBeenCalledWith('deposit_abandoned', {});
        }));

        it('on navigation', fakeAsync(() => {
            const parsedUrlMock = new ParsedUrlMock();
            urlServiceMock.current.and.returnValue(parsedUrlMock);

            service.onFeatureInit();
            livePersonConfigMock.whenReady.next();
            expect(livePersonApiServiceMock.triggerEvent).not.toHaveBeenCalled();

            parsedUrlMock.url.and.returnValue('www.bwin.com');
            parsedUrlMock.search = new QuerySearchParams('launchLiveChatFromCashier=true&lpCashierEvent=deposit_abandoned');

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
            navigationServiceMock.goTo.resolve();
            tick(200);

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('www.bwin.com');
            expect(livePersonApiServiceMock.triggerEvent).toHaveBeenCalledWith('deposit_abandoned', {});
        }));
    });

    describe('sendIdleLiveChatEvent - should open chat via regex', () => {
        it('on bootstrap', () => {
            const parsedUrlMock = new ParsedUrlMock();
            parsedUrlMock.absUrl.and.returnValue('www.bwin.com/en/cashier-page');
            urlServiceMock.current.and.returnValue(parsedUrlMock);

            service.onFeatureInit();
            livePersonConfigMock.whenReady.next();
            idleServiceMock.whenIdle.next();

            expect(livePersonApiServiceMock.triggerEvent).toHaveBeenCalledWith('cashieridle', {
                userName: 'user',
                accountName: 'id_account',
                customerId: 'id',
            });
        });

        it('on navigation', () => {
            const parsedUrlMock = new ParsedUrlMock();
            urlServiceMock.current.and.returnValue(parsedUrlMock);

            service.onFeatureInit();
            livePersonConfigMock.whenReady.next();
            expect(livePersonApiServiceMock.triggerEvent).not.toHaveBeenCalled();

            parsedUrlMock.absUrl.and.returnValue('www.bwin.com/en/cashier-page');
            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
            idleServiceMock.whenIdle.next();

            expect(livePersonApiServiceMock.triggerEvent).toHaveBeenCalledWith('cashieridle', {
                userName: 'user',
                accountName: 'id_account',
                customerId: 'id',
            });
        });
    });
});
