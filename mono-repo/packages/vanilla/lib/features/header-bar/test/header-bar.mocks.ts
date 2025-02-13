import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { HeaderBarConfig } from '../src/header-bar.client-config';
import { HeaderBarService } from '../src/header-bar.service';

@Mock({ of: HeaderBarService })
export class HeaderBarServiceMock {
    @Stub() registerActions: jasmine.Spy;
    @Stub() close: jasmine.Spy;
    @Stub() back: jasmine.Spy;
    enabled$ = new BehaviorSubject<boolean>(false);
    disableClose$ = new BehaviorSubject<boolean>(false);
    showBackButton$ = new BehaviorSubject<boolean>(false);
}

@Mock({ of: HeaderBarConfig })
export class HeaderBarConfigMock extends HeaderBarConfig {
    override whenReady = new Subject<void>();
}
