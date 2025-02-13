import { Injectable } from '@angular/core';

import { MenuContentItem, MenuItemsService, NavigationService, Page, UrlService } from '@frontend/vanilla/core';

abstract class ProductHighlightMatcher {
    protected constructor(public item: MenuContentItem) {}

    abstract match(url: string): boolean;
}

class RegexProductHighlightMatcher extends ProductHighlightMatcher {
    private regex: RegExp;

    constructor(item: MenuContentItem, pattern: string) {
        super(item);

        this.regex = new RegExp(pattern);
    }

    match(url: string): boolean {
        return this.regex.test(url);
    }
}

class ExactMatchProductHighlightMatcher extends ProductHighlightMatcher {
    constructor(
        item: MenuContentItem,
        private readonly url: string,
    ) {
        super(item);

        this.url = this.url.toLowerCase();
    }

    match(url: string): boolean {
        return url === this.url;
    }
}

@Injectable({
    providedIn: 'root',
})
export class MenuItemHighlightService {
    regexProductHighlightMatchers: ProductHighlightMatcher[] = [];
    exactProductHighlightMatchers: ProductHighlightMatcher[] = [];

    constructor(
        private urlService: UrlService,
        private page: Page,
        private navigationService: NavigationService,
        private menuItemsService: MenuItemsService,
    ) {}

    initHighlighting(menuItems: MenuContentItem[]) {
        menuItems.forEach((p) => {
            const highlightUrlPattern = p.parameters ? p.parameters['highlight-url-pattern'] : null;
            if (highlightUrlPattern) {
                this.regexProductHighlightMatchers.push(new RegexProductHighlightMatcher(p, highlightUrlPattern));
            } else if (p.url) {
                const url = this.urlService.parse(p.url);
                if (url.isSameHost) {
                    this.exactProductHighlightMatchers.push(new ExactMatchProductHighlightMatcher(p, url.baseUrl() + url.path()));
                }
            }
        });
    }

    setHighlightedProduct(content: MenuContentItem[], currentHighlightedProductName: string | null): MenuContentItem | null {
        let product: MenuContentItem | null;

        product = this.findHighlightMatch(this.exactProductHighlightMatchers) || this.findHighlightMatch(this.regexProductHighlightMatchers);

        if (!product) {
            product = content.find((p) => p.name === currentHighlightedProductName || p.name === this.page.product.toLowerCase()) || null;
        }

        return product;
    }

    /** Sets item to active state. */
    setActiveItem(section: string, itemName: string) {
        this.menuItemsService.setActive(section, itemName);
    }

    private findHighlightMatch(matchers: ProductHighlightMatcher[]): MenuContentItem | null {
        const byMatcher = matchers.find((p) =>
            p.match(this.navigationService.location.baseUrl() + this.navigationService.location.path().toLowerCase()),
        );
        if (byMatcher) {
            return byMatcher.item;
        }

        return null;
    }
}
