import { WindowOffsetModifierService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: WindowOffsetModifierService })
export class WindowOffsetModifierServiceMock {
    @Stub() scrollBy: jasmine.Spy;
}
