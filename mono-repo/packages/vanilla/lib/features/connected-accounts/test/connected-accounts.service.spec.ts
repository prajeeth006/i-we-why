import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { ConnectedAccountsService } from '../src/connected-accounts.service';

describe('ConnectedAccountsService', () => {
    let service: ConnectedAccountsService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ConnectedAccountsService],
        });

        service = TestBed.inject(ConnectedAccountsService);
    });

    describe('load', () => {
        it('should return null value if not loaded', () => {
            const spy = jasmine.createSpy();

            service.count.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if loaded', () => {
            const spy = jasmine.createSpy();

            service.count.subscribe(spy);
            service.load();

            const response = { count: 5 };

            apiServiceMock.get.completeWith(response);

            expect(spy).toHaveBeenCalledWith(response.count);
            expect(apiServiceMock.get).toHaveBeenCalledWith('connectedaccounts/count');
        });
    });
});
