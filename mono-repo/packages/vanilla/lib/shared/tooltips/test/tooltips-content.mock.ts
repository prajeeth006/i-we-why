import { ViewTemplate } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { TooltipsConfig } from '../src/tooltips.client-config';

@Mock({ of: TooltipsConfig })
export class TooltipsConfigMock {
    whenReady = new Subject<void>();
    isOnboardingTooltipsEnabled: boolean;
    isTutorialTooltipsEnabled: boolean;
    tutorials: { [type: string]: ViewTemplate } = {};
    onboardings: { [type: string]: ViewTemplate } = {};
}
