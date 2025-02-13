import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, inject } from '@angular/core';

import {
    AnchorTrackingHelperService,
    CustomElement,
    MenuActionOrigin,
    MenuActionsService,
    NavigationService,
    TrackingService,
    UrlService,
    UserService,
} from '@frontend/vanilla/core';
import { EdsGroupService } from '@frontend/vanilla/shared/eds-group';
import { OfferResponse, OfferType, OffersResourceService } from '@frontend/vanilla/shared/offers';
import { kebabCase } from 'lodash-es';
import { Subject, firstValueFrom } from 'rxjs';
import { catchError, filter, map, takeUntil } from 'rxjs/operators';

import { OfferButtonConfig } from './offer-button.client-config';
import { OfferStatus, QueryParam } from './offer-button.models';

/**
 * @stable
 */
@Directive()
export class OfferButtonComponentBase implements OnInit, OnDestroy, AfterViewInit {
    @HostBinding('class.offer-button-loading') loading: boolean;
    @HostBinding() innerText: string = '';
    @HostBinding('attr.data-offer-status') offerStatus: string;

    private offerId: string;
    private offerType: string;
    private edsGroupId: string | null;
    private unsubscribe = new Subject<void>();
    private originalClass: string;
    private nativeElement: CustomElement;
    public document: Document;

    protected elementRef = inject(ElementRef<HTMLElement>);
    protected user = inject(UserService);
    protected menuActionsService = inject(MenuActionsService);
    protected navigationService = inject(NavigationService);
    protected urlService = inject(UrlService);
    protected offersResourceService = inject(OffersResourceService);
    protected offerConfig = inject(OfferButtonConfig);
    protected edsGroupService = inject(EdsGroupService);
    protected anchorTrackingHelperService = inject(AnchorTrackingHelperService);
    protected trackingService = inject(TrackingService);
    private trackingEventName: string | null;
    private trackingData: { [key: string]: string };
    get isEdsGroupType(): boolean {
        return this.offerType?.toLowerCase() === OfferType.EDS_GROUP;
    }

    @HostListener('click', ['$event'])
    async onClick(event: Event) {
        event.preventDefault();

        if (!this.loading && this.offerStatus === OfferStatus.Offered) {
            const el = event.target as HTMLAnchorElement;
            this.trackingEventName = this.anchorTrackingHelperService.getTrackingEventName(el);
            this.trackingData = this.anchorTrackingHelperService.createTrackingData(el);
            this.triggerEvent({ 'component.ActionEvent': 'click' });

            if (!this.user.isAuthenticated) {
                this.gotoLogin(true);
            } else {
                this.updateButton(await this.makeRequest('POST', true));
            }
        }
    }

