import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SofStatusDetailsService } from '../src/sof-status-details.service';

describe('SofStatusDetailsService', () => {
    let target: SofStatusDetailsService;
    let userServiceMock: UserServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SofStatusDetailsService],
        });

        target = TestBed.inject(SofStatusDetailsService);
    });

    describe('refresh', () => {
        it('should not call api', () => {
            userServiceMock.isAuthenticated = false;

            target.refresh();

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });

        it('should call cached api and emit value', () => {
            const spy = jasmine.createSpy();
            target.statusDetails.subscribe(spy);

            target.refresh();

            expect(apiServiceMock.get).toHaveBeenCalledWith('sofstatusdetails', { cached: true });

            apiServiceMock.get.next({ sofStatus: 'vred' });

            expect(spy).toHaveBeenCalledWith({ sofStatus: 'vred' });
        });

        it('should fetch fresh values', () => {
            target.refresh(false);

            expect(apiServiceMock.get).toHaveBeenCalledWith('sofstatusdetails', { cached: false });
        });
    });
});
