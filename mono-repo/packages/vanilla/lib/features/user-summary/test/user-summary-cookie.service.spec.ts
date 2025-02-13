import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { UserSummaryCookieService } from '../src/user-summary-cookie.service';

describe('UserSummaryCookieService', () => {
    let service: UserSummaryCookieService;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [UserSummaryCookieService, MockContext.providers],
        });

        service = TestBed.inject(UserSummaryCookieService);
    });

    it('read', () => {
        service.read();

        expect(cookieServiceMock.get).toHaveBeenCalledWith('usersummary');
    });

    it('write', () => {
        service.write();

        expect(cookieServiceMock.put).toHaveBeenCalledWith('usersummary', '1');
    });

    it('delete', () => {
        service.delete();

        expect(cookieServiceMock.remove).toHaveBeenCalledWith('usersummary');
    });
});
