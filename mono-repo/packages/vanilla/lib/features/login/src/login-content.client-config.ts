import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    ContentItem,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ProxyItemForClient,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnLoginContent', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: loginContentConfigFactory,
    deps: [LazyClientConfigService],
})
export class LoginContent extends LazyClientConfigBase {
    /**
     *
     * @howToUse don't use it directly, evaluated values are exposed in {@link LoginContentService.content}.
     */
    loginPage: ViewTemplateForClient;
    loginMessages: (ContentItem | ProxyItemForClient)[];
    loginPageMessages: ContentItem[];
    loginPageLinks: ContentItem[];
    loginPageMessagesBottom: ContentItem[];
    loginPageBottomLinks: MenuContentItem;
    newVisitor: NewVisitorContent;
    elements: {
        leftItems: MenuContentItem[];
    };
    registerPageLinks: ContentItem[];
}

export class NewVisitorContent {
    background: any;
    ctas: MenuContentItem;
    bottomItems: MenuContentItem;
    topItems: MenuContentItem;
}

export function loginContentConfigFactory(service: LazyClientConfigService) {
    return service.get(LoginContent);
}
