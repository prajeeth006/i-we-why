import { Mock, Stub } from 'moxxi';

import { Logger } from '../../src/logging/logger';

@Mock({ of: Logger })
export class LoggerMock {
    @Stub() debug: jasmine.Spy;
    @Stub() info: jasmine.Spy;
    @Stub() warn: jasmine.Spy;
    @Stub() error: jasmine.Spy;
    @Stub() errorRemote: jasmine.Spy;
    @Stub() warnRemote: jasmine.Spy;
    @Stub() infoRemote: jasmine.Spy;
}
