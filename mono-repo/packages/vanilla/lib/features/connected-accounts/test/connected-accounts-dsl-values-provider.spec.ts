import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ConnectedAccountsDslValuesProvider } from '../src/connected-accounts-dsl-values-provider';
import { ConnectedAccountsServiceMock } from './connected-accounts.mock';

describe('ConnectedAccountsDslValuesProvider', () => {
    let target: DslRecordable;
    let connectedAccountsServiceMock: ConnectedAccountsServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        connectedAccountsServiceMock = MockContext.useMock(ConnectedAccountsServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, ConnectedAccountsDslValuesProvider],
        });

        const provider = TestBed.inject(ConnectedAccountsDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['ConnectedAccounts']!;
    });

    describe('ConnectedAccounts', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Count']).toBe(0);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['Count']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            connectedAccountsServiceMock.count.next(5);

            expect(target['Count']).toBe(5);
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value on event', () => {
            connectedAccountsServiceMock.count.next(4);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['connectedAccounts']);
        });
    });
});
