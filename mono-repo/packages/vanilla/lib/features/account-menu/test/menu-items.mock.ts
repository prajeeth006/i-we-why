import { MenuItemsService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: MenuItemsService })
export class MenuItemsServiceMock {
    @Stub() setCounter: jasmine.Spy;
    @Stub() getDescription: jasmine.Spy;
    @Stub() getDescriptionCssClass: jasmine.Spy;
    @Stub() setDescription: jasmine.Spy;
    @Stub() setDescriptionCssClass: jasmine.Spy;
    @Stub() getCounter: jasmine.Spy;
    @Stub() setActive: jasmine.Spy;
    @Stub() isActive: jasmine.Spy;
    @Stub() stateEventChanged: jasmine.Spy;
}
