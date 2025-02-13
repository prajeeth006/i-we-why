import { signal } from '@angular/core';

import { DocumentUploadStatus, DocumentUploadStatusService, DocumentUploadStatusWithUsecase } from '@frontend/vanilla/shared/document-upload-status';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

@Mock({ of: DocumentUploadStatusService })
export class DocumentUploadStatusServiceMock {
    status = signal<DocumentUploadStatus | null>(null);
    documentUplaodStatus = new BehaviorSubject<DocumentUploadStatusWithUsecase | null>(null);
    unAuthStatus: DocumentUploadStatus = { pendingWith: '', isPending: true };

    @Stub() refresh: jasmine.Spy;
    current: DocumentUploadStatus;
}
