import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

import { ClientTagManager } from './tracking.models';

@LazyClientConfig({ key: 'vnTracking', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: trackingConfigFactory,
})
export class TrackingConfig extends LazyClientConfigBase {
    isEnabled: boolean;
    dataLayerName: string;
    notTrackedQueryStrings: string[];
    tagManagerRenderers: string[];
    eventCallbackTimeoutInMilliseconds: number;
    dataLayerUpdateTimeoutInMilliseconds: number;
    pageViewDataProviderTimeout: number;
    clientTagManagers: ClientTagManager[];
    clientInjectionExcludes: string[];
    allowlist: string[];
    benchmarkThreshold: number;
    blocklist: string[];
    deviceBlockEnabled: boolean;
    deviceConcurrency: number;
    deviceMemory: number;
    enableLogging: boolean;
    enableOmitting: boolean;
    omitAll: boolean;
    omitPercentage: number;
    schedulerEnabled: boolean;
    trackingDelay: number;
}

export function trackingConfigFactory(service: LazyClientConfigService) {
    return service.get(TrackingConfig);
}
