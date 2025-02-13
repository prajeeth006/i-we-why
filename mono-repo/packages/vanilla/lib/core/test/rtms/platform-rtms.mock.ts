import { ConnectionState, Notification as PlatformRtmsNotification, Service as PlatformRtmsService } from '@rtms/client';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: PlatformRtmsService })
export class PlatformRtmsServiceMock {
    messages = new Subject<PlatformRtmsNotification>();
    state: ConnectionState;
    @Stub() connect: jasmine.Spy;
    @Stub() close: jasmine.Spy;
}
