import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { DocumentUploadStatusWithUsecase } from '@frontend/vanilla/shared/document-upload-status';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { DocumentUploadStatusDslValuesProvider } from './../src/document-upload-status-dsl-values-provider';
import { DocumentUploadStatusServiceMock } from './document-upload-status.mocks';

describe('DocumentUploadStatusDslProvider', () => {
    let target: DslRecordable;
    let documentUploadStatusServiceMock: DocumentUploadStatusServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        documentUploadStatusServiceMock = MockContext.useMock(DocumentUploadStatusServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, DocumentUploadStatusDslValuesProvider],
        });

        const provider = TestBed.inject(DocumentUploadStatusDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders().DocumentUploadStatus!;
    });

    describe('DocumentUploadStatus', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['PendingWith']('useCase')).toBe('');
            expect(target['IsPending']('useCase')).toBeTrue();
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['PendingWith']('useCase')).toThrowError(DSL_NOT_READY);
            expect(() => target['IsPending']('useCase')).toThrowError(DSL_NOT_READY);
            expect(documentUploadStatusServiceMock.refresh).toHaveBeenCalledWith({ cached: true, useCase: 'useCase' });
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            documentUploadStatusServiceMock.documentUplaodStatus.next(DocumentUploadStatus);

            expect(target['PendingWith']('useCase')).toBe('Docs pending');
            expect(target['IsPending']('useCase')).toBeTrue();
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is document upload status event', () => {
            documentUploadStatusServiceMock.documentUplaodStatus.next(DocumentUploadStatus);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['documentUploadStatus']);
        });
    });

    const DocumentUploadStatus: DocumentUploadStatusWithUsecase = {
        documentUploadStatus: { pendingWith: 'Docs pending', isPending: true },
        useCase: 'useCase',
    };
});
