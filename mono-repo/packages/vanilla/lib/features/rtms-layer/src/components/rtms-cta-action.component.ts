import {
    AfterContentInit,
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
} from '@angular/core';

import { CashierService, NavigationService, RtmsType } from '@frontend/vanilla/core';
import { OfferResponse, OfferStatus, OfferType, OffersResourceService } from '@frontend/vanilla/shared/offers';
import { NotificationMessage, RtmsCtaAction, RtmsCtaActionTypes, RtmsMessageType } from '@frontend/vanilla/shared/rtms';
import { throwError as _throw } from 'rxjs';

@Component({
    standalone: true,
    selector: 'lh-rtms-cta-action',
    template: `
        <ng-content />
        <div class="rtms-cta-action-container" #contentItem></div>
    `,
})
export class RtmsCtaActionComponent implements AfterContentInit, OnChanges, OnDestroy {
    @Output() action: EventEmitter<RtmsCtaAction> = new EventEmitter();
    @Input() rtmsCtaAction: NotificationMessage;
    @Input() rtmsCtaActionMessages: { [key: string]: string };
    @Input() content: string;
    @Input() rtmsType: RtmsType;
    @Input() rtmsCtaContentType: 'CTA' | 'DESCRIPTION';
    @ViewChild('contentItem', { static: true }) contentItem: ElementRef;
    private currentOfferId: string;

    private unlistenClaimCtaKey: string = 'unlistenClaimCta';
    private ctaHrefIndicator: string = 'inbox://cta/';
    private ctaEdsHrefIndicator: string = '/INBOXEDS';
    private ctaPatHrefIndicator: string = '/INBOXPAT';
    private linksClickListeners: (() => void)[] = [];

