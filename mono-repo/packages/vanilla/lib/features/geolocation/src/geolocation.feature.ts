import { LazyClientConfigService, registerLazyDslOnModuleInit, runLaunchDarklyLazyContextProvider, runOnFeatureInit } from '@frontend/vanilla/core';

import { GeolocationBootstrapService } from './geolocation-bootstrap.service';
import { GeolocationBrowserApiService } from './geolocation-browser-api.service';
import { GeolocationCookieService } from './geolocation-cookie.service';
import { GeolocationDslResolver } from './geolocation-dsl-resolver';
import { GeolocationDslValuesProvider } from './geolocation-dsl-values-provider';
import { GeolocationContextProvider } from './geolocation-launch-darkly-context-provider';
import { GeolocationResourceService } from './geolocation-resource.service';
import { GeolocationConfig, configFactory } from './geolocation.client-config';
import { GeolocationService } from './geolocation.service';

export function provide() {
    return [
        GeolocationBrowserApiService,
        GeolocationResourceService,
        GeolocationService,
        GeolocationCookieService,
        GeolocationDslResolver,
        { provide: GeolocationConfig, useFactory: configFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(GeolocationBootstrapService),
        registerLazyDslOnModuleInit(GeolocationDslValuesProvider),
        runLaunchDarklyLazyContextProvider(GeolocationContextProvider),
    ];
}
