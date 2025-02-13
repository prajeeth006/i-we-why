import { signal } from '@angular/core';

import { Mock, Stub } from 'moxxi';

import { UserDocumentsResponse } from '../src/user-documents.models';
import { UserDocumentsService } from '../src/user-documents.service';

@Mock({ of: UserDocumentsService })
export class UserDocumentsServiceMock {
    userDocuments = signal<UserDocumentsResponse | null>(null);
    @Stub() refresh: jasmine.Spy;
}
