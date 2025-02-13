import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    ContentItem,
    GenericListItem,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnDropDownHeader', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: dropdownHeaderConfigFactory,
    deps: [LazyClientConfigService],
})
export class DropDownHeaderContent extends LazyClientConfigBase {
    elements: { leftItems: MenuContentItem[]; links: MenuContentItem[] };
    moreGames: ContentItem;
    resources: GenericListItem;
}

export function dropdownHeaderConfigFactory(service: LazyClientConfigService) {
    return service.get(DropDownHeaderContent);
}
