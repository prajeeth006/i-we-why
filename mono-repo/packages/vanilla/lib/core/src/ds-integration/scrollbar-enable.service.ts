import { Injectable } from '@angular/core';

import { HtmlNode } from '../browser/html-node.service';
import { Page } from '../client-config/page.client-config';

@Injectable({
    providedIn: 'root',
})
export class ScrollbarEnableService {
    constructor(
        private pageConfig: Page,
        private htmlNode: HtmlNode,
    ) {}

    enable() {
        if (this.pageConfig.enableDsScrollbar === true) {
            this.htmlNode.setCssClass('ds-scrollbar', true);
        }
    }
}
