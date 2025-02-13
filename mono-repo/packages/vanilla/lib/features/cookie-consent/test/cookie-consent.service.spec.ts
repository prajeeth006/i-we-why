import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { CookieConsentComponent } from '../src/cookie-consent.component';
import { CookieConsentService } from '../src/cookie-consent.service';
import { CookieConsentConfigMock } from './cookie-consent-config.mock';

describe('CookieConsentService', () => {
    let service: CookieConsentService;
    let overlayMock: OverlayFactoryMock;
    let cookieConsentConfigMock: CookieConsentConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let overlayRef: OverlayRefMock;
    let dslServiceMock: DslServiceMock;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        cookieConsentConfigMock = MockContext.useMock(CookieConsentConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, CookieConsentService],
        });

        service = TestBed.inject(CookieConsentService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
        cookieConsentConfigMock.condition = 'cond';
    });

    describe('tryShowCookieConsent', () => {
        it('should create an overlay if condition is true', () => {
            service.tryShowCookieConsent();

            cookieConsentConfigMock.whenReady.next();
            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('cond');
            dslServiceMock.evaluateExpression.next(true);

            const expectedConfig = {
                hasBackdrop: false,
                panelClass: 'vn-cookie-consent-container',
                scrollStrategy: 'noop',
                positionStrategy: new MockPositionStrategies(),
            };
            expectedConfig.positionStrategy.position = 'gb';

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<CookieConsentComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(CookieConsentComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.tryShowCookieConsent();

            cookieConsentConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.next(true);
            dslServiceMock.evaluateExpression.next(true);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });

        it('should not hide overlay multiple times', () => {
            service.tryShowCookieConsent();

            cookieConsentConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.next(true);
            dslServiceMock.evaluateExpression.next(false);
            overlayRef.detachments.next();
            dslServiceMock.evaluateExpression.next(false);

            expect(overlayRef.detach).toHaveBeenCalledTimes(1);
        });

        it('should hide the overlay if condition is false', () => {
            service.tryShowCookieConsent();

            cookieConsentConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.next(true);
            dslServiceMock.evaluateExpression.next(false);

            expect(overlayRef.detach).toHaveBeenCalled();
            overlayRef.detachments.next();

            expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
        });

        it('should not open the overlay again after its accepted', () => {
            service.tryShowCookieConsent();

            cookieConsentConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.next(true);

            cookieServiceMock.get.withArgs('euconsent').and.returnValue('a');
            overlayRef.detachments.next();
            overlayMock.create.calls.reset();

            dslServiceMock.evaluateExpression.next(true);

            expect(overlayMock.create).not.toHaveBeenCalled();
        });

        it('should not open overlay if it was already accepted', () => {
            cookieServiceMock.get.withArgs('euconsent').and.returnValue('a');

            service.tryShowCookieConsent();

            expect(overlayMock.create).not.toHaveBeenCalled();
        });

        it('should store navigation count in the cookie', () => {
            service.tryShowCookieConsent();

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(cookieServiceMock.put).toHaveBeenCalledWith('euconsent', '1', jasmine.anything());

            cookieServiceMock.get.withArgs('euconsent').and.returnValue('1');
            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(cookieServiceMock.put).toHaveBeenCalledWith('euconsent', '2', jasmine.anything());
        });

        it('should overwrite the cookie after its accepted', () => {
            service.tryShowCookieConsent();

            cookieConsentConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.next(true);

            cookieServiceMock.get.withArgs('euconsent').and.returnValue('a');
            overlayRef.detachments.next();
            overlayMock.create.calls.reset();

            dslServiceMock.evaluateExpression.next(true);

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(cookieServiceMock.put).not.toHaveBeenCalled();
        });
    });
});
