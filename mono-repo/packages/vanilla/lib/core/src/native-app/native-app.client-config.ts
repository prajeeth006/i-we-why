import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnNativeApp', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: nativeAppConfigFactory,
})
export class NativeAppConfig {
    isNative: boolean;
    isNativeApp: boolean;
    isNativeWrapper: boolean;
    isDownloadClient: boolean;
    isDownloadClientApp: boolean;
    isDownloadClientWrapper: boolean;
    isTerminal: boolean;
    product: string;
    applicationName: string;
    nativeMode: string;
    enableAppsFlyer: boolean;
    enableWrapperEmulator: boolean;
    appSettingsTimeout: number;
    partnerSessionIdSupported: boolean;
    sendOpenLoginDialogEvent: boolean;
    enableCCBDebug: boolean;
    disabledEvents: string[];
    enableCCBTracing: boolean;
    tracingBlacklistPattern: string;
    sendPostLoginOnGoToNative: boolean;
    htcmdSchemeEnabled: boolean | undefined;
}

export function nativeAppConfigFactory(service: ClientConfigService) {
    return service.get(NativeAppConfig);
}
