import { AuthService, LogoutProvidersService } from '@frontend/vanilla/core';
import { Mock, Stub, StubPromise } from 'moxxi';

@Mock({ of: AuthService })
export class AuthServiceMock {
    @StubPromise() logout: jasmine.PromiseSpy;
    @StubPromise() isAuthenticated: jasmine.PromiseSpy;
    @StubPromise() duration: jasmine.PromiseSpy;
    @StubPromise() loginStartTime: jasmine.PromiseSpy;
    @StubPromise() sessionTimeLeft: jasmine.PromiseSpy;
    @StubPromise() ping: jasmine.PromiseSpy;
}

@Mock({ of: LogoutProvidersService })
export class LogoutProvidersServiceMock {
    @Stub() registerProviders: jasmine.PromiseSpy;
    @StubPromise() invoke: jasmine.PromiseSpy;
}
