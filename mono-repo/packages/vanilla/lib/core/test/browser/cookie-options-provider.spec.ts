import { TestBed } from '@angular/core/testing';

import { SameSiteMode } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieOptionsProvider } from '../../src/browser/cookie/cookie-options-provider';
import { PageMock } from '../browsercommon/page.mock';

describe('CookieOptionsProvider', () => {
    let provider: CookieOptionsProvider;
    let pageMock: PageMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CookieOptionsProvider],
        });

        pageMock.cookies.sameSiteMode = SameSiteMode.None;
        pageMock.cookies.secure = true;
        pageMock.domain = 'domain';

        provider = TestBed.inject(CookieOptionsProvider);
    });

    it('should return default cookie options', () => {
        expect(provider.options).toEqual({ path: '/', sameSite: SameSiteMode.None, secure: true, domain: 'domain', httpOnly: false });
    });
});
