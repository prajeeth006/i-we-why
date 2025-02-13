import { Component, Input, OnChanges, OnDestroy } from '@angular/core';

import { ClientConfigProductName, ContentItem, ContentService } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PageMatrixDirective } from './page-matrix.directive';

/**
 * @whatItDoes Renders page matrix on the client based on JSON or Sitecore path
 *
 * @howToUse
 *
 * If you already have content loaded:
 * ```
 * <vn-page-matrix [content]="content" />
 * ```
 *
 * If you would like the component to load any content asynchronously:
 * ```
 * <vn-page-matrix path="App-v1.0/Partials/Page" />
 * ```
 *
 * @description
 *
 * To load the content, you can either use JsonSerializer with supported templates to get it as part of
 * whatever response or client config (the correct serialization is used out of the box)
 * or use {@link ContentService} or just specify a content path to load from.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [PageMatrixDirective],
    selector: 'vn-page-matrix',
    template: '<ng-container *vnPageMatrix="contentItem" />',
    host: {
        '[class.page-matrix]': 'true',
    },
})
export class PageMatrixComponent implements OnChanges, OnDestroy {
    @Input() path: string;
    @Input() content: ContentItem;
    @Input() product?: ClientConfigProductName;

    contentItem: ContentItem;

    private unsubscribe = new Subject<void>();

    constructor(private contentService: ContentService) {}

    ngOnChanges() {
        this.setContent();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private setContent() {
        if (!this.content && !this.path) {
            return;
        }

        if (this.content) {
            this.contentItem = this.content;
        } else if (this.path) {
            this.contentService
                .getJsonFiltered<ContentItem>(this.path, this.product)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((data: ContentItem) => {
                    this.contentItem = data;

                    const text = data.text?.replace(/\\+n/g, '');

                    if (text) {
                        this.contentItem.text = text;
                    }
                });
        }
    }
}
