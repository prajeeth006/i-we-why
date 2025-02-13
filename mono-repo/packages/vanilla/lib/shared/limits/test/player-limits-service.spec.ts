import { TestBed } from '@angular/core/testing';

import { PlayerLimitsService } from '@frontend/vanilla/shared/limits';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('PlayerLimitsService', () => {
    let service: PlayerLimitsService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayerLimitsService],
        });

        service = TestBed.inject(PlayerLimitsService);
    });

    describe('refresh', () => {
        it('should return null value if user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            const spy = jasmine.createSpy();

            service.getLimits().subscribe(spy);
            service.refresh();

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const spy = jasmine.createSpy();

            service.getLimits().subscribe(spy);
            service.refresh();

            apiServiceMock.get.completeWith({ limits: [{ limitType: 'ONE', currentLimit: 100 }] });

            expect(spy).toHaveBeenCalledWith([{ limitType: 'ONE', currentLimit: 100 }]);
            expect(apiServiceMock.get).toHaveBeenCalledWith('playerlimits');
        });
    });
});
