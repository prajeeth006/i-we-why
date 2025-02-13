import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { MohDetailsService } from '../src/moh-details.service';

describe('MohDetailsService', () => {
    let target: MohDetailsService;
    let userServiceMock: UserServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MohDetailsService],
        });

        target = TestBed.inject(MohDetailsService);
    });

    describe('refresh', () => {
        it('should not call api', () => {
            userServiceMock.isAuthenticated = false;

            target.refresh();

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });

        it('should call cached api and emit value', () => {
            const spy = jasmine.createSpy();
            target.details.subscribe(spy);

            target.refresh();

            expect(apiServiceMock.get).toHaveBeenCalledWith('mohdetails', { cached: true });

            apiServiceMock.get.next({ moh: 1 });

            expect(spy).toHaveBeenCalledWith({ moh: 1 });
        });

        it('should fetch fresh values', () => {
            target.refresh(false);

            expect(apiServiceMock.get).toHaveBeenCalledWith('mohdetails', { cached: false });
        });
    });
});
