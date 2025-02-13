import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { RedirectMessageComponent } from '../src/redirect-message.component';
import { RedirectMessageConfigMock, RedirectMessageTrackingServiceMock } from './redirect-messages.mocks';

describe('RedirectMessageComponent', () => {
    let fixture: ComponentFixture<RedirectMessageComponent>;

    let redirectConfigMock: RedirectMessageConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let overlayRefMock: OverlayRefMock;
    let redirectMessageTrackingServiceMock: RedirectMessageTrackingServiceMock;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        redirectConfigMock = MockContext.useMock(RedirectMessageConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        redirectMessageTrackingServiceMock = MockContext.useMock(RedirectMessageTrackingServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        redirectConfigMock.currentLabel = 'bwin.com';
        redirectConfigMock.redirectLabel = 'bwin.es';
        redirectConfigMock.url = 'www.bwin.es';

        TestBed.overrideComponent(RedirectMessageComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(RedirectMessageComponent);
        fixture.detectChanges();
    });

    describe('init', () => {
        it('should set content', () => {
            expect(fixture.componentInstance.message()).toBe('You will be redirected to bwin.es');
            expect(fixture.componentInstance.continueTo()).toBe('bwin.es');
            expect(fixture.componentInstance.returnTo()).toBe(redirectConfigMock.content.messages?.['return']);
            expect(redirectMessageTrackingServiceMock.trackDisplay).toHaveBeenCalledWith('bwin.com', 'bwin.es');
        });
    });

    describe('redirect()', () => {
        it('should close overlay write a cookie and redirect', () => {
            cookieServiceMock.get.withArgs('redirectMsgShown').and.returnValue('1');

            fixture.componentInstance.redirect();

            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(cookieServiceMock.put).toHaveBeenCalledWith('redirectMsgShown', '1');
            expect(redirectMessageTrackingServiceMock.trackRedirect).toHaveBeenCalledWith('bwin.com', 'bwin.es');
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(redirectConfigMock.url);
        });
    });

    describe('close()', () => {
        it('should close overlay and write a cookie', () => {
            cookieServiceMock.get.withArgs('redirectMsgShown').and.returnValue('1');

            fixture.componentInstance.close();

            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(cookieServiceMock.put).toHaveBeenCalledWith('redirectMsgShown', '1');
            expect(redirectMessageTrackingServiceMock.trackReturn).toHaveBeenCalledWith('bwin.com', 'bwin.es');
        });
    });
});
