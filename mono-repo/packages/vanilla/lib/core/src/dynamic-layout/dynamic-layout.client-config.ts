import { Injectable } from '@angular/core';

import { ClientConfigProductName } from '../client-config/client-config.decorator';
import { ViewTemplate } from '../content/content.models';
import { LazyClientConfig } from '../lazy/lazy-client-config.decorator';
import { LazyClientConfigBase, LazyClientConfigService } from '../lazy/lazy-client-config.service';
import { SlotType } from './dynamic-layout.service';

/**
 * @stable
 */
export class SlotConfig {
    type: SlotType;
    isEnabledCondition: string;
    content: ViewTemplate[] | { name: string; items: ViewTemplate[] };
}

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnDynamicLayout', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: dynamicLayoutConfigFactory,
    deps: [LazyClientConfigService],
})
export class DynamicLayoutConfig extends LazyClientConfigBase {
    slots: { [name: string]: SlotConfig };
}

export function dynamicLayoutConfigFactory(service: LazyClientConfigService): DynamicLayoutConfig {
    return service.get(DynamicLayoutConfig);
}
