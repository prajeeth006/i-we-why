import { TestBed } from '@angular/core/testing';

import { PWAService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { CookieServiceMock } from './cookie.mock';

describe('PWAService', () => {
    let service: PWAService;
    let windowMock: WindowMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                PWAService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
    });

    function initService() {
        service = TestBed.inject(PWAService);
    }

    describe('isStandaloneApp', () => {
        it('should be false', () => {
            initService();

            expect(service.isStandaloneApp).toBeFalse();
        });

        it('should be true if navigator.standalone', () => {
            windowMock.navigator.standalone = true;

            initService();

            expect(service.isStandaloneApp).toBeTrue();
        });

        it('should be true if standalone media matches', () => {
            windowMock.matchMedia('(display-mode: standalone)').matches = true;

            initService();

            expect(service.isStandaloneApp).toBeTrue();
        });

        it('should be true if override cookie is set', () => {
            cookieServiceMock.get.withArgs('StandaloneOverride').and.returnValue('1');

            initService();

            expect(service.isStandaloneApp).toBeTrue();
        });
    });
});
