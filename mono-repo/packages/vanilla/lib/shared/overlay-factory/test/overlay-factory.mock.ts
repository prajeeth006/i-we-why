import { Mock, Stub } from 'moxxi';

import { OverlayFactory } from '../src/overlay.factory';
import { MockPositionStrategies, MockScrollStrategies, OverlayRefMock } from './cdk-overlay.mock';

@Mock({ of: OverlayFactory })
export class OverlayFactoryMock {
    scrollStrategies = new MockScrollStrategies();
    position = new MockPositionStrategies();
    overlayRefs: Map<string, OverlayRefMock>;

    @Stub() create: jasmine.Spy;
    @Stub() dispose: jasmine.Spy;
    @Stub() createAnimatedOverlayStates: jasmine.Spy;
}
