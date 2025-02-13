import { HttpErrorResponse } from '@angular/common/http';

import { Mock, Stub, StubObservable } from 'moxxi';
import { ReplaySubject } from 'rxjs';

import { RememberMeLoginService } from '../../../src/login/remember-me-login.service';
import { RememberMeService } from '../../../src/login/remember-me.service';

@Mock({ of: RememberMeService })
export class RememberMeServiceMock {
    retryNotifier: ReplaySubject<HttpErrorResponse | null> | null = null;
    @Stub() tokenExists: jasmine.Spy;
    @Stub() authTokenExists: jasmine.Spy;
    @StubObservable() setupTokenAfterLogin: jasmine.ObservableSpy;
    @StubObservable() login: jasmine.ObservableSpy;
    @StubObservable() logout: jasmine.ObservableSpy;
    callInProgress: boolean;
}

@Mock({ of: RememberMeLoginService })
export class RememberMeLoginServiceMock {
    @StubObservable() loginWithToken: jasmine.ObservableSpy;
    @Stub() lastCallTooRecent: jasmine.Spy;
}
