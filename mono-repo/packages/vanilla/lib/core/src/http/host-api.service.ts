import { Injectable } from '@angular/core';

import { ApiBase } from './api-base.service';
import { ApiServiceFactory } from './api-service-factory.service';

/**
 * @whatItDoes Vanilla implementation of {@link ApiBase}. Calls API without area prefix.
 * @stable
 */
@Injectable({
    providedIn: 'root',
    useFactory: hostApiServiceFactory,
    deps: [ApiServiceFactory],
})
export class HostApiService extends ApiBase {}

export function hostApiServiceFactory(apiServiceFactory: ApiServiceFactory) {
    return apiServiceFactory.create(HostApiService, { product: 'host', area: null, forwardProductApiRequestHeader: false });
}
