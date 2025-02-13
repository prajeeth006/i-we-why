import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { OfferStatus } from '@frontend/vanilla/shared/offers';
import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { OffersResourceServiceMock } from '../../../shared/offers/test/offers.mocks';
import { CashierServiceMock } from '../../cashier/test/cashier.mock';
import { InboxCtaActionComponent } from '../src/component-helpers/inbox-cta-action.component';
import { InboxMessage, MessageType } from '../src/services/inbox.models';
import { InboxConfigMock } from './inbox.client-config.mock';
import { CrappyInboxServiceMock, InboxTrackingServiceMock } from './inbox.mocks';

@Component({
    standalone: true,
    template: `@if (message) {
        <lh-inbox-cta-action
            [detailContent]="message.content.detailCallToAction"
            [inboxMessage]="message"
            [inboxCtaActionMessages]="content.messages" />
    }`,
})
export class TestComponent {
    @Input() message: InboxMessage;
    content = { messages: {} };
}

describe('InboxCtaActionComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let crappyInboxServiceMock: CrappyInboxServiceMock;
    let trackingServiceMock: InboxTrackingServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let offersResourceServiceMock: OffersResourceServiceMock;

    beforeEach(waitForAsync(() => {
        crappyInboxServiceMock = MockContext.useMock(CrappyInboxServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        offersResourceServiceMock = MockContext.useMock(OffersResourceServiceMock);
        trackingServiceMock = MockContext.useMock(InboxTrackingServiceMock);
        MockContext.useMock(CashierServiceMock);
        MockContext.useMock(NativeAppServiceMock);
        MockContext.useMock(InboxConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        TestBed.overrideComponent(TestComponent, {
            set: {
                imports: [InboxCtaActionComponent],
            },
        });

        TestBed.inject(WINDOW);
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    describe('tracking', () => {
        it('should track claiming bonus offer', fakeAsync(() => {
            const message = createMessage({
                messageType: MessageType.BONUS_OFFER,
                sourceStatus: OfferStatus.OFFER_NEW,
                offerId: 'offer/id',
                isNoDepositBonus: true,
            });

            component.message = message;
            // component.detailContent = message.content.detailCallToAction;
            fixture.detectChanges();
            tick();

            dispatchCtaButtonClick();
            expect(trackingServiceMock.trackCtaBonusClicked).toHaveBeenCalledWith(message);

            crappyInboxServiceMock.claimOffer.completeWith({ status: OfferStatus.OFFER_CLAIMED });
            tick();
            expect(trackingServiceMock.trackCtaBonusSuccess).toHaveBeenCalledWith(message);
        }));

        it('should track claiming promo offer', fakeAsync(() => {
            const message = createMessage({
                messageType: MessageType.PROMO_TARGET,
                sourceStatus: OfferStatus.OFFERED,
                isNoDepositBonus: true,
                offerId: 'offer/id',
                content: {
                    detailCallToAction: `<a href="/INBOXPAT" class="btn-s3">Deposit Now!</a>`,
                } as any,
            });

            component.message = message;
            fixture.detectChanges();
            tick();
            offersResourceServiceMock.getStatus.completeWith({ status: OfferStatus.OFFERED });

            dispatchCtaButtonClick();
            expect(trackingServiceMock.trackCtaPromoClicked).toHaveBeenCalledWith(message);

            crappyInboxServiceMock.claimOffer.completeWith({ status: OfferStatus.OPTED_IN });
            tick();
            expect(trackingServiceMock.trackCtaPromoSuccess).toHaveBeenCalledWith(message);
        }));

        it('should track claiming eds offer', fakeAsync(() => {
            const message = createMessage({
                messageType: MessageType.EDS_OFFER,
                offerId: 'offer/id',
                sourceStatus: OfferStatus.OFFERED,
                content: {
                    detailCallToAction:
                        '<a title="No Thanks" class="btn-t3" href="https://m.bwin.com/en">Close</a> <a class="btn-t3" href="/INBOXEDS" data-eds-message-opted-out="Opted Out" data-eds-message-opted-in="Bet Now" data-eds-message-offered="Opt in" data-eds-message-not-offered="Ineligible" data-eds-message-invalid="Invalid" data-eds-message-expired="Expired" data-eds-message-error="Error" data-eds-event-id="37817">Opt In</a>\n<p>  </p>',
                } as any,
            });

            component.message = message;
            fixture.detectChanges();
            tick();

            offersResourceServiceMock.getStatus.completeWith({ status: OfferStatus.OFFERED });
            tick();

            dispatchCtaButtonClick();
            expect(trackingServiceMock.trackCtaEdsClicked).toHaveBeenCalledWith(message);

            crappyInboxServiceMock.claimOffer.completeWith({ status: OfferStatus.OPTED_IN });
            tick();
            expect(trackingServiceMock.trackCtaEdsSuccess).toHaveBeenCalledWith(message);
        }));

        it('should call goTo on the button with class btn-cashier', fakeAsync(() => {
            component.message = createMessage({
                messageType: MessageType.EDS_OFFER,
                offerId: 'offer/id',
                content: {
                    detailCallToAction: '<a title="No Thanks" class="btn-t3 ctabutton btn-cashier" href="https://m.bwin.com/en">Deposit now</a>',
                } as any,
            });
            fixture.detectChanges();
            tick();

            dispatchCtaButtonClick();

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('https://m.bwin.com/en');
        }));
    });

    function createMessage(data?: Partial<InboxMessage>) {
        const message = new InboxMessage();
        message.content = {
            detailTitle: 'title',
            detailImage: {
                detailImage: 'https://scmedia.partypremium.com/$-$/b24fa7398a704604889afd4aaa672dba.jpg?p=w430h153camiddlecentercmcrop',
                detailImageLink: 'inbox://cta/#MessageType#/#SourceStatus#/#SOURCE_REFERENCE_ID#',
                detailImageAttrs: {
                    href: 'inbox://cta/#MessageType#/#SourceStatus#/#SOURCE_REFERENCE_ID#',
                },
            },
            detailDescription: '<p>description</p>',
            detailCallToAction: `<a href="inbox://cta/#MessageType#/#SourceStatus#/3990231" class="ctabutton btn-s3">Deposit Now!</a>`,
            shortImage: 'https://scmedia.bwin.com/$-$/9ba5c6fc919543b5bcd4dbd0491c162a.jpg?p=w50h50camiddlecentercmcrop',
            snippetTitle: 'snippet title',
            snippetDescription: '<p>snippet description </p>',
            snippetCallToAction: '<a href="inbox://cta/#MessageType#/#SourceStatus#/#SOURCE_REFERENCE_ID#" class="btn-s3">Claim Now!</a>',
            showManualTermsAndConditions: false,
            isManualTermsAndConditionsEmpty: false,
            expandTermsAndConditionsByDefault: false,
            headerTermsAndConditionsInbox: 'Inbox key terms and conditions',
            inboxImageTitleText: 'image title',
            inboxImageIntroductoryText: 'image intro',
            inboxImageSubtitleText: 'image sub-title',
            inboxImageTitleFontSize: 'SMALL',
            inboxImageTextAlignment: 'RIGHT',
        };

        return Object.assign(message, data || {});
    }

    function dispatchCtaButtonClick() {
        const ctaButton = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.ctabutton');
        ctaButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();
    }
});
