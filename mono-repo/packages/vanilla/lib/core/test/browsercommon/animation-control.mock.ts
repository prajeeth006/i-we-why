import { NoopAnimationDriver } from '@angular/animations/browser';

import { AnimationControlService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: AnimationControlService })
export class AnimationControlServiceMock {
    @Stub() shouldAnimate: jasmine.Spy;
    @Stub() addCondition: jasmine.Spy;
    @Stub() clear: jasmine.Spy;
}

@Mock({ of: NoopAnimationDriver })
export class NoopAnimationDriverMock {
    @Stub() animate: jasmine.Spy;
}
