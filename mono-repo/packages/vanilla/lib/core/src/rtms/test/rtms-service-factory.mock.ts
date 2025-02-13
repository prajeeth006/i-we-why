import { Mock, Stub } from 'moxxi';

import { RtmsServiceFactory } from '../rtms-service.factory';

@Mock({ of: RtmsServiceFactory })
export class RtmsServiceFactoryMock {
    @Stub() create: jasmine.Spy;
}
