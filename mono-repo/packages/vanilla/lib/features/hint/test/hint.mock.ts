import { Mock, Stub } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { HintOverlayService } from '../src/hint-overlay.service';

@Mock({ of: HintOverlayService })
export class HintOverlayServiceMock {
    @Stub() show: jasmine.Spy;

    constructor() {
        const overlayRef = new OverlayRefMock();
        this.show.and.returnValue([overlayRef, {}]);
    }
}
