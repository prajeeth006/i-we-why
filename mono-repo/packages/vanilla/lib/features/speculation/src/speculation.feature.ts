import { Provider } from '@angular/core';

import { runOnFeatureInit } from '@frontend/vanilla/core';

import { SpeculationBootstrapService } from './speculation-bootstrap.service';

export function provide(): Provider[] {
    return [runOnFeatureInit(SpeculationBootstrapService)];
}
