import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    GenericListItem,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
} from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnLabelSwitcher', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: labelSwitcherConfigFactory,
})
export class LabelSwitcherConfig extends LazyClientConfigBase {
    main: MenuContentItem;
    resources: GenericListItem;
    showChangeLabelToaster: string;
    isRestrictedAccessCondition: string;
    persistStayInState: boolean;
}

export function labelSwitcherConfigFactory(service: LazyClientConfigService) {
    return service.get(LabelSwitcherConfig);
}
