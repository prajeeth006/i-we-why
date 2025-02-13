import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { CookieConsentComponent } from '../src/cookie-consent.component';
import { CookieConsentConfigMock } from './cookie-consent-config.mock';
import { CookieConsentTrackingServiceMock } from './cookie-consent-tracking.mock';

describe('CookieConsentComponent', () => {
    let fixture: ComponentFixture<CookieConsentComponent>;
    let overlayRefMock: OverlayRefMock;
    let cookieServiceMock: CookieServiceMock;
    let cookieConsentTrackingServiceMock: CookieConsentTrackingServiceMock;

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        cookieConsentTrackingServiceMock = MockContext.useMock(CookieConsentTrackingServiceMock);
        MockContext.useMock(CookieConsentConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(CookieConsentComponent);
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track', () => {
            expect(cookieConsentTrackingServiceMock.trackLoad).toHaveBeenCalled();
        });
    });

    describe('close()', () => {
        it('should close overlay and write a cookie', () => {
            cookieServiceMock.get.withArgs('euconsent').and.returnValue('12');

            fixture.componentInstance.close();

            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(cookieServiceMock.put).toHaveBeenCalledWith('euconsent', 'a', jasmine.anything());
            expect(cookieConsentTrackingServiceMock.trackAccept).toHaveBeenCalledWith('12');
        });
    });
});
