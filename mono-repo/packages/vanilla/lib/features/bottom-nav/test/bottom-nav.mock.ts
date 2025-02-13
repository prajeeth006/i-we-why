import { Mock, Stub } from 'moxxi';

import { BottomNavService } from '../src/bottom-nav.service';

@Mock({ of: BottomNavService })
export class BottomNavServiceMock {
    currentHighlightedProductName: string;
    @Stub() hide: jasmine.Spy;
    @Stub() show: jasmine.Spy;
    @Stub() initProductHighlighting: jasmine.Spy;
    @Stub() setHighlightedProduct: jasmine.Spy;
    @Stub() findHighlightMatch: jasmine.Spy;
    @Stub() setActiveItem: jasmine.Spy;
}
