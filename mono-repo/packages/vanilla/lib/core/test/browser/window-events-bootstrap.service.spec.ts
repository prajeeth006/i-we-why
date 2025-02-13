import { TestBed } from '@angular/core/testing';

import { CookieName, WINDOW, WindowEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { WindowEventsBootstrapService } from '../../src/browser/window/window-events-bootstrap.service';
import { CookieServiceMock } from './cookie.mock';

describe('WindowEventsBootstrapService', () => {
    let service: WindowEventsBootstrapService;
    let windowMock: WindowMock;
    let cookieServiceMock: CookieServiceMock;
    let socialCookieDroppedEvent: Function;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                WindowEventsBootstrapService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock.addEventListener.and.callFake((type: string, callback: Function) => {
            if (type === WindowEvent.SocialCookieDropped) {
                socialCookieDroppedEvent = callback;
            }
        });

        service = TestBed.inject(WindowEventsBootstrapService);
        service.onAppInit();
    });

    describe('onAppInit', () => {
        it('should subscribe to SocialCookieDropped event', () => {
            expect(windowMock.addEventListener).toHaveBeenCalledOnceWith(WindowEvent.SocialCookieDropped, jasmine.any(Function));
        });

        it('should set AbSocialLog cookie on SocialCookieDropped event', () => {
            socialCookieDroppedEvent();

            expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.AbSocialLog, 'Y');
        });
    });
});
