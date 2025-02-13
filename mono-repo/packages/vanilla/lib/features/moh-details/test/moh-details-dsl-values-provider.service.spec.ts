import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { MohDetailsDslValuesProvider } from '../src/moh-details-dsl-values-provider.service';
import { MohDetails } from '../src/moh-details.service';
import { MohDetailsServiceMock } from './moh.mock';

describe('MohDetailsDslValuesProvider', () => {
    let target: DslRecordable;
    let mohDetailsServiceMock: MohDetailsServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        mohDetailsServiceMock = MockContext.useMock(MohDetailsServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, MohDetailsDslValuesProvider],
        });

        const provider = TestBed.inject(MohDetailsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['MohDetails']!;
    });

    describe('MohDetails', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Comments']).toBe('');
            expect(target['CountryCode']).toBe('');
            expect(target['ExclDays']).toBe(0);
            expect(target['MohPrimaryProductCode']).toBe(0);
            expect(target['MohPrimaryReasonCode']).toBe(0);
            expect(target['MohPrimaryRiskBandCode']).toBe(0);
            expect(target['MohPrimaryToolCode']).toBe(0);
            expect(target['MohScore']).toBe(0);
            expect(target['Processed']).toBe('');
            expect(target['VipUser']).toBe('');
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['Comments']).toThrowError(DSL_NOT_READY);
            expect(() => target['CountryCode']).toThrowError(DSL_NOT_READY);
            expect(() => target['ExclDays']).toThrowError(DSL_NOT_READY);
            expect(() => target['MohPrimaryProductCode']).toThrowError(DSL_NOT_READY);
            expect(() => target['MohPrimaryToolCode']).toThrowError(DSL_NOT_READY);
            expect(() => target['MohPrimaryReasonCode']).toThrowError(DSL_NOT_READY);
            expect(() => target['MohPrimaryRiskBandCode']).toThrowError(DSL_NOT_READY);
            expect(() => target['MohScore']).toThrowError(DSL_NOT_READY);
            expect(() => target['Processed']).toThrowError(DSL_NOT_READY);
            expect(() => target['VipUser']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            mohDetailsServiceMock.details.next(MohDetails);

            expect(target['Comments']).toBe('comment');
            expect(target['CountryCode']).toBe('GB');
            expect(target['ExclDays']).toBe(1);
            expect(target['MohPrimaryProductCode']).toBe(2);
            expect(target['MohPrimaryReasonCode']).toBe(3);
            expect(target['MohPrimaryRiskBandCode']).toBe(4);
            expect(target['MohPrimaryToolCode']).toBe(5);
            expect(target['MohScore']).toBe(6);
            expect(target['Processed']).toBe('true');
            expect(target['VipUser']).toBe('false');
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is moh details event', () => {
            mohDetailsServiceMock.details.next(MohDetails);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['mohDetails']);
        });
    });

    const MohDetails: MohDetails = {
        comments: 'comment',
        countryCode: 'GB',
        exclDays: 1,
        mohPrimaryProductCode: 2,
        mohPrimaryRiskBandCode: 4,
        mohPrimaryReasonCode: 3,
        mohPrimaryToolCode: 5,
        mohScore: 6,
        processed: 'true',
        vipUser: 'false',
    };
});
