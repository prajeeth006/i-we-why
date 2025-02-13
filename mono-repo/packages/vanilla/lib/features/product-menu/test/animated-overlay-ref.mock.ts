import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';
import { AnimatedOverlayStates } from '@frontend/vanilla/shared/overlay-factory';
import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: AnimatedOverlayRef })
export class AnimatedOverlayRefMock {
    states: AnimatedOverlayStates;
    shouldAnimate: boolean;
    @StubObservable() beforeClose: jasmine.ObservableSpy;
    @StubObservable() afterClosed: jasmine.ObservableSpy;
    @Stub() onAnimationEvent: jasmine.Spy;
}
