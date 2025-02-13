import { Injectable } from '@angular/core';

import { BootstrapperService, HtmlNode, ProductService } from '@frontend/vanilla/core';

/**
 * @whatItDoes Runs logic to switch between products of a single domain application.
 *
 * **NOTE**: This service should only be used by the host app.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ProductActivatorService {
    private loaded = new Set<string>();

    constructor(
        private productService: ProductService,
        private bootstrapperService: BootstrapperService,
        private htmlNode: HtmlNode,
    ) {}

    async activate(product: string) {
        this.ensureRegistered(product);

        // This is so we can activate host, even tho default product is host. When we first activate it, we don't want to run deactivation (because it wasn't activated).
        if (this.loaded.has(this.productService.current.name)) {
            await this.bootstrapperService.runProductDeactivation(this.productService.current.name);
            this.htmlNode.setCssClass(`product-${this.productService.current.name}`, false);
        }

        this.productService.setActive(product);
        this.htmlNode.setCssClass(`product-${product}`, true);
        if (!this.loaded.has(product)) {
            await this.bootstrapperService.runProductLoad(product);
            this.loaded.add(product);
        }

        await this.bootstrapperService.runProductActivation(product);
    }

    private ensureRegistered(product: string) {
        const metadata = this.productService.getMetadata(product);
        if (!metadata.isRegistered) {
            throw new Error(`Cannot activate product ${product} because it was not registered.`);
        }
    }
}
