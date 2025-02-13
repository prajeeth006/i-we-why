import { NetworkService, NetworkStatusEvent, NetworkStatusSource } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

@Mock({ of: NetworkService })
export class NetworkServiceMock {
    isOnline: boolean = true;
    events = new BehaviorSubject<NetworkStatusEvent>({ source: NetworkStatusSource.Initial, online: true });
    @Stub() reportOnlineRequest: jasmine.Spy;
    @Stub() reportOfflineRequest: jasmine.Spy;
}
