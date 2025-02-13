import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnRangeDatepicker', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: configFactory,
})
export class RangeDatepickerConfig extends LazyClientConfigBase {
    templates: { [key: string]: ViewTemplateForClient };
    firstDayOfWeek: number;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(RangeDatepickerConfig);
}
