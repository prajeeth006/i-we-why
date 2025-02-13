import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

export type TagCollection = { [name: string]: string | null };

export interface PageMetaTagsRule {
    urlPath: string;
    urlQueryParams: { [name: string]: string };
    title: string | null;
    tags: TagCollection;
}

export interface GlobalMetaTagsRule {
    tags: TagCollection;
    urlPathAndQueryRegexes: string[];
    ruleName: string;
}

@LazyClientConfig({ key: 'vnMetaTags', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: metaTagsConfigFactory,
})
export class MetaTagsConfig extends LazyClientConfigBase {
    pageMetaTags: PageMetaTagsRule[];
    globalMetaTags: GlobalMetaTagsRule[];
}

export function metaTagsConfigFactory(service: LazyClientConfigService) {
    return service.get(MetaTagsConfig);
}
