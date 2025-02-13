import { Injectable, inject } from '@angular/core';

import {
    AppInfoConfig,
    CashierNewOptions,
    ClaimType,
    FrontendHelperService,
    NativeAppConfig,
    NativeAppService,
    NavigationService,
    Page,
    ProductHomepagesConfig,
    TrackingService,
    UserService,
    WINDOW,
    replacePlaceholders,
} from '@frontend/vanilla/core';
import { CashierConfig } from '@frontend/vanilla/shared/cashier';
import { mapValues } from 'lodash-es';

import { DepositType } from './cashier.models';
import { QuickDepositService } from './quick-deposit/quick-deposit.service';

/**
 * @whatItDoes Provides cashier navigation methods.
 *
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class CashierService {
    readonly #window = inject(WINDOW);

    constructor(
        private user: UserService,
        private cashierConfig: CashierConfig,
        private nativeApp: NativeAppService,
        private nativeAppSettings: NativeAppConfig,
        private page: Page,
        private quickDepositService: QuickDepositService,
        private appInfoConfig: AppInfoConfig,
        private productHomepagesConfig: ProductHomepagesConfig,
        private navigation: NavigationService,
        private frontendHelperService: FrontendHelperService,
        private trackingService: TrackingService,
    ) {}

    /** Navigates to cashier entry page. */
    goToCashier(options: CashierNewOptions) {
        this.goToCashierInternal(options);
    }

    goToCashierDeposit(options: CashierNewOptions) {
        options = options || {};
        options.pathTemplate = this.cashierConfig.depositUrlTemplate;

        if (options.skipQuickDeposit) {
            /** Navigates to cashier standalone deposit page. If user is allowed to quick deposit opens quick deposit overlay. */
            this.goToCashierInternal(options);
        } else {
            this.quickDepositService.isEnabled().subscribe((enabled: boolean) => {
                if (enabled) {
                    this.track(DepositType.Quick, options);
                    this.quickDepositService.open({
                        showKYCVerifiedMessage: options.queryParameters ? options.queryParameters['showKYCVerifiedMessage'] === 'true' : false,
                    });
                } else {
                    this.goToCashierInternal(options);
                }
            });
        }
    }

    /** Navigates to cashier withdrawal page. */
    goToCashierWithdrawal(options: CashierNewOptions) {
        options.pathTemplate = this.cashierConfig.withdrawUrlTemplate;
        this.goToCashierInternal(options);
    }

    /** Navigates to cashier manage my cards page. */
    goToManageMyCards(options: CashierNewOptions) {
        options.pathTemplate = this.cashierConfig.manageMyCardsUrlTemplate;
        this.goToCashierInternal(options);
    }

    /** Navigates to cashier payment history page. */
    goToTransactionHistory(options: CashierNewOptions) {
        this.goToCashierInternal(
            Object.assign(
                <CashierNewOptions>{},
                <CashierNewOptions>{ pathTemplate: this.cashierConfig.transactionHistoryUrlTemplate, skipTracking: true },
                options,
            ),
        );
    }

    /** Navigates to payment preferences page. */
    goToPaymentPreferences(options: CashierNewOptions) {
        options = options || {};
        options.pathTemplate = this.cashierConfig.paymentPreferencesUrlTemplate;
        this.goToCashierInternal(options);
    }

    /** Generates cashier url */
    generateCashierUrl(options: CashierNewOptions): string {
        const defaultOptions = <CashierNewOptions>{
            trackerId: '',
            replaceInHistory: false,
            pathTemplate: this.cashierConfig.urlTemplate,
        };
        options = Object.assign(<CashierNewOptions>{}, defaultOptions, options || <CashierNewOptions>{});

        if (!options.returnUrl) {
            options.returnUrl = this.#window.location.href;
        }

        if (!options.skipTracking) {
            this.trackingService.triggerEvent('pageView', {
                'page.name': 'CashierCTA',
            });

            if (this.nativeAppSettings.enableAppsFlyer) {
                if (options.appendReturnUrl) {
                    options.returnUrl += `${options.returnUrl.indexOf('?') < 0 ? '?' : '&'}backToAppPath=nativeapp/backToAppEx`;
                } else
                    options.returnUrl =
                        this.#window.location.protocol.replace(':', '') +
                        '://' +
                        this.#window.location.host +
                        '/' +
                        this.page.lang +
                        '?backToAppPath=nativeapp/backToAppEx';
            }
        }

        let url = (this.cashierConfig.host ?? '') + options.pathTemplate;

        if (this.cashierConfig.singleSignOnIntegrationType === 'cookie') {
            url = url.replace('sessionKey={0}&', ''); // TODO: update dynacon entries and remove sessionKey={0} once singleSignOnIntegrationType is cookie everywhere. also remove this line after.
        }

        url = url.replace('{0}', this.user.ssoToken || ''); // TODO: remove this line once singleSignOnIntegrationType is cookie everywhere
        url = url.replace('{1}', this.page.lang);
        url = url.replace('{2}', encodeURIComponent(options.returnUrl));
        url = url.replace('{3}', options.trackerId || '');

        options.queryParameters = options.queryParameters ?? {};

        if (this.user.id) {
            options.queryParameters['userId'] = this.user.id;
        }

        options.queryParameters['channelId'] = this.appInfoConfig.channel;
        options.queryParameters['brandId'] = this.appInfoConfig.brand;
        options.queryParameters['productId'] = this.appInfoConfig.product;
        options.queryParameters['frontend'] = this.frontendHelperService.getFrontendDescription();

        if (this.nativeApp.isNativeApp) {
            options.queryParameters['clientAppPath'] = '1';
        } else if (this.nativeApp.isNativeWrapper) {
            options.queryParameters['clientAppPath'] = '2';
        }

        Object.keys(options.queryParameters).forEach((key) => {
            url += `&${key}=${encodeURIComponent(options.queryParameters![key]!)}`;
        });

        return url;
    }

    handlePartialRegistration(origin: string, returnUrl?: string, options?: CashierNewOptions) {
        if (this.user.claims.get(ClaimType.IsPartiallyRegistered) === 'True') {
            /** Navigates to partial registration if user claim matches. Otherwise, invokes cashier deposit. */
            const depositUrl = this.generateCashierUrl(
                Object.assign(<CashierNewOptions>{ pathTemplate: this.cashierConfig.depositUrlTemplate }, options),
            );
            this.navigation.goTo(`${this.productHomepagesConfig.portal}/mobileportal/partialregistration?rurl=${depositUrl}`);
        } else {
            const newOptions = Object.assign(this.getOptions(origin, returnUrl), options || {});
            this.goToCashierDeposit(newOptions);
        }
    }

    private getOptions(origin: string, returnUrl?: string): CashierNewOptions {
        const trackerId = this.cashierConfig.trackerIds[origin.toLowerCase()] || '';
        returnUrl = returnUrl || this.navigation.location.absUrl();

        return {
            trackerId,
            returnUrl,
        };
    }

    private goToCashierInternal(options: CashierNewOptions) {
        this.track(DepositType.Normal, options);

        const targetWindow = options.cashierTargetWindow ? this.#window[options.cashierTargetWindow] : this.#window;

        if (!targetWindow) {
            return;
        }

        const url = this.generateCashierUrl(options);
        //TODO remove as part of vanilla changes to support single domain for cashier
        if (!this.cashierConfig.host) {
            this.navigation.goTo(url);
            return;
        }
        if (options.replaceInHistory) {
            targetWindow.location.replace(url);
        } else {
            targetWindow.location.href = url;
        }
    }

    private track(type: DepositType, options: CashierNewOptions) {
        if (options.skipTracking || !options.customTracking) {
            return;
        }

        const placeholders = {
            type,
        };

        const event = replacePlaceholders(options.customTracking.eventName, placeholders)!;
        const data = mapValues(options.customTracking.data || {}, (value) => replacePlaceholders(value, placeholders));

        this.trackingService.triggerEvent(event, data);
    }
}
