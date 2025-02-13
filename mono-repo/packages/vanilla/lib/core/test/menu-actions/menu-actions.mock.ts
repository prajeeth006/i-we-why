import { MenuActionOrigin, MenuActionsService } from '@frontend/vanilla/core';
import { Mock, Stub, StubPromise } from 'moxxi';

@Mock({ of: MenuActionsService })
export class MenuActionsServiceMock {
    @Stub() register: jasmine.Spy;
    @StubPromise() invoke: jasmine.PromiseSpy;
    @StubPromise() processClick: jasmine.PromiseSpy;
    @StubPromise() trackClick: jasmine.PromiseSpy;
    origin = MenuActionOrigin.Menu;
}