    ngOnInit() {
        this.nativeElement = this.elementRef.nativeElement as CustomElement;
        this.offerConfig.whenReady.subscribe(async () => {
            this.offerId = this.getAttributeValue('data-offer-id') || this.getAttributeValue('data-campaign-id');
            this.offerType = this.elementRef.nativeElement.getAttribute('data-offer-type')!;
            this.edsGroupId = this.elementRef.nativeElement.getAttribute('data-eds-group-id');
            this.originalClass = this.elementRef.nativeElement.getAttribute('class') || '';
            this.elementRef.nativeElement.classList.add('offer-button-md');

            if (this.nativeElement.originalHtmlString) {
                this.elementRef.nativeElement.innerHTML = this.nativeElement.originalHtmlString;
            }

            this.navigationService.locationChange.pipe(takeUntil(this.unsubscribe)).subscribe(async () => {
                await this.loadButton(true);
            });
            await this.loadButton();

            if (this.isEdsGroupType) {
                this.edsGroupService.freshCampaignDetails
                    .pipe(
                        filter((edsGroupId: string) => edsGroupId === this.edsGroupId),
                        takeUntil(this.unsubscribe),
                    )
                    .subscribe(() => {
                        const status = this.edsGroupService.getCampaignStatus(this.offerId);
                        this.updateButton(status);
                    });
            }
        });
    }
    ngAfterViewInit() {
        if (this.elementRef.nativeElement.hasAttribute('ds-button')) {
            this.originalClass = this.elementRef.nativeElement.getAttribute('class') || '';
            this.elementRef.nativeElement.setAttribute('class', '');
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private async makeRequest(method: string, shouldTrack: boolean = false): Promise<string> {
        this.loading = true;

        if (this.isEdsGroupType) {
            if (method === 'GET') {
                this.edsGroupService.refreshEdsGroupStatus.next(this.edsGroupId!);
                await firstValueFrom(this.edsGroupService.freshCampaignDetails.pipe(filter((groupId) => groupId === this.edsGroupId)));
            }
            return new Promise<string>((resolve) => {
                if (method === 'GET') {
                    resolve(this.edsGroupService.getCampaignStatus(this.offerId));
                } else {
                    this.edsGroupService.updateCampaignStatus(this.edsGroupId!, this.offerId);
                }
            });
        }

        const offerStatus = await firstValueFrom(
            method === 'GET'
                ? this.offersResourceService.getStatus(this.offerType, this.offerId).pipe(
                      map((response: OfferResponse) => response.status),
                      catchError(() => Promise.resolve('error')),
                  )
                : this.offersResourceService.updateStatus(this.offerType, this.offerId).pipe(
                      map((response: OfferResponse) => response.status),
                      catchError(() => Promise.resolve('error')),
                  ),
        );

        if (method === 'POST' && shouldTrack) {
            this.triggerEvent({ 'component.ActionEvent': 'success opt-in', 'component.EventDetails': 'you have opted in' });
        }

        return offerStatus;
    }

    private updateButton(offerStatus: string, text?: string | null) {
        const status = kebabCase(offerStatus);
        const content = this.offerConfig.content?.messages;
        const configMessage = content && (content[status] || content[OfferStatus.Unknown]);

        const innerText = text || this.getMessage(status) || configMessage || '';
        const buttonClass = this.offerConfig.buttonClass?.messages;
        const klass = (buttonClass && buttonClass[status]) || this.originalClass;

        const hasDsButton = this.elementRef.nativeElement.hasAttribute('ds-button');
        if (hasDsButton === true) {
            const optinClass = status !== OfferStatus.Offered ? klass : this.originalClass;
            this.elementRef.nativeElement.setAttribute('class', optinClass);
        } else {
            this.elementRef.nativeElement.setAttribute('class', klass);
        }
        if (this.offerConfig.v2) {
            // remove previously added children to reset to an empty state.
            while (this.nativeElement.firstChild) {
                this.nativeElement.removeChild(this.nativeElement.firstChild);
            }
            const textSpanElement = this.document.createElement('span');

            const iconClass = this.offerConfig.iconClass?.messages?.[status] ?? '';
            if (iconClass) {
                const iconSpanElement = this.document.createElement('span');
                iconSpanElement.setAttribute('class', iconClass);
                this.nativeElement.appendChild(iconSpanElement);
            }

            textSpanElement.innerText = innerText;
            this.nativeElement.appendChild(textSpanElement);
        } else {
            this.innerText = innerText;
        }

        this.elementRef.nativeElement.classList.add('offer-button-md');
        this.offerStatus = status;
        this.loading = false;
    }

    private getMessage(status: string): string | null {
        return this.elementRef.nativeElement.getAttribute(`data-offer-message-${status}`);
    }

    private async loadButton(shouldTrack: boolean = false) {
        const searchParam = this.navigationService.location.search;
        const offerIdQueryParam = searchParam.get(QueryParam.OfferId);
        const offerTypeQueryParam = searchParam.get(QueryParam.OfferType);

        if (this.user.isAuthenticated) {
            const status = await this.makeRequest('GET');
            this.updateButton(status);

            if (kebabCase(status) === OfferStatus.Offered && this.isSameOffer(offerIdQueryParam, offerTypeQueryParam)) {
                this.updateButton(await this.makeRequest('POST', shouldTrack));
            }
        } else {
            if (this.isSameOffer(offerIdQueryParam, offerTypeQueryParam)) {
                this.gotoLogin(false);
            }

            await new Promise((resolve) => setTimeout(resolve, 50));
            this.updateButton(OfferStatus.Offered, this.getMessage(OfferStatus.Offered));
        }
    }

    private getAttributeValue(name: string): any {
        if (this.nativeElement.originalAttributes) {
            return this.nativeElement.originalAttributes.get(name);
        }

        return this.elementRef.nativeElement.getAttribute(name);
    }

    private gotoLogin(appendOfferDetails: boolean) {
        const returnUrl = this.urlService.current();
        if (appendOfferDetails) {
            returnUrl.search.set(QueryParam.OfferId, this.offerId);
            returnUrl.search.set(QueryParam.OfferType, this.offerType);
        } else {
            // append dummy querystring to force navigation after the login
            returnUrl.search.set('triggernav', '1');
        }

        this.menuActionsService.invoke('gotoLogin', MenuActionOrigin.OfferButton, [undefined, undefined, { returnUrl: returnUrl.absUrl() }]);
    }

    private isSameOffer(offerId: string | null, offerType: string | null): boolean {
        return offerId == this.offerId && offerType == this.offerType;
    }

    private triggerEvent(eventSpecificTrackData: { [key: string]: string }) {
        if (this.trackingEventName) {
            this.trackingService.triggerEvent(this.trackingEventName, { ...this.trackingData, ...eventSpecificTrackData });
        }
    }
}
