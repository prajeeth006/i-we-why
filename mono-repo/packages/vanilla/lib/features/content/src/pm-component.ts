import { Directive, OnDestroy, OnInit, inject } from '@angular/core';

import { HtmlNode, MetaTagsService } from '@frontend/vanilla/core';

import { PcContentItem } from './content.models';
import { PCComponent } from './pc-component';

/**
 * Base class for page matrix page layout templates.
 *
 * @stable
 */
@Directive()
export abstract class PMPage extends PCComponent<PcContentItem> implements OnInit, OnDestroy {
    private metaTagsService = inject(MetaTagsService);
    private htmlNode = inject(HtmlNode);

    protected constructor() {
        super();
    }

    ngOnInit() {
        this.setHtmlClass(true);
        this.writePageMetadata();
    }

    ngOnDestroy() {
        this.setHtmlClass(false);
        this.metaTagsService.whenReady.subscribe(() => this.metaTagsService.clearPageTags());
    }

    private writePageMetadata() {
        const tags: Record<string, string> = {};

        if (this.item.pageDescription) {
            tags.description = this.item.pageDescription;
        }

        if (this.item.pageMetaTags) {
            Object.assign(tags, this.item.pageMetaTags);
        }

        this.metaTagsService.whenReady.subscribe(() => this.metaTagsService.setPageTags(this.item.pageTitle, tags));
    }

    private setHtmlClass(set: boolean) {
        if (this.item.parameters?.htmlClass) {
            this.htmlNode.setCssClass(this.item.parameters.htmlClass, set);
        }
    }
}
