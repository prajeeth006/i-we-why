import { TestBed } from '@angular/core/testing';

import { DepositLimitsService } from '@frontend/vanilla/shared/limits';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('DepositLimitsService', () => {
    let service: DepositLimitsService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userMock: UserServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DepositLimitsService],
        });

        service = TestBed.inject(DepositLimitsService);
    });

    describe('load', () => {
        it('should return mocked value if loaded', () => {
            const spy = jasmine.createSpy();

            service.limits.subscribe(spy);
            service.load();

            const response = {
                limits: [{ currentLimit: 23 }],
            };

            apiServiceMock.get.completeWith(response);

            expect(spy).toHaveBeenCalledWith(response.limits);
            expect(apiServiceMock.get).toHaveBeenCalledWith('depositlimits');

            apiServiceMock.get.calls.reset();
            service.load();

            expect(apiServiceMock.get).not.toHaveBeenCalledWith('depositlimits');
        });

        it('should not call api if user is not authenticated', () => {
            userMock.isAuthenticated = false;

            service.load();

            expect(apiServiceMock.get).not.toHaveBeenCalledWith('depositlimits');
        });
    });
});
