import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { KycStatusService } from '@frontend/vanilla/shared/kyc';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('KycStatusService', () => {
    let service: KycStatusService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, KycStatusService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(KycStatusService);
    });

    describe('refresh()', () => {
        it('should return null value if user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            const spy = jasmine.createSpy();
            service.kycStatus.subscribe(spy);
            service.refresh();

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const spy = jasmine.createSpy();
            service.kycStatus.subscribe(spy);
            service.refresh();

            apiServiceMock.get.completeWith({ kycVerified: true });

            expect(spy).toHaveBeenCalledWith({ kycVerified: true });
            expect(apiServiceMock.get).toHaveBeenCalledWith('kycstatus', { useCase: undefined, cached: false });
        });

        it('should call api with useCase if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            service.refresh({ useCase: 'kyc' });

            expect(apiServiceMock.get).toHaveBeenCalledWith('kycstatus', { useCase: 'kyc', cached: false });
        });

        it('should throttleTime api calls', fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
            service.refresh({ useCase: 'kyc' });
            service.refresh({ useCase: 'kyc' });
            service.refresh();
            service.refresh();

            expect(apiServiceMock.get).toHaveBeenCalledTimes(2);
            expect(apiServiceMock.get.calls.all().map((call: any) => call.args)).toEqual([
                ['kycstatus', { useCase: 'kyc', cached: false }],
                ['kycstatus', { useCase: undefined, cached: false }],
            ]);
            apiServiceMock.get.calls.reset();

            tick(2000);

            service.refresh();

            expect(apiServiceMock.get).toHaveBeenCalledTimes(1);
            expect(apiServiceMock.get).toHaveBeenCalledWith('kycstatus', { useCase: undefined, cached: false });
            discardPeriodicTasks();
        }));
    });
});
