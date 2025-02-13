import { HttpClient } from '@angular/common/http';
import { Injectable, Type, inject } from '@angular/core';

import { Page } from '../client-config/page.client-config';
import { LoadingIndicatorService } from '../loading-indicator/loading-indicator.service';
import { UrlService } from '../navigation/url.service';
import { ProductService } from '../products/product.service';
import { ApiBase } from './api-base.service';
import { ApiFactoryOptions } from './http.models';

/**
 * @whatItDoes Creates instances of {@link ApiBase} implementors.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ApiServiceFactory {
    private urlService = inject(UrlService);

    constructor(
        private httpClient: HttpClient,
        private loadingIndicatorService: LoadingIndicatorService,
        private page: Page,
        private productService: ProductService,
    ) {}

    create<T extends ApiBase>(
        token: Type<T>,
        options: ApiFactoryOptions = {
            product: '',
            area: null,
            forwardProductApiRequestHeader: false,
        },
    ): T {
        if (this.productService.isSingleDomainApp) {
            return this.createForProduct(token, options);
        } else {
            return this.createInstance(token, '', options, this.getHeaders(options));
        }
    }

    createForProduct<T extends ApiBase>(
        token: Type<T>,
        options: { product: string; area: string | null; forwardProductApiRequestHeader: boolean } = {
            product: '',
            area: null,
            forwardProductApiRequestHeader: false,
        },
    ): T {
        return this.createInstance(token, this.productService.getMetadata(options.product).apiBaseUrl, options, this.getHeaders(options));
    }

    private getHeaders(options: ApiFactoryOptions): { [key: string]: string } | null {
        if (!options.forwardProductApiRequestHeader) return null;

        const headers: { [key: string]: string } = {};

        headers[`x-bwin-${options.product}-api`] = this.page.environment;

        return headers;
    }

    private createInstance<T extends ApiBase>(
        token: Type<T>,
        apiBaseUrl: string,
        options: ApiFactoryOptions,
        headers?: { [key: string]: string } | null,
    ) {
        const instance = new token();

        instance.wireup(this.urlService, this.httpClient, this.loadingIndicatorService, apiBaseUrl, this.page.lang, options, headers);

        return instance;
    }
}
