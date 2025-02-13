import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { ReplaySubject } from 'rxjs';

import { PlayerGamingDeclarationTrackingService } from '../src/player-gaming-declaration-tracking.service';
import { GamingDeclaration, PlayerGamingDeclarationService } from '../src/player-gaming-declaration.service';

@Mock({ of: PlayerGamingDeclarationService })
export class PlayerGamingDeclarationServiceMock {
    gamingDeclaration = new ReplaySubject<GamingDeclaration>(1);
    @Stub() getInitData: jasmine.Spy;
    @Stub() load: jasmine.Spy;
    @StubObservable() accept: jasmine.ObservableSpy;
    @Stub() setCookie: jasmine.Spy;
    @Stub() removeCookie: jasmine.Spy;
    @Stub() isAccepted: jasmine.Spy;
    @Stub() setReturnPath: jasmine.Spy;
    @Stub() removeReturnPath: jasmine.Spy;
    @Stub() returnPath: jasmine.Spy;
    @StubPromise() isEnabled: jasmine.PromiseSpy;
}

@Mock({ of: PlayerGamingDeclarationTrackingService })
export class PlayerGamingDeclarationTrackingServiceMock {
    @Stub() trackLoad: jasmine.Spy;
    @Stub() trackAccept: jasmine.Spy;
}
