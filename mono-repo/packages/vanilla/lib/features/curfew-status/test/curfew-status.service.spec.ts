import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { CurfewStatusService } from '../src/curfew-status.service';

describe('CurfewStatusService', () => {
    let service: CurfewStatusService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CurfewStatusService],
        });

        service = TestBed.inject(CurfewStatusService);
    });

    describe('load', () => {
        it('should return null value if not loaded', () => {
            const spy = jasmine.createSpy();

            service.curfewStatuses.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if loaded', () => {
            const spy = jasmine.createSpy();

            service.curfewStatuses.subscribe(spy);
            service.load();

            const response = { curfewStatus: { isDepositCurfewOn: true } };

            apiServiceMock.get.completeWith(response);

            expect(spy).toHaveBeenCalledWith(response.curfewStatus);
            expect(apiServiceMock.get).toHaveBeenCalledWith('curfewstatus');
        });
    });
});
