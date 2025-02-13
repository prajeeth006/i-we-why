import { TestBed } from '@angular/core/testing';

import { BettingStatusService } from '@frontend/vanilla/shared/betting-status';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('BettingStatusService', () => {
    let service: BettingStatusService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BettingStatusService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(BettingStatusService);
    });

    describe('refresh()', () => {
        it('should not call API if user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            service.refresh(true);

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });

        it('should return mocked value if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const spy = jasmine.createSpy();
            service.bettingStatus.subscribe(spy);
            service.refresh(true);

            apiServiceMock.get.completeWith({ hasBets: true });

            expect(spy).toHaveBeenCalledWith({ hasBets: true });
            expect(apiServiceMock.get).toHaveBeenCalledWith('bettingstatus', { cached: true });
        });
    });
});
