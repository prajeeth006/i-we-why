import { MetaTagsService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { MetaTagsConfig } from '../src/meta-tags.client-config';

@Mock({ of: MetaTagsService })
export class MetaTagsServiceMock {
    whenReady: Subject<void> = new Subject();
    @Stub() setPageTags: jasmine.Spy;
    @Stub() clearPageTags: jasmine.Spy;
}

@Mock({ of: MetaTagsConfig })
export class MetaTagsConfigMock extends MetaTagsConfig {
    override whenReady = new Subject<void>();
}
