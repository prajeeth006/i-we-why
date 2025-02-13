import { Provider } from '@angular/core';

import { LazyClientConfigService } from '../lazy/lazy-client-config.service';
import { TopLevelCookiesConfig, cookieConfigFactory } from './top-level-cookies.client-config';

export function provideTopLevelCookies(): Provider[] {
    return [{ provide: TopLevelCookiesConfig, deps: [LazyClientConfigService], useFactory: cookieConfigFactory }];
}
