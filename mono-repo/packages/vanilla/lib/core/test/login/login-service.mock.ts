import { LoginService2 } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: LoginService2 })
export class LoginService2Mock {
    @Stub() goTo: jasmine.Spy;
    @Stub() shouldPrefillUsername: jasmine.Spy;
}
