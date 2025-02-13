import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';

import {
    AppInfoConfig,
    CashierService,
    CommonMessages,
    DeviceService,
    ElementKeyDirective,
    ElementRepositoryService,
    Logger,
    MenuItemsService,
    MenuSection,
    Page,
    UserService,
    UtilsService,
    VanillaElements,
    WINDOW,
} from '@frontend/vanilla/core';
import { CashierConfig, CashierIframeComponent, CashierIframeEvent, CashierIframeType } from '@frontend/vanilla/shared/cashier';

import { QuickDepositOptions } from './quick-deposit.models';
import { QUICK_DEPOSIT_OPTIONS } from './quick-deposit.service';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayModule, CommonModule, ElementKeyDirective, CashierIframeComponent],
    selector: 'lh-quick-deposit-responsive',
    templateUrl: 'quick-deposit-responsive.component.html',
    styleUrl: '../../../../../../themepark/themes/whitelabel/components/quick-deposit/styles.scss',
    encapsulation: ViewEncapsulation.None,
})
export class QuickDepositResponsiveComponent implements OnInit {
    readonly url = signal<string>('');
    readonly VanillaElements = VanillaElements;
    readonly #window = inject(WINDOW);

    constructor(
        public deviceService: DeviceService,
        public commonMessages: CommonMessages,
        private cashierService: CashierService,
        private elementRepositoryService: ElementRepositoryService,
        private cashierConfig: CashierConfig,
        private user: UserService,
        private page: Page,
        private appInfoConfig: AppInfoConfig,
        private utils: UtilsService,
        private overlayRef: OverlayRef,
        private menuItemsService: MenuItemsService,
        private logger: Logger,
        @Inject(QUICK_DEPOSIT_OPTIONS) private options: QuickDepositOptions,
    ) {}

    ngOnInit() {
        let urlTemplate = this.cashierConfig.quickDepositUrlTemplate;

        if (this.cashierConfig.singleSignOnIntegrationType === 'cookie') {
            urlTemplate = urlTemplate.replace('&sessionKey={5}', ''); // TODO: update dynacon entries and remove sessionKey={5} from them once singleSignOnIntegrationType is cookie everywhere. also remove this line after.
        }

        this.url.set(
            this.utils.format(
                this.cashierConfig.host + urlTemplate,
                this.user.id,
                this.appInfoConfig.brand,
                this.appInfoConfig.product,
                this.appInfoConfig.channel,
                this.page.lang,
                this.user.ssoToken, // TODO: remove this line once singleSignOnIntegrationType is cookie everywhere
                encodeURIComponent(this.#window.location.href),
            ),
        );

        if (this.options.showKYCVerifiedMessage) {
            this.url.update((url: string) => url + '&showKYCVerifiedMessage=true');
        }
    }

    close(message: { action: string; [key: string]: any }) {
        if (message['showAllOptions'] === 'true') {
            this.cashierService.goToCashierDeposit({ skipQuickDeposit: true });
        } else {
            this.overlayRef.detach();
            this.menuItemsService.setActive(MenuSection.Menu, null);
        }
    }

    resize(message: CashierIframeEvent) {
        try {
            const element = this.elementRepositoryService
                .get(VanillaElements.QUICK_DEPOSIT_WRAPPER)
                ?.querySelector<HTMLElement>('.player-quickdeposit-iframe-wrapper');

            if (element?.style && (!message.target || message.target.toLowerCase() === CashierIframeType.QuickDeposit)) {
                const isNotMobile = !this.deviceService.isMobilePhone;
                const parsedWidth = isNotMobile && message['width'] && message['width'].length ? `${parseInt(message['width'], 10)}px` : null;
                const parsedHeight = message['height'] && message['height'].length ? `${parseInt(message['height'], 10)}px` : null;

                // mobile phone and v2: theme specify width 100%
                if (parsedWidth != null) {
                    element.style.width = parsedWidth;
                }

                if (parsedHeight != null) {
                    element.style.height = parsedHeight;
                }
            }
        } catch (err: any) {
            this.logger.warn(`Failed to resize.`, err);
        }
    }
}
