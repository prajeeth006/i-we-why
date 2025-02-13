import { Injectable } from '@angular/core';

import { ClientConfigProductName } from '../client-config/client-config.decorator';
import { ApiBase } from './api-base.service';
import { ApiServiceFactory } from './api-service-factory.service';

/**
 * @whatItDoes Shared features implementation of {@link ApiBase}. Calls shared features api.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
    useFactory: sharedFeaturesApiServiceFactory,
    deps: [ApiServiceFactory],
})
export class SharedFeaturesApiService extends ApiBase {}

export function sharedFeaturesApiServiceFactory(apiServiceFactory: ApiServiceFactory) {
    return apiServiceFactory.createForProduct(SharedFeaturesApiService, {
        product: ClientConfigProductName.SF,
        area: null,
        forwardProductApiRequestHeader: true,
    });
}
