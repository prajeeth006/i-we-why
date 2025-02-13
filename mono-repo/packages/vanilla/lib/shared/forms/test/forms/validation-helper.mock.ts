import { ValidationHelperService } from '@frontend/vanilla/shared/forms';
import { Mock, Stub } from 'moxxi';

@Mock({ of: ValidationHelperService })
export class ValidationHelperServiceMock {
    @Stub() createValidators: jasmine.Spy;
    @Stub() applyViolations: jasmine.Spy;
    @Stub() getRules: jasmine.Spy;
    @Stub() getRawRules: jasmine.Spy;
    @Stub() createPasswordValidators: jasmine.Spy;

    constructor() {
        this.createValidators.and.returnValue([]);
        this.createPasswordValidators.and.returnValue([]);
    }
}
