import { Injectable } from '@angular/core';

import { NavigationService } from '../navigation/navigation.service';
import { ProductHomepagesConfig } from './product-homepages.client-config';

/**
 * @whatItDoes Provides common functionality related to login redirect
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ProductNavigationService {
    constructor(
        private navigation: NavigationService,
        private productHomepages: ProductHomepagesConfig,
    ) {}

    /**
     * @whatItDoes Provides url navigation capabilities with added overhead of replacing product placeholders i.e. {portal}.
     */
    goTo(redirectUrl: string) {
        if (redirectUrl) {
            Object.keys(this.productHomepages).map((product: string) => {
                redirectUrl = redirectUrl.replace(`{${product}}`, (this.productHomepages as any)[product]);
            });
            this.navigation.goTo(redirectUrl);
        }
    }
}
