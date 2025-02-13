import { DomSanitizer } from '@angular/platform-browser';

import { DomChangeService } from '@frontend/vanilla/core';
import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: DomChangeService })
export class DomChangeServiceMock {
    @StubObservable() observe: jasmine.ObservableSpy;
}
@Mock({ of: DomSanitizer })
export class DomSanitizerMock {
    @Stub() bypassSecurityTrustHtml: jasmine.Spy;
}
