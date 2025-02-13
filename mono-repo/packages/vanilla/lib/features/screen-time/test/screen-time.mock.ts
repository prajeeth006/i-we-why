import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { ScreenTimeBrowserService } from '../src/screen-time-browser.service';
import { ScreenTimeResourcesService } from '../src/screen-time-resource.service';
import { ScreenTimeConfig } from '../src/screen-time.client-config';

@Mock({ of: ScreenTimeConfig })
export class ScreenTimeConfigMock {
    whenReady = new Subject<void>();
    minimumUpdateInterval: number = 1000;
    minimumScreenTime: number = 5000;
    idleTimeout: number = 6000;
}

@Mock({ of: ScreenTimeBrowserService })
export class ScreenTimeBrowserServiceMock {
    @Stub() init: jasmine.Spy;
    browserVisibilityEvent = new Subject<boolean>();
}

@Mock({ of: ScreenTimeResourcesService })
export class ScreenTimeResourcesServiceMock {
    @Stub() saveScreenTime: jasmine.Spy;
}
