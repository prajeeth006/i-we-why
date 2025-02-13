import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { DarkModeService } from '@frontend/vanilla/shared/dark-mode';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';

describe('DarkModeService', () => {
    let service: DarkModeService;
    let cookieServiceMock: CookieServiceMock;
    let windowMock: WindowMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        windowMock = new WindowMock();
        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                DarkModeService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
    });

    function initService() {
        service = TestBed.inject(DarkModeService);
    }

    describe('isEnabled', () => {
        it('should be false', () => {
            cookieServiceMock.get.and.returnValue('0');

            initService();

            expect(service.isEnabled).toBeFalse();
        });

        it('should be true', () => {
            cookieServiceMock.get.and.returnValue('2');

            initService();

            expect(service.isEnabled).toBeTrue();
        });

        it('should be true with desktop cookie', () => {
            cookieServiceMock.get.and.returnValue('1');

            initService();

            expect(service.isEnabled).toBeTrue();
        });
    });

    describe('toggle()', () => {
        it('should enable dark mode and reload', () => {
            cookieServiceMock.get.and.returnValue('0');
            initService();

            service.toggle();

            expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('dark-mode', '2', { expires: new Date(2150, 11, 11) });
            expect(windowMock.location.reload).toHaveBeenCalled();
        });

        it('should disable dark mode and reload', () => {
            cookieServiceMock.get.and.returnValue('1');
            initService();

            service.toggle();

            expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('dark-mode', '0', { expires: new Date(2150, 11, 11) });
            expect(windowMock.location.reload).toHaveBeenCalled();
        });
    });
});
