import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';
import { DocumentUploadStatus, DocumentUploadStatusService } from '@frontend/vanilla/shared/document-upload-status';

@Injectable()
export class DocumentUploadStatusDslValuesProvider implements DslValuesProvider {
    documentUploadStatus: { [useCase: string]: DocumentUploadStatus } = {};

    constructor(
        private readonly dslRecorderService: DslRecorderService,
        readonly dslCacheService: DslCacheService,
        private documentUploadStatusService: DocumentUploadStatusService,
        private user: UserService,
    ) {
        this.documentUploadStatusService.documentUplaodStatus.subscribe((statusWithUsecase) => {
            if (statusWithUsecase) {
                this.documentUploadStatus[statusWithUsecase?.useCase] = statusWithUsecase?.documentUploadStatus;
                dslCacheService.invalidate([`documentUploadStatus`]);
            }
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            DocumentUploadStatus: this.dslRecorderService
                .createRecordable('documentUploadStatus')
                .createFunction({
                    name: 'IsPending',
                    get: (useCase: string) => this.getCurrentValue(useCase, 'isPending'),
                    deps: ['documentUploadStatus', 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'PendingWith',
                    get: (useCase: string) => this.getCurrentValue(useCase, 'pendingWith'),
                    deps: ['documentUploadStatus', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(useCase: string, property: string) {
        if (!this.user.isAuthenticated) {
            return this.documentUploadStatusService.unAuthStatus[property];
        }

        if (!this.documentUploadStatus[useCase]) {
            this.documentUploadStatusService.refresh({ cached: true, useCase: useCase });
        }

        return this.documentUploadStatus[useCase] ? this.documentUploadStatus[useCase][property] : DSL_NOT_READY;
    }
}
