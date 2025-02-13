import { Injectable } from '@angular/core';

import { Page } from '../client-config/page.client-config';
import { LastKnownProductService } from '../last-known-product/last-known-product.service';
import { NativeAppService } from '../native-app/native-app.service';
import { NavigationService } from '../navigation/navigation.service';
import { ParsedUrl } from '../navigation/parsed-url';
import { UrlService } from '../navigation/url.service';
import { ProductHomepagesConfig } from '../products/product-homepages.client-config';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(
        public navigation: NavigationService,
        private page: Page,
        private lastKnownProductService: LastKnownProductService,
        private url: UrlService,
        private productHomepages: ProductHomepagesConfig,
        private nativeApp: NativeAppService,
    ) {}

    /** Navigates to home page. Calls goToNativeApp for native app. For wrapper app navigates to app's product homepage */
    goTo() {
        if (this.nativeApp.isNativeApp) {
            this.navigation.goToNativeApp();
            return;
        }

        const homeUrl = this.getUrl();
        this.navigation.goTo(homeUrl);
    }

    /** Gets home url. */
    getUrl(): ParsedUrl {
        let homeUrl;
        if (this.nativeApp.isNativeWrapper) {
            homeUrl = this.url.parse((this.productHomepages as any)[this.getCommonName(this.nativeApp.product)]);
        } else {
            const lkp = this.lastKnownProductService.get();
            homeUrl = this.url.parse(lkp.url);
        }

        homeUrl.changeCulture(this.page.lang);
        return homeUrl;
    }

    private getCommonName(product: string) {
        if (product === 'BETTING' || product === 'SPORTSBOOK') {
            return 'sports';
        }

        return product.toLowerCase();
    }
}
