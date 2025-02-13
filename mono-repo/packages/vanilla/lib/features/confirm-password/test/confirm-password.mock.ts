import { Mock, StubPromise } from 'moxxi';

import { ConfirmPasswordResourceService } from '../src/confirm-password-resource.service';

@Mock({ of: ConfirmPasswordResourceService })
export class ConfirmPasswordResourceServiceMock {
    @StubPromise() isPasswordValidationRequired: jasmine.PromiseSpy;
}
