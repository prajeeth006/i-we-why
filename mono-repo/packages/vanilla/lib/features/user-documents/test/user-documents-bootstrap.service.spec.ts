import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RtmsType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LoginServiceMock } from '../../../shared/login/test/login.service.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { SofStatusDetailsCoreServiceMock } from '../../sof-status-details/test/sof-status.mock';
import { UserDocumentsBootstrapService } from '../src/user-documents-bootstrap.service';
import { UserDocumentsConfigMock } from './user-documents-config.mock';
import { UserDocumentsServiceMock } from './user-documents.service.mock';

describe('UserDocumentsBootstrapService', () => {
    let service: UserDocumentsBootstrapService;
    let loginServiceMock: LoginServiceMock;
    let userDocumentsConfigMock: UserDocumentsConfigMock;
    let rtmsServiceMock: RtmsServiceMock;
    let userDocumentsServiceMock: UserDocumentsServiceMock;
    let sofStatusDetailsServiceMock: SofStatusDetailsCoreServiceMock;

    beforeEach(() => {
        userDocumentsConfigMock = MockContext.useMock(UserDocumentsConfigMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        userDocumentsServiceMock = MockContext.useMock(UserDocumentsServiceMock);
        sofStatusDetailsServiceMock = MockContext.useMock(SofStatusDetailsCoreServiceMock);

        TestBed.configureTestingModule({
            providers: [UserDocumentsBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(UserDocumentsBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should refresh documents on supported RTMS events', fakeAsync(() => {
            loginServiceMock.runAfterLogin.and.callFake((_, callback) => callback());

            service.onFeatureInit();
            userDocumentsConfigMock.whenReady.next();
            tick();

            rtmsServiceMock.messages.next({ eventId: 'test', type: RtmsType.KYC_VERIFIED_EVENT, payload: {} });
            rtmsServiceMock.messages.next({ eventId: 'test', type: RtmsType.KYC_REFRESH_TRIGGER_EVENT, payload: {} });
            sofStatusDetailsServiceMock.whenReady.next();
            tick();

            expect(loginServiceMock.runAfterLogin).toHaveBeenCalledOnceWith(UserDocumentsBootstrapService.name, jasmine.any(Function));
            expect(userDocumentsServiceMock.refresh).toHaveBeenCalledTimes(3);
            expect(sofStatusDetailsServiceMock.refresh).toHaveBeenCalledTimes(3);
        }));
    });
});
