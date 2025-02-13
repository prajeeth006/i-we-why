import { TestBed } from '@angular/core/testing';

import { ClaimsConfig, DslRecorderService, getClientConfigProperties } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ClientConfigDiff } from '../../../src/client-config/client-config.model';
import { ClaimDslValuesProvider } from '../../../src/dsl/value-providers/claim-dsl-values-provider';
import { ClientConfigServiceMock } from '../../client-config/client-config.mock';
import { ClaimsServiceMock } from '../../user/claims.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';

describe('ClaimDslValuesProvider', () => {
    let provider: ClaimDslValuesProvider;
    let dslCacheServiceMock: DslCacheServiceMock;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let claimsServicMock: ClaimsServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);
        claimsServicMock = MockContext.useMock(ClaimsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, ClaimDslValuesProvider],
        });

        provider = TestBed.inject(ClaimDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('Get', () => {
        it('should return a claim', () => {
            claimsServicMock.get.withArgs('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name').and.returnValue('test');

            const value = provider.getProviders()['Claims']!['Get']('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');

            expect(value).toBe('test');
        });

        it('should return empty string for non existent claim', () => {
            claimsServicMock.get.withArgs('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name').and.returnValue(null);

            const value = provider.getProviders()['Claims']!['Get']('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name');

            expect(value).toBeEmptyString();
        });
    });

    describe('watcher', () => {
        it('should invalidate cache for claims that changed value', () => {
            const updateObj: ClientConfigDiff = new Map();
            updateObj.set(
                getClientConfigProperties(ClaimsConfig).key,
                new Map([
                    ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name', 'test2'],
                    ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/userName', 'test4'],
                ]),
            );

            clientConfigServiceMock.updates.next(updateObj);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith([
                'claim.Get.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
                'claim.Get.name',
                'claim.Get.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/username',
                'claim.Get.username',
            ]);
        });
    });
});
