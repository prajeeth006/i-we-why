import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { DynamicHtmlDirective, EmbeddableComponentsService, QuerySearchParams } from '@frontend/vanilla/core';
import { OfferButtonComponent } from '@frontend/vanilla/features/offer-button';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { AnchorTrackingHelperServiceMock } from '../../../core/test/plain-link/anchore-tracking-helper-service.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OfferButtonBootstrapService } from '../../../features/offer-button/src/offer-button-bootstrap.service';
import { EdsGroupServiceMock } from '../../../shared/eds-group/test/eds-group.mocks';
import { OffersResourceServiceMock } from '../../../shared/offers/test/offers.mocks';
import { setupComponentFactoryResolver } from '../../../test/test-utils';
import { OfferButtonConfigMock } from './offer-content.mock';

@Component({
    template: '<div [vnDynamicHtml]="template"></div>',
})
class TestHostComponent {
    template: string = `<span   data-offer-id="123" class="btn" data-offer-type="eds"
                                data-offer-message-offered="Click me"
                                data-offer-message-opted-in="Successfully Opted In"
                                data-offer-message-expired=""
                                data-offer-message-error="Oups"></span>`;
}

describe('OfferButtonComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let offersResourceServiceMock: OffersResourceServiceMock;
    let userMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let urlServiceMock: UrlServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let offerConfig: OfferButtonConfigMock;
    let trackingServiceMock: TrackingServiceMock;
    let anchorTrackingHelperServiceMock: AnchorTrackingHelperServiceMock;

    beforeEach(waitForAsync(() => {
        offersResourceServiceMock = MockContext.useMock(OffersResourceServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        offerConfig = MockContext.useMock(OfferButtonConfigMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        anchorTrackingHelperServiceMock = MockContext.useMock(AnchorTrackingHelperServiceMock);
        MockContext.useMock(EdsGroupServiceMock);

        TestBed.configureTestingModule({
            imports: [OfferButtonComponent, DynamicHtmlDirective],
            providers: [MockContext.providers, EmbeddableComponentsService, OfferButtonBootstrapService],
            declarations: [TestHostComponent],
        });
        setupComponentFactoryResolver();

        const bootstrapService: OfferButtonBootstrapService = TestBed.inject(OfferButtonBootstrapService);
        navigationServiceMock.location.search = new QuerySearchParams('');
        const activeUrlMock = new ParsedUrlMock();
        activeUrlMock.absUrl.and.returnValue('http://domain/path?offerId=123&offerType=eds');
        activeUrlMock.search = new QuerySearchParams('');
        urlServiceMock.current.and.returnValue(activeUrlMock);
        bootstrapService.onFeatureInit();
        offerConfig.whenReady.next();
    }));

    function initComponent() {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        offerConfig.whenReady.next();
    }

    function getElement(): HTMLElement {
        return fixture.nativeElement.querySelector('span');
    }

    describe('init', () => {
        let element: HTMLElement;

        beforeEach(() => {
            initComponent();
            element = getElement();
        });

        it('should indicate initial loading', fakeAsync(() => {
            tick();
            fixture.detectChanges();
            expect(element).toHaveText('');
            expect(element).not.toHaveAttr('data-offer-status');
            expect(element).toHaveClass('offer-button-loading');
        }));

        it('should load status and show corresponding text', fakeAsync(() => {
            offersResourceServiceMock.getStatus.completeWith({ status: 'Offered' });
            tick();
            fixture.detectChanges();

            expect(element).toHaveText('Click me');
            expect(element).toHaveAttr('data-offer-status', 'offered');
            expect(element).not.toHaveClass('offer-button-loading');
            expect(element).toHaveClass('offer-button-md');
            expect(offersResourceServiceMock.getStatus).toHaveBeenCalledWith('eds', '123');
        }));

        it('should load status and show corresponding text v2', fakeAsync(() => {
            offerConfig.v2 = true;
            offersResourceServiceMock.getStatus.completeWith({ status: 'Offered' });
            tick();
            fixture.detectChanges();

            expect(element.innerHTML).toBe('<span class="info theme-info-i offered"></span><span>Click me</span>');
            expect(element).toHaveAttr('data-offer-status', 'offered');
            expect(element).not.toHaveClass('offer-button-loading');
            expect(element).toHaveClass('offer-button-md');
            expect(offersResourceServiceMock.getStatus).toHaveBeenCalledWith('eds', '123');
        }));

        it('should load status and show corresponding text for raw Api uppercase values', fakeAsync(() => {
            offersResourceServiceMock.getStatus.completeWith({ status: 'OFFERED' });
            tick();
            fixture.detectChanges();

            expect(element).toHaveText('Click me');
            expect(element).toHaveAttr('data-offer-status', 'offered');
            expect(offersResourceServiceMock.getStatus).toHaveBeenCalledWith('eds', '123');
        }));

        it('should load status and show fallback status text on empty element attribute', fakeAsync(() => {
            offersResourceServiceMock.getStatus.completeWith({ status: 'expired' });
            tick();
            fixture.detectChanges();

            expect(element.innerText).toBe(offerConfig.content.messages!['expired']!);
        }));

        it('should load status and show unknown status text on empty response', fakeAsync(() => {
            offersResourceServiceMock.getStatus.completeWith({ status: '' });
            tick();
            fixture.detectChanges();

            expect(element.innerText).toBe(offerConfig.content.messages!['unknown']!);
        }));

        it('should opt into offer event on click when receiving raw Api uppercase values for authenticated user', fakeAsync(() => {
            offersResourceServiceMock.getStatus.completeWith({ status: 'OFFERED' });
            anchorTrackingHelperServiceMock.getTrackingEventName.and.returnValue('Event.Tracking');
            anchorTrackingHelperServiceMock.createTrackingData.and.returnValue({
                'component.CategoryEvent': 'promo hub',
                'component.LabelEvent': 'gala rewards',
                'component.ActionEvent': 'click test',
                'component.EventDetails': 'opt in',
            });
            tick();
            fixture.detectChanges();

            element.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(element).toHaveClass('offer-button-loading');
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'promo hub',
                'component.LabelEvent': 'gala rewards',
                'component.ActionEvent': 'click',
                'component.EventDetails': 'opt in',
            });

            offersResourceServiceMock.updateStatus.completeWith({ status: 'OPTED_IN' });
            tick();
            fixture.detectChanges();

            expect(element).toHaveText('Successfully Opted In');
            expect(element).toHaveAttr('data-offer-status', 'opted-in');
            expect(element).not.toHaveClass('offer-button-loading');
            expect(offersResourceServiceMock.updateStatus).toHaveBeenCalledWith('eds', '123');
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'promo hub',
                'component.LabelEvent': 'gala rewards',
                'component.ActionEvent': 'success opt-in',
                'component.EventDetails': 'you have opted in',
            });
        }));

        it('should handle error response', fakeAsync(() => {
            offersResourceServiceMock.getStatus.completeWith({ status: 'Error' });
            tick();
            fixture.detectChanges();

            expect(element).toHaveText('Oups');
            expect(element).toHaveAttr('data-offer-status', 'error');
            expect(element).not.toHaveClass('offer-button-loading');
        }));
    });

    describe('offer details in url', () => {
        it('should opt into offer for authenticated user', fakeAsync(() => {
            navigationServiceMock.location.search = new QuerySearchParams('offerId=123&offerType=eds');
            initComponent();
            const element = getElement();

            offersResourceServiceMock.getStatus.completeWith({ status: 'Offered' });

            tick();
            offersResourceServiceMock.updateStatus.completeWith({ status: 'OptedIn' });
            tick();
            fixture.detectChanges();

            expect(element).toHaveText('Successfully Opted In');
            expect(element).toHaveAttr('data-offer-status', 'opted-in');
            expect(element).not.toHaveClass('offer-button-loading');
            expect(offersResourceServiceMock.updateStatus).toHaveBeenCalledWith('eds', '123');
        }));

        it('should redirect unauthenticated user to mean of logging in, then opt in after he logged in', fakeAsync(() => {
            userMock.isAuthenticated = false;
            navigationServiceMock.location.search = new QuerySearchParams('offerId=123&offerType=eds');
            initComponent();
            tick(50);
            const element = getElement();

            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('gotoLogin', 'OfferButton', [
                undefined,
                undefined,
                { returnUrl: 'http://domain/path?offerId=123&offerType=eds' },
            ]);

            menuActionsServiceMock.invoke.resolve();
            userMock.isAuthenticated = true;
            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            offersResourceServiceMock.getStatus.completeWith({ status: 'Offered' });
            tick();
            fixture.detectChanges();

            offersResourceServiceMock.updateStatus.completeWith({ status: 'OPTED_IN' });
            tick();
            fixture.detectChanges();

            expect(element).toHaveText('Successfully Opted In');
            expect(element).toHaveAttr('data-offer-status', 'opted-in');
            expect(element).not.toHaveClass('offer-button-loading');
            expect(offersResourceServiceMock.updateStatus).toHaveBeenCalledWith('eds', '123');
        }));
    });

    it('should not make any request for unauthenticated user', fakeAsync(() => {
        userMock.isAuthenticated = false;

        initComponent();
        tick(50);
        fixture.detectChanges();
        const element = getElement();
        expect(offersResourceServiceMock.getStatus).not.toHaveBeenCalled();

        expect(element).toHaveText('Click me');
        expect(element).toHaveAttr('data-offer-status', 'offered');
        expect(element).not.toHaveClass('offer-button-loading');
    }));

    it('should redirect unauthenticated user to mean of logging in, then opt in after he redirected back to the page with the offer button', fakeAsync(() => {
        userMock.isAuthenticated = false;
        initComponent();
        tick(50);
        const element = getElement();

        element.dispatchEvent(new Event('click'));
        expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('gotoLogin', 'OfferButton', [
            undefined,
            undefined,
            { returnUrl: 'http://domain/path?offerId=123&offerType=eds' },
        ]);

        menuActionsServiceMock.invoke.resolve();
        userMock.isAuthenticated = true;
        navigationServiceMock.location.search = new QuerySearchParams('offerId=123&offerType=eds');
        navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

        offersResourceServiceMock.getStatus.completeWith({ status: 'Offered' });
        tick();
        fixture.detectChanges();

        offersResourceServiceMock.updateStatus.completeWith({ status: 'OPTED_IN' });
        tick();
        fixture.detectChanges();
        expect(element).toHaveText('Successfully Opted In');
        expect(element).toHaveAttr('data-offer-status', 'opted-in');
        expect(element).not.toHaveClass('offer-button-loading');
        expect(offersResourceServiceMock.updateStatus).toHaveBeenCalledWith('eds', '123');
    }));

    testClass('OFFERED', ['ds-button']);
    testClass('NOT_OFFERED', ['info', 'theme-info-i']);
    testClass('EXPIRED', ['info', 'theme-info-i']);
    testClass('OPTED_IN', ['success', 'theme-success-i']);
    testClass('OPTED_OUT', ['info', 'theme-info-i']);
    testClass('INVALID', ['danger', 'theme-error-i']);
    testClass('ERROR', ['danger', 'theme-error-i']);

    function testClass(status: string, classes: string[]) {
        it(`should set class based on status ${status}`, fakeAsync(() => {
            initComponent();
            const element = getElement();
            offersResourceServiceMock.getStatus.completeWith({ status });
            tick();
            fixture.detectChanges();

            expect(element).toHaveClass('offer-button-md');
            classes.forEach((c) => expect(element).toHaveClass(c));
        }));
    }
});

