import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { ConfirmPasswordResourceService } from '../src/confirm-password-resource.service';

describe('ConfirmPasswordResourceService', () => {
    let service: ConfirmPasswordResourceService;
    let apiService: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiService = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ConfirmPasswordResourceService],
        });

        service = TestBed.inject(ConfirmPasswordResourceService);
    });

    describe('isPasswordValidationRequired', () => {
        it('should return if password validation is required', () => {
            service.isPasswordValidationRequired();

            expect(apiService.get).toHaveBeenCalledWith('confirmpassword/ispasswordvalidationrequired');
        });
    });
});
