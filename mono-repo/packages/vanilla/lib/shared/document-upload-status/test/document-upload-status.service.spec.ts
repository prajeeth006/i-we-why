import { TestBed } from '@angular/core/testing';

import { DocumentUploadStatusService } from '@frontend/vanilla/shared/document-upload-status';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('DocumentUploadStatusService', () => {
    let service: DocumentUploadStatusService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DocumentUploadStatusService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(DocumentUploadStatusService);
    });

    describe('refresh()', () => {
        it('should return null value if user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            const spy = jasmine.createSpy();
            service.documentUplaodStatus.subscribe(spy);
            service.refresh({ useCase: 'useCase', cached: false });

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const spy = jasmine.createSpy();
            service.documentUplaodStatus.subscribe(spy);
            service.refresh({ useCase: 'useCase', cached: false });

            apiServiceMock.get.completeWith({ pendingWith: '', isPending: true });

            expect(spy).toHaveBeenCalledWith({ documentUploadStatus: Object({ pendingWith: '', isPending: true }), useCase: 'useCase' });
            expect(apiServiceMock.get).toHaveBeenCalledWith('documentUploadStatus', { useCase: 'useCase', cached: false });
        });

        it('should call api with useCase if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            service.refresh({ useCase: 'useCase', cached: false });

            expect(apiServiceMock.get).toHaveBeenCalledWith('documentUploadStatus', { useCase: 'useCase', cached: false });
        });
    });
});