@Component({
    template: '<div [vnDynamicHtml]="template"></div>',
})
class EdsGroupTestHostComponent {
    template: string = `<span data-campaign-id="123" data-eds-group-id="5" class="btn" data-offer-type="EDSGroup"
                                data-offer-message-offered="Click me"
                                data-offer-message-opted-in="Successfully Opted In"
                                data-offer-message-expired=""
                                data-offer-message-error="Oups"></span>`;
}

describe('OfferButtonComponent with eds group', () => {
    let fixture: ComponentFixture<EdsGroupTestHostComponent>;
    let edsGroupServiceMock: EdsGroupServiceMock;
    let offerConfig: OfferButtonConfigMock;

    beforeEach(waitForAsync(() => {
        MockContext.useMock(OffersResourceServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(UrlServiceMock);
        offerConfig = MockContext.useMock(OfferButtonConfigMock);
        edsGroupServiceMock = MockContext.useMock(EdsGroupServiceMock);

        TestBed.configureTestingModule({
            imports: [OfferButtonComponent, DynamicHtmlDirective],
            providers: [MockContext.providers, EmbeddableComponentsService, OfferButtonBootstrapService],
            declarations: [EdsGroupTestHostComponent],
        });
        setupComponentFactoryResolver();

        const bootstrapService: OfferButtonBootstrapService = TestBed.inject(OfferButtonBootstrapService);
        bootstrapService.onFeatureInit();
        offerConfig.whenReady.next();
    }));

    function initComponent() {
        fixture = TestBed.createComponent(EdsGroupTestHostComponent);
        fixture.detectChanges();
        offerConfig.whenReady.next();
    }

    function getElement(): HTMLElement {
        return fixture.nativeElement.querySelector('span');
    }

    it('should opt into eds group offer event on click when receiving raw Api uppercase values for authenticated user', fakeAsync(() => {
        initComponent();
        const element = getElement();
        edsGroupServiceMock.refreshEdsGroupStatus.next('5');
        edsGroupServiceMock.getCampaignStatus.and.returnValue('OFFERED');
        edsGroupServiceMock.freshCampaignDetails.next('5');
        tick();
        element.dispatchEvent(new Event('click'));

        edsGroupServiceMock.updateCampaignStatus.resolve('OPTED_IN');
        edsGroupServiceMock.getCampaignStatus.and.returnValue('OPTED_IN');
        edsGroupServiceMock.freshCampaignDetails.next('5');
        tick();
        fixture.detectChanges();

        expect(element).toHaveText('Successfully Opted In');
        expect(element).toHaveAttr('data-offer-status', 'opted-in');
        expect(element).not.toHaveClass('offer-button-loading');
        expect(edsGroupServiceMock.updateCampaignStatus).toHaveBeenCalledWith('5', '123');
    }));
});
