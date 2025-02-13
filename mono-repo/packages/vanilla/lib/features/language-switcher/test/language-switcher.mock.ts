import { signal } from '@angular/core';

import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { LanguageSwitcherOverlayService } from '../src/language-switcher-overlay.service';
import { LanguageSwitcherTrackingService } from '../src/language-switcher-tracking.service';
import { LanguageSwitcherConfig } from '../src/language-switcher.client-config';
import { LanguageSwitcherService } from '../src/language-switcher.service';

@Mock({ of: LanguageSwitcherService })
export class LanguageSwitcherServiceMock {
    headerEnabled = signal<boolean>(false);
    @StubObservable() getLanguageSwitcherData: jasmine.ObservableSpy;
}

@Mock({ of: LanguageSwitcherOverlayService })
export class LanguageSwitcherOverlayServiceMock {
    @Stub() openMenu: jasmine.Spy;
}

@Mock({ of: LanguageSwitcherConfig })
export class LanguageSwitcherConfigMock extends LanguageSwitcherConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: LanguageSwitcherTrackingService })
export class LanguageSwitcherTrackingServiceMock {
    @Stub() trackDisplay: jasmine.Spy;
    @StubPromise() trackChangeLanguage: jasmine.PromiseSpy;
    @Stub() trackOpenLanguageSwitcherMenu: jasmine.Spy;
}
