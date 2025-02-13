import { PAGE_VIEW_DATA_PROVIDER, TRACKING_SERVICE_PROVIDER, runOnFeatureInit } from '@frontend/vanilla/core';

import { DataLayerTrackingService } from './data-layer-tracking.service';
import { DefaultPageViewDataProvider } from './page-view-data-provider';
import { PageViewTrackingService } from './page-view-tracking.service';
import { TrackingBootstrapService } from './tracking-bootstrap.service';

export function provide() {
    return [
        { provide: PAGE_VIEW_DATA_PROVIDER, useClass: DefaultPageViewDataProvider, multi: true },
        { provide: TRACKING_SERVICE_PROVIDER, useClass: DataLayerTrackingService },
        PageViewTrackingService,
        runOnFeatureInit(TrackingBootstrapService),
    ];
}
