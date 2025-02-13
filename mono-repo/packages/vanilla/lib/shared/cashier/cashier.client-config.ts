import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnCashier', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: cashierConfigFactory,
})
export class CashierConfig extends LazyClientConfigBase {
    depositUrlTemplate: string;
    withdrawUrlTemplate: string;
    transactionHistoryUrlTemplate: string;
    urlTemplate: string;
    manageMyCardsUrlTemplate: string;
    paymentPreferencesUrlTemplate: string;
    host: string;
    singleSignOnIntegrationType: string = 'query' || 'cookie';
    trackerIds: { [origin: string]: string };
    quickDepositAllowedOrigins: { [origin: string]: boolean };
    quickDepositUrlTemplate: string;
    isQuickDepositEnabled: boolean;
}

export function cashierConfigFactory(service: LazyClientConfigService) {
    return service.get(CashierConfig);
}
