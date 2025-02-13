import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

/*
 * @see {@link https://admin.dynacon.prod.env.works/services/263833/features/475441 DynaCon config}
 */
@LazyClientConfig({ key: 'vnTerminalSession', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: configFactory,
    deps: [LazyClientConfigService],
})
export class TerminalSessionConfig extends LazyClientConfigBase {
    content: ViewTemplateForClient;
    continueSessionButton: MenuContentItem;
    finishButton: MenuContentItem;
    depositAlertTime: number;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(TerminalSessionConfig);
}
