import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    inject,
} from '@angular/core';

import { CashierService, NativeAppService, NavigationService, TimerService, WINDOW } from '@frontend/vanilla/core';
import { OfferResponse, OfferStatus, OfferType, OffersResourceService } from '@frontend/vanilla/shared/offers';
import { first } from 'rxjs/operators';

import { CtaAction, CtaActionType } from '../inbox.models';
import { CrappyInboxService } from '../services/crappy-inbox.service';
import { InboxTrackingService } from '../services/inbox-tracking.service';
import { InboxConfig } from '../services/inbox.client-config';
import { InboxMessage, MessageType } from '../services/inbox.models';
import { InboxCtaContentComponent } from './inbox-content.component';

const OFFER_MESSAGE_CLASS = 'offer-message';

@Component({
    standalone: true,
    imports: [InboxCtaContentComponent],
    selector: 'lh-inbox-cta-action',
    template: `
        <ng-content />
        <vn-inbox-cta-content [content]="detailContent" />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxCtaActionComponent implements OnChanges, OnDestroy {
    @Output() action: EventEmitter<CtaAction> = new EventEmitter();
    @Input() inboxMessage: InboxMessage;
    @Input() inboxCtaActionMessages: any;
    @Input() detailContent: string;
    @ViewChild(InboxCtaContentComponent, { read: ElementRef, static: true }) contentItem: ElementRef;

    private ctaElements: HTMLAnchorElement[];
    private linksClickListeners: (() => void)[] = [];
    private ctaHrefIndicator: string = 'inbox://cta/';
    private ctaEdsHrefIndicator: string = '/INBOXEDS';
    private ctaPatHrefIndicator: string = '/INBOXPAT';
    private document: Document;
    readonly #window = inject(WINDOW);

    constructor(
        private elementRef: ElementRef,
        private navigation: NavigationService,
        private cashierService: CashierService,
        private renderer: Renderer2,
        private inboxService: CrappyInboxService,
        private nativeApplication: NativeAppService,
        private tracking: InboxTrackingService,
        private offersResourceService: OffersResourceService,
        private inboxConfig: InboxConfig,
        private timerService: TimerService,
    ) {
        this.document = this.#window.document;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.detailContent || changes.inboxMessage) {
            this.bindImageLinkClick();

            if (this.detailContent) {
                this.timerService.setTimeout(() => this.handleInjectedContent(this.contentItem));
            }
        }
    }

    ngOnDestroy() {
        if (this.linksClickListeners) {
            this.linksClickListeners.forEach((listener: () => void) => {
                if (listener) {
                    listener();
                }
            });
        }
    }

    private bindImageLinkClick() {
        // close inbox on clickable img
        const imageLinks = this.elementRef.nativeElement.querySelectorAll('a[class="ctaImageLink"]');

        for (let n = 0; n < imageLinks.length; n++) {
            const link = imageLinks[n];

            if (link.tagName === 'A') {
                this.bindHideInbox(link);
            }
        }
    }

    private handleInjectedContent(parentElement: ElementRef) {
        if (Object.keys(this.inboxMessage).length > 0) {
            if (!this.inboxCtaActionMessages) {
                return;
            }

            const depositDeepLinks = this.getDepositDeepLinks(parentElement);
            depositDeepLinks.forEach(this.handleDepositDeepLink.bind(this));

            this.ctaElements = this.getCtaElements(parentElement);
            this.bindElementsToHideInboxEvent(parentElement);

            // CTA element logic
            this.ctaElements.forEach((ctaElement: HTMLAnchorElement) => {
                this.handleCtaElement(ctaElement);
            });
            this.setTargetTopAttributeToLinksWithSameHost(parentElement);
            this.bindCashierLinks(parentElement);
        }
    }

    private handleCtaElement(ctaElement: HTMLAnchorElement) {
        const msg = this.inboxMessage;
        ctaElement.classList.add('btn', 'send', 'ctabutton');
        this.renderer.setAttribute(ctaElement, 'sitecoreid', msg.sitecoreId);
        const isCta: boolean = !!ctaElement.href.match(new RegExp(this.ctaHrefIndicator, 'igm'));
        const isInboxEds: boolean = !!ctaElement.href.match(new RegExp(this.ctaEdsHrefIndicator, 'igm'));
        const isInboxPat: boolean = !!ctaElement.href.match(new RegExp(this.ctaPatHrefIndicator, 'igm'));

        if (!msg.offerId && (!ctaElement.getAttribute('data-eds-event-id') || ctaElement.getAttribute('data-eds-event-id') === '[empty]')) {
            this.setElementIsHidden(ctaElement, true);
        } else {
            const edsEventId = ctaElement.attributes.getNamedItem('data-eds-event-id');
            msg.offerId = edsEventId && edsEventId.textContent !== '[empty]' ? edsEventId.textContent! : msg.offerId;

            if (isCta) {
                this.handleBonusMessage(ctaElement);
            } else if (isInboxEds || isInboxPat) {
                const offerType = isInboxPat ? OfferType.PROMOS : OfferType.EDS;
                this.setElementIsDisable(ctaElement, true);

                //get current message status
                this.offersResourceService
                    .getStatus(offerType, msg.offerId)
                    .pipe(first())
                    .subscribe({
                        next: (response: OfferResponse) => {
                            response.status
                                ? this.handleEdsMessage(ctaElement, response.status, offerType)
                                : this.handleMessage(ctaElement, offerType);
                        },
                        error: () => {
                            this.handleMessage(ctaElement, offerType);
                        },
                    });
            }
        }
        if (isCta || isInboxEds || isInboxPat) {
            ctaElement.href = 'javascript:void(0)';
        } //else deep link
    }

    private getCtaElements(parentElement: ElementRef): HTMLAnchorElement[] {
        return [
            ...Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll(`a[href^="${this.ctaHrefIndicator}"]`)),
            ...Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll(`a[href^="${this.ctaEdsHrefIndicator}"]`)),
            ...Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll(`a[href^="${this.ctaPatHrefIndicator}"]`)),
        ];
    }

    private getDepositDeepLinks(parentElement: ElementRef): HTMLAnchorElement[] {
        return Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll('a[data-bonuscode]'));
    }

    private handleDepositDeepLink(el: HTMLAnchorElement): void {
        const attrs: { [key: string]: string } = {};
        Array.from(el.attributes).forEach((a) => (attrs[a.name] = a.value));

        if (this.inboxService.isDepositBonusLink(el.href, attrs)) {
            el.href = this.inboxService.getDepositBonusLink(el.href, attrs);
        }
    }

    private bindElementsToHideInboxEvent(parentElement: ElementRef): void {
        // close inbox on click any link
        const linkWithoutButtons = parentElement.nativeElement.querySelectorAll('a[class*="LinkWithoutButton"]');

        for (let i = 0; i < linkWithoutButtons.length; i++) {
            this.bindHideInbox(linkWithoutButtons[i]);
        }
    }

    private setTargetTopAttributeToLinksWithSameHost(parentElement: ElementRef) {
        // Solves that the link doesn't close the inbox message when the href is the same as the current window location.
        const allButtons = parentElement.nativeElement.querySelectorAll('a[class*="btn"]');

        allButtons.forEach((linkButton: HTMLAnchorElement) => {
            if (linkButton.host === this.#window.location.host) {
                this.renderer.setProperty(linkButton, 'target', '_top');
            }
        });
    }

    private bindCashierLinks(parentElement: ElementRef) {
        const allButtons = parentElement.nativeElement.querySelectorAll('a[class*="btn-cashier"]');

        allButtons.forEach((linkButton: HTMLAnchorElement) => {
            this.linksClickListeners.push(
                this.renderer.listen(linkButton, 'click', (event: Event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (linkButton.href) {
                        this.action.emit({
                            type: CtaActionType.HideInbox,
                        });
                        this.navigation.goTo(linkButton.href);
                    }
                }),
            );
        });
    }

    private bindHideInbox(ctaElement: HTMLAnchorElement) {
        this.linksClickListeners.push(
            this.renderer.listen(ctaElement, 'click', (event: Event) => {
                this.action.emit({
                    type: CtaActionType.HideInbox,
                });
                event.stopPropagation();
            }),
        );
    }

    private handleEdsMessage(ctaElement: HTMLAnchorElement, sourceStatus: OfferStatus, offerType: string): void {
        this.setElementIsHidden(ctaElement, false);
        this.setElementIsDisable(ctaElement, false);

        switch (sourceStatus) {
            case OfferStatus.OFFERED:
                const unbind: () => void = this.renderer.listen(ctaElement, 'click', (event: Event) => {
                    event.stopPropagation();
                    offerType === OfferType.EDS
                        ? this.tracking.trackCtaEdsClicked(this.inboxMessage)
                        : this.tracking.trackCtaPromoClicked(this.inboxMessage);

                    this.claimCta(ctaElement, offerType);
                    unbind();
                });
                this.linksClickListeners.push(unbind);
                break;
            case OfferStatus.NOTOFFERED:
            case OfferStatus.NOT_OFFERED:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-not-offered', this.inboxCtaActionMessages['NotEligible']);
                break;
            case OfferStatus.EXPIRED:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-expired', this.inboxCtaActionMessages['Expired']);
                break;
            case OfferStatus.OPTEDIN:
            case OfferStatus.OPTED_IN:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-opted-in', this.inboxCtaActionMessages['YouHaveOptedIn']);
                break;
            case OfferStatus.OPTEDOUT:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-opted-out', this.inboxCtaActionMessages['YouHaveOptedOut']);
                break;
            case OfferStatus.INVALID:
                this.setElementIsDisable(ctaElement, true);
                break;
            case OfferStatus.NO_OFFER:
                this.setElementIsHidden(ctaElement, true);
                break;
            default:
                this.setElementIsDisable(ctaElement, true);
                if (this.inboxCtaActionMessages[`${sourceStatus}_BUTTON`]) {
                    this.renderer.setProperty(ctaElement, 'innerText', this.inboxCtaActionMessages[`${sourceStatus}_BUTTON`]);
                }
        }
        this.setOfferMessageContainer(ctaElement, false, sourceStatus);
    }

    private setTextFormAttr(ctaElement: HTMLAnchorElement, textProperty: string, backupText: string): void {
        const attr = ctaElement.attributes.getNamedItem(textProperty);

        if (attr && attr.textContent !== '[empty]') {
            this.renderer.setProperty(ctaElement, 'innerText', attr.textContent);
        } else if (backupText) {
            this.renderer.setProperty(ctaElement, 'innerText', backupText);
        }
    }

    private setElementIsHidden(element: HTMLAnchorElement, isHidden: boolean) {
        this.renderer.setStyle(element, 'display', isHidden ? 'none' : '');
    }

    private claimCta(ctaElement: HTMLAnchorElement, offerType: string) {
        this.setElementIsDisable(ctaElement, true);
        const edsEventId = ctaElement.attributes.getNamedItem('data-eds-event-id');
        const offerId = edsEventId && edsEventId.textContent !== '[empty]' ? edsEventId.textContent! : this.inboxMessage.offerId;

        this.inboxService.claimOffer(offerType, offerId).subscribe({
            next: (response: OfferResponse) => {
                this.action.emit({
                    type: CtaActionType.ClaimOfferSuccess,
                    value: response,
                });

                if (response.status === OfferStatus.OPTED_IN || response.status === OfferStatus.OFFER_CLAIMED) {
                    // pass list and current CTA buttons for update
                    const ctaList = [ctaElement];
                    this.renderer.removeAttribute(ctaElement, 'disabled');
                    this.onClaimCtaSuccess(ctaList);
                }
                this.setOfferMessageContainer(ctaElement, false, response.status);
            },
            error: () => {
                this.renderer.removeAttribute(ctaElement, 'disabled');
            },
        });
    }

    private onClaimCtaSuccess(ctaElements: HTMLAnchorElement[]) {
        //Set Claim Button
        this.updateElementOnClaimCtaSuccess(ctaElements);
        this.launchGame();
    }

    private updateElementOnClaimCtaSuccess(ctaElements: HTMLAnchorElement[]) {
        for (let i = 0; i < ctaElements.length; i++) {
            const ctaElement = ctaElements[i]!;

            if (this.inboxMessage.messageType === MessageType.BONUS_OFFER) {
                this.tracking.trackCtaBonusSuccess(this.inboxMessage);
                this.renderer.setProperty(ctaElement, 'innerText', this.inboxCtaActionMessages.Claimed);
            } else if (this.inboxMessage.messageType === MessageType.EDS_OFFER) {
                this.tracking.trackCtaEdsSuccess(this.inboxMessage);
                this.setTextFormAttr(ctaElement, 'data-eds-message-opted-in', this.inboxCtaActionMessages.YouHaveOptedIn);
            } else {
                this.tracking.trackCtaPromoSuccess(this.inboxMessage);
                this.renderer.setProperty(ctaElement, 'innerText', this.inboxCtaActionMessages.YouHaveOptedIn);
            }

            if (!this.inboxMessage.isNoDepositBonus && this.inboxMessage.messageType === MessageType.BONUS_OFFER) {
                const unbind: () => void = this.renderer.listen(ctaElement, 'click', (event: Event) => {
                    event.stopPropagation();
                    unbind();
                    this.goToOrReturnCashierUrlStrategy(this.inboxMessage.bonusCode);
                });
                this.linksClickListeners.push(unbind);
                this.renderer.setProperty(ctaElement, 'innerText', this.inboxCtaActionMessages.DepositNow);
            } else {
                this.setElementIsDisable(ctaElement, true);
                // Add possible display gamelist logic here
            }
        }
    }

    private launchGame() {
        //Redirect or Launch Game or stay on the page
        if (!this.inboxMessage.isNoDepositBonus && this.inboxMessage.messageType === MessageType.BONUS_OFFER) {
            // DepositBonus
            this.goToOrReturnCashierUrlStrategy(this.inboxMessage.bonusCode);
        } else if (this.inboxMessage.isNoDepositBonus && this.inboxMessage.mobileGames && this.inboxMessage.mobileGames.length === 1) {
            // Launch single game
            const mobileGameInfo = this.inboxMessage.mobileGames[0];
            if (this.nativeApplication.isNativeApp) {
                this.#window.location.href = mobileGameInfo.launchUrl; //event to native
            } else {
                this.navigation.goTo(mobileGameInfo.launchUrl, { forceReload: true });
            }
        }
    }

    private handleBonusMessage(ctaElement: HTMLAnchorElement) {
        let unbind: (() => void) | undefined;

        switch (this.inboxMessage.sourceStatus) {
            case OfferStatus.OFFER_NEW:
                unbind = this.renderer.listen(ctaElement, 'click', (event: Event) => {
                    event.stopPropagation();

                    if (unbind) {
                        unbind();
                    }

                    this.tracking.trackCtaBonusClicked(this.inboxMessage);
                    this.claimCta(ctaElement, OfferType.BONUSES);
                });
                break;
            case OfferStatus.OFFER_TNC_ACCEPTED:
                // DepositBonus
                unbind = this.renderer.listen(ctaElement, 'click', (event: Event) => {
                    event.stopPropagation();

                    if (unbind) {
                        unbind();
                    }

                    this.goToOrReturnCashierUrlStrategy(this.inboxMessage.bonusCode);
                });
                this.renderer.setProperty(ctaElement, 'innerText', this.inboxCtaActionMessages.DepositNow);
                break;
            case OfferStatus.OFFER_CLAIMED:
                this.setElementIsDisable(ctaElement, true);
                this.renderer.setProperty(ctaElement, 'innerText', this.inboxCtaActionMessages.Claimed);
                break;
            case OfferStatus.OFFER_DROPPED:
            case OfferStatus.OFFER_EXPIRED:
                this.setElementIsDisable(ctaElement, true);
                this.renderer.setProperty(ctaElement, 'innerHTML', this.inboxCtaActionMessages.Expired);
                break;
            case OfferStatus.NO_OFFER:
                this.setElementIsHidden(ctaElement, true);
                break;
        }

        if (unbind) {
            this.linksClickListeners.push(unbind);
        }

        this.setOfferMessageContainer(ctaElement, true);
    }

    private handleMessage(ctaElement: HTMLAnchorElement, offerType: OfferType) {
        this.setElementIsHidden(ctaElement, false);
        this.setElementIsDisable(ctaElement, false);

        (ctaElement as any).unlistenClaimCta = this.renderer.listen(ctaElement, 'click', (event: any) => {
            event.stopPropagation();
            this.claimCta(ctaElement, offerType);
        });

        //TODO: refactor all component, this is a patch fix for memory leak
        this.linksClickListeners.push((ctaElement as any).unlistenClaimCta);
    }

    private goToOrReturnCashierUrlStrategy(bonusCode: string) {
        this.cashierService.goToCashierDeposit({ queryParameters: { ['bonusCodeForPrefill']: bonusCode } });
    }

    private setElementIsDisable(element: HTMLAnchorElement, isDisabled: boolean) {
        isDisabled ? this.renderer.setAttribute(element, 'disabled', 'disabled') : this.renderer.removeAttribute(element, 'disabled');
    }

    private setOfferMessageContainer(ctaElement: HTMLAnchorElement, checkOfferStatus: boolean, sourceStatus?: OfferStatus) {
        if (this.inboxConfig.showOfferMessage) {
            if (checkOfferStatus) {
                this.offersResourceService
                    .getStatus(OfferType.BONUSES, this.inboxMessage.offerId)
                    .pipe(first())
                    .subscribe({
                        next: (response: OfferResponse) => {
                            if (response.status) {
                                this.setMessage(ctaElement, response.status);
                            }
                        },
                        error: () => {},
                    });
            } else {
                this.setMessage(ctaElement, sourceStatus);
            }
        }
    }

    private setMessage(ctaElement: HTMLAnchorElement, sourceStatus?: OfferStatus) {
        const message = this.inboxCtaActionMessages[`${sourceStatus}_MESSAGE`];
        if (message) {
            let container = ctaElement.previousElementSibling;
            /* check if container already exist */
            if (container && container.classList.contains(OFFER_MESSAGE_CLASS)) {
                container.innerHTML = message;
            } else {
                container = this.createMessageContainer(message, ctaElement.getAttribute('data-eds-message-class'));
                ctaElement.parentNode?.insertBefore(container, ctaElement);
            }
        }
    }

    private createMessageContainer(text: string, cssClass: string | null): HTMLDivElement {
        const div = this.document.createElement('div');
        div.innerHTML = text;
        div.classList.add(OFFER_MESSAGE_CLASS);
        div.classList.add('badge-date');

        if (cssClass) {
            div.classList.add(cssClass);
        }

        return div;
    }
}
