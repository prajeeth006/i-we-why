import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { KycStatusBootstrapService } from '../src/kyc-status-bootstrap.service';
import { KycStatusServiceMock } from './kyc.mocks';

describe('KycStatusBootstrapService', () => {
    let service: KycStatusBootstrapService;
    let kycStatusServiceMock: KycStatusServiceMock;

    beforeEach(() => {
        kycStatusServiceMock = MockContext.useMock(KycStatusServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, KycStatusBootstrapService],
        });

        service = TestBed.inject(KycStatusBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should refresh kyc status', () => {
            service.onFeatureInit(); // act

            expect(kycStatusServiceMock.refresh).toHaveBeenCalledWith({ cached: true });
        });
    });
});
