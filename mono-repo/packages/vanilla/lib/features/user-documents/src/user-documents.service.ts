import { Injectable, signal } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';

import { UserDocumentsResponse } from './user-documents.models';

/**
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class UserDocumentsService {
    readonly userDocuments = signal<UserDocumentsResponse | null>(null);

    constructor(private apiService: SharedFeaturesApiService) {}

    refresh() {
        this.userDocuments.set(null);
        this.loadUserDocuments();
    }

    private loadUserDocuments() {
        if (!this.userDocuments()) {
            this.apiService.get('userdocuments').subscribe((userDocuments: UserDocumentsResponse) => {
                this.userDocuments.set(userDocuments);
            });
        }
    }
}
