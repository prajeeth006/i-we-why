import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface DocumentUploadStatus extends Record<string, any> {
    pendingWith: string;
    isPending: boolean;
}

export interface DocumentUploadStatusWithUsecase extends Record<string, any> {
    documentUploadStatus: DocumentUploadStatus;
    useCase: string;
}
export interface DocumentUploadStatusOptions {
    /**
     * This should be provided.
     */
    useCase: string;
    /**
     * if true it will try to fetch values from cache.
     */
    cached?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class DocumentUploadStatusService {
    public unAuthStatus: DocumentUploadStatus = { pendingWith: '', isPending: false };

    private documentUplaodStatusEvents = new BehaviorSubject<DocumentUploadStatusWithUsecase | null>(null);
    private refreshSubject = new Subject<DocumentUploadStatusOptions>();

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {
        this.refreshSubject.subscribe((documentUploadStatusOption) => {
            this.load(documentUploadStatusOption);
        });
    }

    get documentUplaodStatus(): Observable<DocumentUploadStatusWithUsecase | null> {
        return this.documentUplaodStatusEvents;
    }

    refresh(documentUploadStatusOption: DocumentUploadStatusOptions) {
        this.refreshSubject.next(documentUploadStatusOption);
    }

    private load(documentUploadStatusOptions: DocumentUploadStatusOptions) {
        if (this.user.isAuthenticated) {
            this.apiService
                .get('documentUploadStatus', { useCase: documentUploadStatusOptions.useCase, cached: !!documentUploadStatusOptions.cached })
                .subscribe((status: DocumentUploadStatus) => {
                    this.documentUplaodStatusEvents.next({ documentUploadStatus: status, useCase: documentUploadStatusOptions.useCase });
                });
        }
    }
}
