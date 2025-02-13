import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnGeolocation', product: ClientConfigProductName.SF })
@Injectable()
export class GeolocationConfig extends LazyClientConfigBase {
    minimumUpdateIntervalMilliseconds: number;
    cookieExpirationMilliseconds: number;
    watchOptions: PositionOptions;
    useBrowserGeolocation: boolean;
    watchBrowserPositionOnAppStart: boolean;
    clientApiUrl: string;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(GeolocationConfig);
}
