import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    ContentItem,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    MenuContentSection,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnFooter', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: footerContentFactory,
    deps: [LazyClientConfigService],
})
export class ResponsiveFooterContent extends LazyClientConfigBase {
    isEnabledCondition: string;
    expandableModeEnabled: boolean;
    showHelpButton: boolean;
    links: MenuContentSection;
    seoLinks: MenuContentSection[];
    logos: { left: MenuContentSection; right: MenuContentSection };
    contentMessages: ContentItem[];
    copyright: ViewTemplateForClient;
    showLanguageSwitcherDslCondition: string;
    helpButton: MenuContentItem;
    showLabelSwitcher: boolean;
    footerTopItems: ContentItem[];
    expandableModeIcons: { expanded: string; collapsed: string };
}

export function footerContentFactory(service: LazyClientConfigService) {
    return service.get(ResponsiveFooterContent);
}
