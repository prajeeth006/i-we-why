import { OverlayService } from '@frontend/vanilla/features/overlay';
import { Mock, Stub } from 'moxxi';

@Mock({ of: OverlayService })
export class OverlayServiceMock {
    @Stub() getHandler: jasmine.Spy;
    @Stub() getActiveInstance: jasmine.Spy;

    constructor() {
        this.getHandler.and.returnValue(new OverlayHandlerMock());
    }
}

export class OverlayHandlerMock {
    @Stub() show: jasmine.Spy;
    @Stub() hide: jasmine.Spy;
    @Stub() toggle: jasmine.Spy;
}
