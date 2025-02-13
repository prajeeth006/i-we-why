import { Injectable } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @whatItDoes Manipulates page metadata (like title and meta tags).
 *
 * @howToUse
 *
 * ```
 * ngOnInit() {
 * this.metTagsService.whenReady(() => {
 *  this.metaTagsService.setPageTags('Page Title', {
 *         description: 'This is awesome page.',
 *         author: 'Chuck Norris'
 *     }
 *  }
 * });
 * ```
 *
 * @description
 *
 * You can use this service to change (or add) title and meta tags. All changes will survive only for particular page (until next navigation).
 * Values are automatically merged with configured ones by SEO analysts which take precedence.
 *
 * Values are automatically set for public pages displayed via {@link PageMatrixComponent}.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class MetaTagsService extends LazyServiceProviderBase {
    setPageTags(title?: string, tags?: { [name: string]: string }): void {
        this.inner.setPageTags(title, tags);
    }

    clearPageTags(): void {
        this.inner.clearPageTags();
    }
}
