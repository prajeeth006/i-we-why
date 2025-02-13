import { MenuItemHighlightService } from '@frontend/vanilla/shared/menu-item';
import { Mock, Stub } from 'moxxi';

@Mock({ of: MenuItemHighlightService })
export class MenuItemHighlightServiceMock {
    @Stub() initHighlighting: jasmine.Spy;
    @Stub() setHighlightedProduct: jasmine.Spy;
    @Stub() findHighlightMatch: jasmine.Spy;
    @Stub() setActiveItem: jasmine.Spy;
}
