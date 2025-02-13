import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieConsentBootstrapService } from '../src/cookie-consent-bootstrap.service';
import { CookieConsentServiceMock } from './cookie-consent.mock';

describe('CookieConsentBootstrapService', () => {
    let service: CookieConsentBootstrapService;
    let cookieConsentServiceMock: CookieConsentServiceMock;

    beforeEach(() => {
        cookieConsentServiceMock = MockContext.useMock(CookieConsentServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CookieConsentBootstrapService],
        });

        service = TestBed.inject(CookieConsentBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should setup menu item templates', () => {
            service.onFeatureInit();

            expect(cookieConsentServiceMock.tryShowCookieConsent).toHaveBeenCalled();
        });
    });
});
