import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserScrubService } from '../src/user-scrub.service';

describe('UserScrubService', () => {
    let service: UserScrubService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UserScrubService],
        });

        service = TestBed.inject(UserScrubService);
    });

    describe('load', () => {
        it('should return null value if not loaded', () => {
            const spy = jasmine.createSpy();

            service.products.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if loaded', () => {
            const spy = jasmine.createSpy();

            service.products.subscribe(spy);
            service.load();

            const products = ['p1', 'p2'];

            apiServiceMock.get.completeWith({ products });

            expect(spy).toHaveBeenCalledWith(products);
            expect(apiServiceMock.get).toHaveBeenCalledWith('userscrub');
        });
    });
});
