import { TestBed } from '@angular/core/testing';

import { UserDocumentsResponse, UserDocumentsService } from '@frontend/vanilla/features/user-documents';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';

describe('UserDocumentsService', () => {
    let service: UserDocumentsService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UserDocumentsService],
        });

        service = TestBed.inject(UserDocumentsService);
    });

    describe('refresh', () => {
        it('should call API and init user documents', () => {
            service.refresh();

            expect(apiServiceMock.get).toHaveBeenCalledWith('userdocuments');

            apiServiceMock.get.next(<UserDocumentsResponse>{
                documentVerificationStatus: [],
            });

            expect(service.userDocuments()).toEqual({
                documentVerificationStatus: [],
            });
        });
    });
});
