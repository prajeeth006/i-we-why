import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TerminalDslValuesProvider } from '../../../src/dsl/value-providers/terminal-dsl-values-provider';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { UserServiceMock } from '../../user/user.mock';
import { DslValueAsyncResolverMock } from './dsl-value-async-resolver.mock';

describe('TerminalDslValuesProvider', () => {
    let target: DslRecordable;
    let dslValueAsyncResolverMock: DslValueAsyncResolverMock;
    let cookieServiceMock: CookieServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        dslValueAsyncResolverMock = MockContext.useMock(DslValueAsyncResolverMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, TerminalDslValuesProvider],
        });

        const provider = TestBed.inject(TerminalDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        cookieServiceMock.get.withArgs('terminal_id').and.returnValue('1');
        dslValueAsyncResolverMock.resolve.and.returnValue({
            status: 'Statuse8893889-da28-4b86-a678-8fd0ea06a159',
            data: {
                terminalType: 'TerminalType076c7b76-8f1a-470f-8adf-277e3d9a10cc',
                ipAddress: 'IpAddress4a462af9-1914-4504-b5fc-2a9b34e4e493',
                macId: 'MacId5aaf9a23-97ec-46b8-b1a5-8140f051a8b4',
                volume: 149,
                terminalStatus: 'TerminalStatus69362ced-5415-4b9a-b3a7-02fba47c06bc',
                resolution: 'Resolution3b4c1329-7031-45ae-97bc-5033cdb1a248',
                lockStatus: 'LockStatus83c9ac52-8e2b-4857-b0ab-dea453c62015',
                customerAccount: {
                    customerId: 'CustomerIdb80d2a30-16ff-40c6-adeb-227715acb04a',
                    accountName: 'AccountNamedd4c31fb-d2d4-4fb6-95ea-d6a93a6cfe1d',
                },
            },
        });

        target = provider.getProviders()['Terminal']!;
    });

    it('should resolve when authenticated', () => {
        expect(target['AccountName']).toBe('AccountNamedd4c31fb-d2d4-4fb6-95ea-d6a93a6cfe1d');
        expect(target['CustomerId']).toBe('CustomerIdb80d2a30-16ff-40c6-adeb-227715acb04a');
        expect(target['IpAddress']).toBe('IpAddress4a462af9-1914-4504-b5fc-2a9b34e4e493');
        expect(target['LockStatus']).toBe('LockStatus83c9ac52-8e2b-4857-b0ab-dea453c62015');
        expect(target['MacId']).toBe('MacId5aaf9a23-97ec-46b8-b1a5-8140f051a8b4');
        expect(target['Resolution']).toBe('Resolution3b4c1329-7031-45ae-97bc-5033cdb1a248');
        expect(target['Status']).toBe('Statuse8893889-da28-4b86-a678-8fd0ea06a159');
        expect(target['TerminalId']).toBe('1');
        expect(target['TerminalStatus']).toBe('TerminalStatus69362ced-5415-4b9a-b3a7-02fba47c06bc');
        expect(target['Type']).toBe('TerminalType076c7b76-8f1a-470f-8adf-277e3d9a10cc');
        expect(target['Volume']).toBe('149');
    });

    it('should return default values when not authenticated', () => {
        userServiceMock.isAuthenticated = false;
        expect(target['AccountName']).toBe('');
        expect(target['CustomerId']).toBe('');
        expect(target['IpAddress']).toBe('');
        expect(target['LockStatus']).toBe('');
        expect(target['MacId']).toBe('');
        expect(target['Resolution']).toBe('');
        expect(target['Status']).toBe('');
        expect(target['TerminalId']).toBe('1');
        expect(target['TerminalStatus']).toBe('');
        expect(target['Type']).toBe('');
        expect(target['Volume']).toBe('');
    });
});
