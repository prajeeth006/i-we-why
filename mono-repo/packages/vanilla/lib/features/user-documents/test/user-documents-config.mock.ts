import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { UserDocumentsConfig } from '../src/user-documents.client-config';

@Mock({ of: UserDocumentsConfig })
export class UserDocumentsConfigMock extends UserDocumentsConfig {
    override whenReady = new Subject<void>();
}
