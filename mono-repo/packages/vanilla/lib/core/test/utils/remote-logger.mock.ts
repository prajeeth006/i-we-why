import { RemoteLogger } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: RemoteLogger })
export class RemoteLoggerMock {
    @Stub() logError: jasmine.Spy;
    @Stub() log: jasmine.Spy;
}
