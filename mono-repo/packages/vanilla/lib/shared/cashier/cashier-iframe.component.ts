import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    OnChanges,
    OnInit,
    Output,
    ViewChild,
    inject,
    input,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    CashierService,
    DeviceService,
    ElementRepositoryService,
    EventsService,
    MediaQueryService,
    NativeAppService,
    NativeEventType,
    NavigationService,
    VanillaElements,
    VanillaEventNames,
    WINDOW,
} from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { IFrameComponent } from '@frontend/vanilla/shared/browser';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { CashierIframeAction, CashierIframeEvent } from './cashier-iframe.models';
import { CashierConfig } from './cashier.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, IFrameComponent],
    selector: 'vn-cashier-iframe',
    templateUrl: 'cashier-iframe.html',
})
export class CashierIframeComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild(IFrameComponent) iframe: IFrameComponent;
    @ViewChild('wrapper') wrapper: ElementRef<HTMLElement>;

    url = input<string>('');
    /** Indicates cashier page. Possible values: deposit */
    readonly page = input<string>('');
    readonly iframeClass = input<string>('');
    readonly cssClass = input<string>('');

    @Output() onLoaded = new EventEmitter<void>();
    @Output() onClosed = new EventEmitter<any>();
    @Output() onResized = new EventEmitter<any>();

    readonly host = signal<string>('');
    readonly #window = inject(WINDOW);

    constructor(
        public deviceService: DeviceService,
        private config: CashierConfig,
        private navigation: NavigationService,
        private balancePropertiesService: BalancePropertiesService,
        private cashierService: CashierService,
        private mediaQueryService: MediaQueryService,
        private navigationService: NavigationService,
        private eventsService: EventsService,
        private nativeAppService: NativeAppService,
        private elementRepositoryService: ElementRepositoryService,
        private changeDetectorRef: ChangeDetectorRef,
        private destroyRef: DestroyRef,
    ) {}

    // Note: ngOnChanges runs before ngOnInit
    ngOnChanges() {
        if (!this.url() && this.host()) {
            this.setUrl();
        }
    }

    async ngOnInit() {
        await Promise.all([firstValueFrom(this.config.whenReady), firstValueFrom(this.cashierService.whenReady)]);
        this.host.set(this.config.host);
        this.changeDetectorRef.detectChanges();

        if (!this.url()) {
            this.setUrl();
        }
    }

    ngAfterViewInit() {
        this.iframe.events
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                map((uri: any) => decodeURIComponent(uri)),
            )
            .subscribe((data: string) => {
                const message: CashierIframeEvent = data.split('&').reduce((seed: Record<string, string>, cur: string) => {
                    const param = cur.trim().split('=');

                    if (param[0] && param[1]) {
                        seed[param[0]] = param[1];
                    }

                    return seed;
                }, {});

                switch (message.action?.toUpperCase()) {
                    case CashierIframeAction.Close:
                        if (this.onClosed.observers.length) {
                            this.onClosed.next(message);
                            break;
                        }
                        // for now, until known where to redirect
                        this.navigation.goToLastKnownProduct();
                        break;
                    case CashierIframeAction.Open:
                        this.onLoaded.next();
                        if (this.onResized.observers.length) {
                            this.onResized.next(message);
                        } else {
                            this.resize(message);
                            this.#window.scrollTo(0, 0);
                        }
                        break;
                    case CashierIframeAction.Resize:
                        if (this.onResized.observers.length) {
                            this.onResized.next(message);
                        } else {
                            this.resize(message);
                            this.#window.scrollTo(0, 0);
                        }
                        break;
                    case CashierIframeAction.UpdateBalance:
                        this.balancePropertiesService.refresh();
                        break;
                    case CashierIframeAction.Chat:
                        this.onClosed.next(message);
                        const url = this.navigationService.location.clone();
                        url.search.set('cashierId', message['Web_site_URL']);
                        url.search.set('chat', 'open');
                        this.navigationService.goTo(url);
                        break;
                    case CashierIframeAction.DepositSuccess:
                        this.eventsService.raise({
                            eventName: VanillaEventNames.DepositSuccessQD,
                            data: { currency: message['currency'], value: message['amount'] },
                        });
                        this.onClosed.next(message);
                        break;
                    case CashierIframeAction.FetchLocation:
                        this.nativeAppService.sendToNative({
                            eventName: NativeEventType.TRIGGER_GEO_LOCATION,
                            parameters: message,
                        });
                        break;
                }
            });
    }

    private setUrl() {
        const pathTemplate = (this.config as any)[`${this.page()}UrlTemplate`];
        this.url = this.cashierService.generateCashierUrl({ pathTemplate });
    }

    private resize(message: CashierIframeEvent) {
        // Resize targeted by URL iframe
        const isValidTarget = this.wrapper.nativeElement.dataset['url']?.toLowerCase().indexOf(message.target?.toLowerCase() || '') !== -1;

        if (!isValidTarget) {
            return;
        }

        const isNotMobile = this.mediaQueryService.isActive('gt-xs');
        const parsedWidth = isNotMobile && message['width'].length ? `${parseInt(message['width'], 10)}px` : null;
        const parsedHeight = message['height'].length ? `${parseInt(message['height'], 10)}px` : null;

        if (parsedWidth != null) {
            this.wrapper.nativeElement.style.width = parsedWidth;
        }

        if (parsedHeight != null) {
            this.wrapper.nativeElement.style.height = parsedHeight;
        }

        const mainSlot = this.elementRepositoryService.get(VanillaElements.MAIN_SLOT);

        if (mainSlot) {
            this.wrapper.nativeElement.getBoundingClientRect().height > mainSlot.getBoundingClientRect().height
                ? mainSlot.classList.add('overflow-visible')
                : mainSlot.classList.remove('overflow-visible');
        }
    }
}
