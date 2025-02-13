import { Injectable } from '@angular/core';

import {
    DeviceService,
    HtmlNode,
    NativeAppService,
    OnFeatureInit,
    Page,
    ProductMetadata,
    ProductService,
    UserService,
    UserUpdateEvent,
} from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

@Injectable()
export class HtmlBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private htmlNode: HtmlNode,
        private page: Page,
        private productService: ProductService,
        private deviceService: DeviceService,
        private nativeAppService: NativeAppService,
    ) {}

    onFeatureInit() {
        this.htmlNode.setAttribute('data-domain', this.page.domain);
        this.htmlNode.setCssClass(`th-${this.page.theme}`, true);
        this.htmlNode.setCssClass('item-path-enabled', this.page.itemPathDisplayModeEnabled);
        this.htmlNode.setCssClass('device-mobile', this.deviceService.isMobile);
        this.htmlNode.setCssClass('device-mobile-phone', this.deviceService.isMobilePhone);
        this.htmlNode.setCssClass('device-tablet', this.deviceService.isTablet);
        this.htmlNode.setCssClass('device-desktop', !this.deviceService.isMobile);
        this.htmlNode.setCssClass('device-touch', this.deviceService.isTouch);

        this.htmlNode.setCssClass('native-download-client-app', this.nativeAppService.isDownloadClientApp);
        this.htmlNode.setCssClass('native-download-client-wrapper', this.nativeAppService.isDownloadClientWrapper);
        this.htmlNode.setCssClass('native-app', this.nativeAppService.isNativeApp);
        this.htmlNode.setCssClass('native-wrapper', this.nativeAppService.isNativeWrapper && !this.nativeAppService.isNativeWrapperODR);
        this.htmlNode.setCssClass('native-wrapper-odr', this.nativeAppService.isNativeWrapperODR);

        if (!this.productService.isSingleDomainApp) {
            this.htmlNode.setCssClass(`product-${this.page.product}`, true);
        } else {
            this.productService.productChanged.subscribe((product: ProductMetadata) => {
                this.htmlNode.removeClassStartsWith(`product-`);
                this.htmlNode.setCssClass(`product-${product.name}`, true);
            });
        }

        this.setCountryAttribute();
        this.setHtmlClass();

        this.user.events.pipe(filter((e): e is UserUpdateEvent => e instanceof UserUpdateEvent)).subscribe((e: UserUpdateEvent) => {
            const diff = e.diff;

            if (diff.has('workflowType') || diff.has('isAuthenticated')) {
                this.setHtmlClass();
            }

            if (diff.has('country') || diff.has('isAuthenticated')) {
                this.setCountryAttribute();
            }
        });
    }

    private setCountryAttribute() {
        if (this.user.isAuthenticated) {
            this.htmlNode.setAttribute('data-country', this.user.country);
        } else {
            this.htmlNode.setAttribute('data-country', null);
        }
    }

    private setHtmlClass() {
        const hasWorkflow = this.user.workflowType !== 0;

        this.htmlNode.setCssClass('has-workflow', hasWorkflow);
        this.htmlNode.setCssClass('unauthenticated', !this.user.isAuthenticated);
        this.htmlNode.setCssClass('authenticated', this.user.isAuthenticated);
    }
}
