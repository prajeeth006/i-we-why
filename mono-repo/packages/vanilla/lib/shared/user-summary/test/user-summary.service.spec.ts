import { TestBed } from '@angular/core/testing';

import { UserSummaryService } from '@frontend/vanilla/shared/user-summary';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('UserSummaryService', () => {
    let service: UserSummaryService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UserSummaryService],
        });

        service = TestBed.inject(UserSummaryService);
    });

    describe('refresh', () => {
        it('should return null value if user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            const spy = jasmine.createSpy();

            service.getSummary().subscribe(spy);
            service.refresh();

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const spy = jasmine.createSpy();

            service.getSummary().subscribe(spy);
            service.refresh();

            apiServiceMock.get.completeWith({ isEnabled: true });

            expect(spy).toHaveBeenCalledWith({ isEnabled: true });
            expect(apiServiceMock.get).toHaveBeenCalledWith('usersummary');
        });
    });
});