    constructor(
        private cashierService: CashierService,
        private renderer: Renderer2,
        private navigationService: NavigationService,
        private offersResourceService: OffersResourceService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.rtmsCtaContentType === 'DESCRIPTION' && this.content && this.contentItem && !changes.content?.firstChange) {
            this.injectContent();
        }
    }

    ngAfterContentInit(): void {
        if (this.content && this.contentItem) {
            this.injectContent();
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

    private injectContent() {
        this.renderer.setProperty(this.contentItem.nativeElement, 'innerHTML', this.content);
        this.handleInjectedContent(this.contentItem);
    }

    private handleInjectedContent(parentElement: ElementRef) {
        if (!(Object.keys(this.rtmsCtaAction).length && this.rtmsCtaActionMessages)) {
            return;
        }

        this.styleButtons(parentElement);

        // CTA element logic
        for (const ctaElement of this.getCtaElements(parentElement)) {
            this.handleCtaElement(ctaElement);
        }

        let closeBtn: HTMLElement;
        if (this.rtmsCtaContentType === 'CTA' && (closeBtn = parentElement.nativeElement.querySelector('a.OverlayCloseButton'))) {
            this.handleCloseElement(closeBtn);
        }

        let declineBtn: HTMLAnchorElement;
        if (this.rtmsCtaContentType === 'CTA' && (declineBtn = parentElement.nativeElement.querySelector('a.DeclineOfferButton'))) {
            this.handleDeclineCtaElement(declineBtn);
        }

        this.bindCashierLinks(parentElement);
    }

    private styleButtons(parentElement: ElementRef) {
        if (this.rtmsCtaContentType === 'CTA') {
            parentElement.nativeElement.querySelectorAll('a').forEach((el: HTMLElement) => {
                if (this.rtmsType === 'TOASTER') {
                    return;
                }

                if (el.classList.contains('OverlayCloseButton') || el.classList.contains('DeclineOfferButton')) {
                    el.classList.add('btn', 'cancel', 'rtms-no-thanks-btn', 'btn-light');
                } else {
                    el.classList.add('btn', 'rtms-cta', 'btn-primary');
                }
            });
        }
    }

    private getCtaElements(parentElement: ElementRef): HTMLAnchorElement[] {
        return [
            ...Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll(`a[href^="${this.ctaHrefIndicator}"]`)),
            ...Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll(`a[href^="${this.ctaEdsHrefIndicator}"]`)),
            ...Array.from<HTMLAnchorElement>(parentElement.nativeElement.querySelectorAll(`a[href^="${this.ctaPatHrefIndicator}"]`)),
        ];
    }

    private handleCloseElement(closeElement: HTMLElement) {
        this.renderer.listen(closeElement, 'click', (event: any) => {
            event.stopPropagation();
            event.preventDefault();
            this.action.next(new RtmsCtaAction(RtmsCtaActionTypes.hideRtms));
        });
    }

    private handleDeclineCtaElement(ctaElement: HTMLAnchorElement) {
        const msg: NotificationMessage = this.rtmsCtaAction;

        if (!msg.offerId && (!ctaElement.getAttribute('data-eds-event-id') || ctaElement.getAttribute('data-eds-event-id') === '[empty]')) {
            this.setElementIsHidden(ctaElement, true);
        } else {
            //TBD: handle for PAT and EDS offers
            if (msg.messageType === RtmsMessageType.BONUS_OFFER) {
                ctaElement.href = 'javascript:void(0)';
                this.declineBonusOffer(ctaElement);
            }
        }
    }

    private declineBonusOffer(ctaElement: HTMLAnchorElement): void {
        let unbind: () => void | undefined;

        unbind = this.renderer.listen(ctaElement, 'click', (event: Event) => {
            event.stopPropagation();
            unbind();

            this.offersResourceService.updateStatus(OfferType.BONUSES, this.rtmsCtaAction.offerId, false).subscribe({
                next: (response: OfferResponse) => {
                    // probably should remove this condition, it seems it is always true (this.rtmsCtaActionMessages.cta undefined)
                    if (OfferType.BONUSES !== this.rtmsCtaActionMessages['cta'])
                        if (response.status) {
                            // TBD: this is scoped to close overlay for now, in future it should be a text change
                            // this.renderer.setAttribute(ctaElement, 'disabled', null);
                            // this.renderer.setProperty(ctaElement, 'innerText', this.rtmsCtaActionMessages['DeclineOffer']);
                            // let claimCta=this.contentItem.nativeElement.querySelectorAll('a.rtms-cta.ctabutton')[0];
                            // claimCta!==undefined?claimCta.setAttribute('disabled', 'disabled'):true;
                            this.action.next(new RtmsCtaAction(RtmsCtaActionTypes.hideRtms));
                        }
                },
                error: (error: any) => {
                    return _throw(error);
                },
            });
        });
    }

    private handleCtaElement(ctaElement: HTMLAnchorElement) {
        const msg: NotificationMessage = this.rtmsCtaAction;
        this.renderer.setAttribute(ctaElement, 'sitecoreid', msg.sitecoreId);
        const isCta: boolean = !!ctaElement.href.match(new RegExp(this.ctaHrefIndicator, 'igm')); //msg.messageType === RtmsMessageType.BONUS_OFFER;
        const isInboxEds: boolean = !!ctaElement.href.match(new RegExp(this.ctaEdsHrefIndicator, 'igm')); // && msg.messageType === MessageType.EDS_OFFER;
        const isInboxPat: boolean = !!ctaElement.href.match(new RegExp(this.ctaPatHrefIndicator, 'igm')); // && msg.messageType === MessageType.PROMO_TARGET;

        if (!msg.offerId && (!ctaElement.getAttribute('data-eds-event-id') || ctaElement.getAttribute('data-eds-event-id') === '[empty]')) {
            this.setElementIsHidden(ctaElement, true);
        } else {
            if (isCta) {
                ctaElement.href = 'javascript:void(0)';
                ctaElement.classList.add('btn', 'send', 'ctabutton');
                this.renderer.setAttribute(ctaElement, 'sitecoreid', msg.sitecoreId);
                this.handleBonusCtaMessage(ctaElement);
            } else if (isInboxEds || isInboxPat) {
                this.currentOfferId = ctaElement.getAttribute('data-eds-event-id') || msg.offerId;

                //get current message status
                this.setElementIsDisable(ctaElement, true);
                const offerType = isInboxPat ? OfferType.PROMOS : OfferType.EDS;

                this.offersResourceService.getStatus(offerType, this.currentOfferId).subscribe({
                    next: (response: OfferResponse) => {
                        response.status ? this.handleEdsMessage(ctaElement, response.status, offerType) : this.handleMessage(ctaElement, offerType);
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

    private handleMessage(ctaElement: HTMLAnchorElement, offerType: OfferType) {
        this.setElementIsHidden(ctaElement, false);
        this.setElementIsDisable(ctaElement, false);

        (ctaElement as any)[this.unlistenClaimCtaKey] = this.renderer.listen(ctaElement, 'click', (event: any) => {
            event.stopPropagation();
            this.claimCta(ctaElement, offerType);
        });

        //TODO: refactor all component, this is a patch fix for memory leak
        this.linksClickListeners.push((ctaElement as any)[this.unlistenClaimCtaKey]);
    }

    private handleEdsMessage(ctaElement: HTMLAnchorElement, sourceStatus: OfferStatus, offerType: OfferType) {
        this.setElementIsHidden(ctaElement, false);
        this.setElementIsDisable(ctaElement, false);

        switch (sourceStatus) {
            case OfferStatus.OFFERED:
                this.handleMessage(ctaElement, offerType);
                break;
            case OfferStatus.NOTOFFERED:
            case OfferStatus.NOT_OFFERED:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-not-offered', this.rtmsCtaActionMessages['NotEligible']!);
                break;
            case OfferStatus.EXPIRED:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-expired', this.rtmsCtaActionMessages['Expired']!);
                break;
            case OfferStatus.OPTEDIN:
            case OfferStatus.OPTED_IN:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-opted-in', this.rtmsCtaActionMessages['YouHaveOptedIn']!);
                break;
            case OfferStatus.OPTEDOUT:
            case OfferStatus.OPTED_OUT:
                this.setElementIsDisable(ctaElement, true);
                this.setTextFormAttr(ctaElement, 'data-eds-message-opted-out', this.rtmsCtaActionMessages['YouHaveOptedOut']!);
                break;
            case OfferStatus.INVALID:
                this.setElementIsDisable(ctaElement, true);
                break;
            case OfferStatus.NO_OFFER:
                this.setElementIsHidden(ctaElement, true);
                break;
            default:
                this.setElementIsDisable(ctaElement, true);
        }
    }

    private setTextFormAttr(ctaElement: HTMLElement, textProperty: string, backupText: string) {
        if (ctaElement.getAttribute(textProperty) && ctaElement.getAttribute(textProperty) !== '[empty]') {
            this.renderer.setProperty(ctaElement, 'innerText', ctaElement.getAttribute(textProperty));
        } else {
            this.renderer.setProperty(ctaElement, 'innerText', backupText);
        }
    }

    private handleBonusCtaMessage(ctaElement: HTMLAnchorElement) {
        let unbind: () => void | undefined;

        switch (this.rtmsCtaAction.bonusSourceStatus) {
            case OfferStatus.OFFER_NEW:
                unbind = this.renderer.listen(ctaElement, 'click', (event: Event) => {
                    event.stopPropagation();
                    unbind();
                    this.claimBonusOffer(ctaElement);
                });
                break;
            case OfferStatus.OFFER_TNC_ACCEPTED:
                // DepositBonus
                unbind = this.renderer.listen(ctaElement, 'click', (event: Event) => {
                    event.stopPropagation();
                    unbind();
                    this.goToOrReturnCashierUrlStrategy(this.rtmsCtaAction.bonusCode);
                });
                this.renderer.setProperty(ctaElement, 'innerText', this.rtmsCtaActionMessages['DepositNow']);
                break;
            case OfferStatus.OFFER_CLAIMED:
                this.setElementIsDisable(ctaElement, true);
                this.renderer.setProperty(ctaElement, 'innerText', this.rtmsCtaActionMessages['Claimed']);
                break;
            case OfferStatus.OFFER_DROPPED:
            case OfferStatus.OFFER_EXPIRED:
                this.setElementIsDisable(ctaElement, true);
                this.renderer.setProperty(ctaElement, 'innerHTML', this.rtmsCtaActionMessages['Expired']);
                break;
            case OfferStatus.NO_OFFER:
                this.setElementIsHidden(ctaElement, true);
                break;
        }
    }

    private claimCta(ctaElement: HTMLAnchorElement, offerType: string) {
        this.setElementIsDisable(ctaElement, true);
        const offerId = ctaElement.getAttribute('data-eds-event-id') || this.rtmsCtaAction.offerId;

        this.offersResourceService.updateStatus(offerType, offerId).subscribe({
            next: (response: OfferResponse) => {
                // probably should remove first part of this condition, it seems it is always true (this.rtmsCtaActionMessages.cta undefined)
                if (offerType !== this.rtmsCtaActionMessages['cta'] && this.rtmsCtaAction.isNoDepositBonus) {
                    this.action.emit(new RtmsCtaAction(RtmsCtaActionTypes.claimOfferSuccess, response));
                }

                if (response.status === OfferStatus.OPTED_IN) {
                    // pass list and current CTA buttons for update
                    const ctaList = [ctaElement];
                    this.renderer.removeAttribute(ctaElement, 'disabled');
                    this.onClaimCtaSuccess(ctaList);
                }
            },
            error: (error: any) => {
                return _throw(error);
            },
        });
    }

    private claimBonusOffer(ctaElement: HTMLAnchorElement) {
        this.setElementIsDisable(ctaElement, true);
        const offerId = ctaElement.getAttribute('data-eds-event-id') || this.rtmsCtaAction.offerId;

        this.offersResourceService.updateStatus(OfferType.BONUSES, offerId).subscribe({
            next: (response: OfferResponse) => {
                // probably should remove first part of this condition, it seems it is always true (this.rtmsCtaActionMessages.cta undefined)
                if (
                    OfferType.BONUSES !== this.rtmsCtaActionMessages['cta'] &&
                    (this.rtmsCtaAction.isNoDepositBonus || (this.rtmsCtaAction.content && this.rtmsCtaAction.content.useRewardsOverlay))
                )
                    this.action.emit(new RtmsCtaAction(RtmsCtaActionTypes.claimOfferSuccess, response));
                if (response.status === OfferStatus.OFFER_CLAIMED) {
                    // pass list and current CTA buttons for update
                    const ctaList = [ctaElement];
                    this.renderer.removeAttribute(ctaElement, 'disabled');
                    const declineCta = this.contentItem.nativeElement.querySelectorAll('a.DeclineOfferButton')[0];
                    declineCta != undefined ? declineCta.setAttribute('disabled', 'disabled') : true;
                    this.onClaimCtaSuccess(ctaList);
                }
            },
            error: (error: any) => {
                return _throw(error);
            },
        });
    }

    private onClaimCtaSuccess(ctaElements: HTMLAnchorElement[]) {
        //Set Claim Button
        for (let i = 0; i < ctaElements.length; i++) {
            const ctaElement: HTMLAnchorElement = ctaElements[i]!;
            if (this.rtmsCtaAction.messageType === RtmsMessageType.BONUS_OFFER && this.rtmsCtaAction.isNoDepositBonus) {
                this.renderer.setProperty(ctaElement, 'innerText', this.rtmsCtaActionMessages['Claimed']!);
            } else if (!this.rtmsCtaAction.isNoDepositBonus && this.rtmsCtaAction.messageType === RtmsMessageType.BONUS_OFFER) {
                this.goToOrReturnCashierUrlStrategy(this.rtmsCtaAction.bonusCode);
                this.setElementIsDisable(ctaElement, false);
            } else if (this.rtmsCtaAction.messageType === RtmsMessageType.EDS_OFFER) {
                this.setTextFormAttr(ctaElement, 'data-eds-message-opted-in', this.rtmsCtaActionMessages['YouHaveOptedIn']!);
            } else {
                this.renderer.setProperty(ctaElement, 'innerText', this.rtmsCtaActionMessages['YouHaveOptedIn']);
            }
            this.renderer.setAttribute(ctaElement, 'disabled', 'disabled');
        }
    }

    private goToOrReturnCashierUrlStrategy(bonusCode: any) {
        this.cashierService.goToCashierDeposit({ queryParameters: { ['bonusCodeForPrefill']: bonusCode } });
    }

    private setElementIsDisable(element: HTMLElement, isDisabled: boolean) {
        isDisabled ? this.renderer.setAttribute(element, 'disabled', 'disabled') : this.renderer.removeAttribute(element, 'disabled');
    }

    private setElementIsHidden(element: any, isHidden: boolean) {
        this.renderer.setStyle(element, 'display', isHidden ? 'none' : '');
    }

    private bindCashierLinks(parentElement: ElementRef) {
        const allButtons = parentElement.nativeElement.querySelectorAll('a[class*="btn-cashier"]');

        allButtons.forEach((linkButton: HTMLAnchorElement) => {
            this.linksClickListeners.push(
                this.renderer.listen(linkButton, 'click', (event: Event) => {
                    event.stopPropagation();
                    event.preventDefault();

                    if (linkButton.href) {
                        this.action.next(new RtmsCtaAction(RtmsCtaActionTypes.hideRtms));
                        this.navigationService.goTo(linkButton.href);
                    }
                }),
            );
        });
    }
}
