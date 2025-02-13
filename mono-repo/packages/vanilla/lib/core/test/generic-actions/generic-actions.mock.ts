import { GenericActionsService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: GenericActionsService })
export class GenericActionsServiceMock {
    @Stub() register: jasmine.Spy;
    @Stub() isRegistered: jasmine.Spy;
    @Stub() invoke: jasmine.PromiseSpy;
}
