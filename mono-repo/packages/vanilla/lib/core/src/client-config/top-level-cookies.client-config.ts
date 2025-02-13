import { Injectable } from '@angular/core';

import { LazyClientConfig } from '../lazy/lazy-client-config.decorator';
import { LazyClientConfigBase, LazyClientConfigService } from '../lazy/lazy-client-config.service';
import { ClientConfigProductName } from './client-config.decorator';

@LazyClientConfig({ key: 'vnTopLevelCookies', product: ClientConfigProductName.SF })
@Injectable()
export class TopLevelCookiesConfig extends LazyClientConfigBase {
    setCookieDomain: {
        cookies: string[];
        domain: string;
    };
}

export function cookieConfigFactory(service: LazyClientConfigService): TopLevelCookiesConfig {
    return service.get(TopLevelCookiesConfig);
}
