import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ScreenTimeBeforeLogoutProvider } from '../src/screen-time-logout-provider';
import { ScreenTimeBrowserServiceMock } from './screen-time.mock';

describe('ScreenTimeBeforeLogoutProvider', () => {
    let service: ScreenTimeBeforeLogoutProvider;
    let screenTimeBrowserServiceMock: ScreenTimeBrowserServiceMock;

    beforeEach(() => {
        screenTimeBrowserServiceMock = MockContext.useMock(ScreenTimeBrowserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ScreenTimeBeforeLogoutProvider],
        });

        service = TestBed.inject(ScreenTimeBeforeLogoutProvider);
    });

    it('onLogout', () => {
        const browserVisibilityEvent = spyOn(screenTimeBrowserServiceMock.browserVisibilityEvent, 'next');
        service.onLogout();

        expect(browserVisibilityEvent).toHaveBeenCalledWith(false);
    });
});
