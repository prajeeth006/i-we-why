import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OffersResourceServiceMock } from '../../../shared/offers/test/offers.mocks';
import { OfferDslValuesProvider } from '../src/offer-dsl-values-provider';

describe('OfferDslValuesProvider', () => {
    let target: DslRecordable;
    let userServiceMock: UserServiceMock;
    let offersResourceServiceMock: OffersResourceServiceMock;

    beforeEach(() => {
        offersResourceServiceMock = MockContext.useMock(OffersResourceServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, OfferDslValuesProvider],
        });

        const provider = TestBed.inject(OfferDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders()['Offer']!;
    });

    describe('GetStatus', () => {
        it('should return NOT_AUTHENTICATED when user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            expect(target['GetStatus']('eds', '123')).toBe('NOT_AUTHENTICATED');
        });

        it('should return value when user is authenticated', () => {
            expect(() => target['GetStatus']('eds', '123')).toThrowError(DSL_NOT_READY);

            offersResourceServiceMock.getStatus.next({ status: 'PLAYABLE' });
            expect(target['GetStatus']('eds', '123')).toBe('PLAYABLE');
        });
    });

    describe('IsOffered', () => {
        it('should return false when user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            expect(target['IsOffered']('eds', '123')).toBeFalse();
        });

        it('should return true when user is authenticated', () => {
            expect(() => target['IsOffered']('eds', '123')).toThrowError(DSL_NOT_READY);

            offersResourceServiceMock.getStatus.next({ status: 'OFFERED' });
            expect(target['IsOffered']('eds', '123')).toBeTrue();
        });
    });
});
