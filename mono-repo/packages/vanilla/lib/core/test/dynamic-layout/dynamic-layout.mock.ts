import { DynamicLayoutService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DynamicLayoutService })
export class DynamicLayoutServiceMock {
    @Stub() registerSlot: jasmine.Spy;
    @Stub() getSlot: jasmine.Spy;
    @Stub() setComponent: jasmine.Spy;
    @Stub() addComponent: jasmine.Spy;
    @Stub() removeComponent: jasmine.Spy;
    @Stub() addFirstComponent: jasmine.Spy;
    @Stub() swap: jasmine.Spy;
}
