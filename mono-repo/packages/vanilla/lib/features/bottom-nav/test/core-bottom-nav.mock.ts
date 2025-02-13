import { BottomNavService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: BottomNavService })
export class CoreBottomNavServiceMock {
    @Stub() hide: jasmine.Spy;
    @Stub() show: jasmine.Spy;
    @Stub() set: jasmine.Spy;
}
