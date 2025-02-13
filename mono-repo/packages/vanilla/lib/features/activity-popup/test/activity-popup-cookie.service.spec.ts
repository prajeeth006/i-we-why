import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { ActivityPopupCookieService } from '../src/activity-popup-cookie.service';

describe('UserSummaryCookieService', () => {
    let service: ActivityPopupCookieService;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [ActivityPopupCookieService, MockContext.providers],
        });

        service = TestBed.inject(ActivityPopupCookieService);
    });

    it('read', () => {
        service.read();

        expect(cookieServiceMock.get).toHaveBeenCalledWith('activitypopupclosed');
    });

    it('write', () => {
        service.write();

        expect(cookieServiceMock.put).toHaveBeenCalledWith('activitypopupclosed', '1');
    });
});
