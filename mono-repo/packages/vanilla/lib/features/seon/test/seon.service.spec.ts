import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SessionStoreServiceMock } from '../../../core/src/browser/store/test/session-store.mock';
import { SeonService } from '../src/seon.service';
import { SeonConfigMock, seonSdkMock } from './seon.mocks';

describe('SeonService', () => {
    let service: SeonService;
    let seonConfigMock: SeonConfigMock;
    let sessionStorageMock: SessionStoreServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        seonConfigMock = MockContext.useMock(SeonConfigMock);
        sessionStorageMock = MockContext.useMock(SessionStoreServiceMock);
        spy = jasmine.createSpy();

        TestBed.configureTestingModule({
            providers: [SeonService, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(SeonService);
    });

    describe('getSessionKey()', () => {
        beforeEach(() => {
            seonSdkMock.init.calls.reset();
            seonSdkMock.getSession.calls.reset();
            seonConfigMock.enabled = true;
        });

        it('should return stored session key if available', fakeAsync(() => {
            // Arrange
            sessionStorageMock.get.and.returnValue('stored-session-key');

            // Act
            service.getSessionKey().then(spy);
            seonConfigMock.whenReady.next();
            tick();

            // Assert
            expect(spy).toHaveBeenCalledWith('stored-session-key');
            expect(seonSdkMock.init).not.toHaveBeenCalled();
            expect(seonSdkMock.getSession).not.toHaveBeenCalled();
        }));
    });
});
