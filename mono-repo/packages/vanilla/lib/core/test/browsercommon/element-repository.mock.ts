import { ElementRepositoryService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: ElementRepositoryService })
export class ElementRepositoryServiceMock {
    @Stub() register: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
    @Stub() get: jasmine.Spy;
    elements$ = new Subject();
}
