import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OneTrustMock, WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { CookieServiceMock } from '../../../core/test';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { CookieBannerService } from '../src/cookie-banner.service';

describe('CookieBannerService', () => {
    let service: CookieBannerService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let pageMock: PageMock;
    let cookieMock: CookieServiceMock;
    let logMock: LoggerMock;
    let windowMock: WindowMock;
    const groups: string = 'C0001:1,C0004:1,C0002:1,C0003:1';
    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        cookieMock = MockContext.useMock(CookieServiceMock);
        logMock = MockContext.useMock(LoggerMock);
        windowMock = new WindowMock();
        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                CookieBannerService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(CookieBannerService);
        cookieMock.get
            .withArgs('OptanonConsent')
            .and.returnValue(
                'isGpcEnabled=0&datestamp=Thu+Aug+22+2024+07:41:09+GMT+0530+(India+Standard+Time)&version=202403.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=8bf1daae-2860-41a1-bbd3-c6ef6cd8093c&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001:1,C0004:1,C0002:1,C0003:1',
            );
        pageMock.singleSignOnLabels = ['https://www.galacasino.com', 'https://www.galabingo.com', 'https://www.galaspins.com'];
        pageMock.domain = '.galaspins.com';
    });

    describe('setOptanonGroupCookie', () => {
        it('call post for configured labels', () => {
            windowMock.OneTrust = new OneTrustMock();
            spyOn(windowMock.OneTrust, 'OnConsentChanged').and.callThrough();
            service.setOptanonGroupCookie();

            expect(getCallArguments(apiServiceMock.post)).toEqual([
                [
                    'cookiebanner/setOptanonGroupCookie',
                    { cookieValue: groups },
                    { prefix: '', baseUrl: 'https://www.galacasino.com', withCredentials: true, showSpinner: false },
                ],
                [
                    'cookiebanner/setOptanonGroupCookie',
                    { cookieValue: groups },
                    { prefix: '', baseUrl: 'https://www.galabingo.com', withCredentials: true, showSpinner: false },
                ],
            ]);

            apiServiceMock.post.next();
            apiServiceMock.post.next({}, 1);

            expect(getCallArguments(logMock.info).map((args) => args[0])).toEqual([
                'Cookie Banner: Successfully called https://www.galacasino.com/api/cookiebanner/setCookie',
                'Cookie Banner: Successfully called https://www.galabingo.com/api/cookiebanner/setCookie',
            ]);
        });

        it('should log error is call fails', () => {
            windowMock.OneTrust = new OneTrustMock();
            service.setOptanonGroupCookie();
            spyOn(windowMock.OneTrust, 'OnConsentChanged').and.callThrough();

            apiServiceMock.post.error({});
            apiServiceMock.post.error({}, 1);

            expect(getCallArguments(logMock.info).map((args) => args[0])).toEqual([
                'Cookie Banner: Failed to call https://www.galacasino.com/api/cookiebanner/setCookie',
                'Cookie Banner: Failed to call https://www.galabingo.com/api/cookiebanner/setCookie',
            ]);
        });

        it('should not call api if config is empty', () => {
            pageMock.singleSignOnLabels = ['https://www.galaspins.com'];
            service.setOptanonGroupCookie();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        });

        it('should not call api if window dont have OneTrust', () => {
            windowMock.OneTrust = null;
            pageMock.singleSignOnLabels = ['https://www.galaspins.com'];
            service.setOptanonGroupCookie();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
            expect(getCallArguments(logMock.info)).toEqual([['Cookie Banner: OneTrust missing on window']]);
        });
    });

    function getCallArguments(serviceMock: jasmine.Spy) {
        return serviceMock.calls.all().map((call: any) => call.args);
    }
});
