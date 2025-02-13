import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnHeaderBar', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: configFactory,
})
export class HeaderBarConfig extends LazyClientConfigBase {
    workflowCloseAction: { [key: number]: WorkflowCloseAction };
    isEnabledCondition: string;
    disableCloseCondition: string;
    showBackButtonCondition: string;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(HeaderBarConfig);
}

export class WorkflowCloseAction {
    action: string;
    param?: any;
}
