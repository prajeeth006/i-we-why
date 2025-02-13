import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { RedirectMessageBootstrapService } from '../src/redirect-message-bootstrap.service';
import { RedirectMessageConfigMock, RedirectMessageServiceMock } from './redirect-messages.mocks';

describe('CookieConsentBootstrapService', () => {
    let service: RedirectMessageBootstrapService;
    let redirectMessageServiceMock: RedirectMessageServiceMock;
    let redirectConfigMock: RedirectMessageConfigMock;

    beforeEach(() => {
        redirectMessageServiceMock = MockContext.useMock(RedirectMessageServiceMock);
        redirectConfigMock = MockContext.useMock(RedirectMessageConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RedirectMessageBootstrapService],
        });

        service = TestBed.inject(RedirectMessageBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should try show message', fakeAsync(() => {
            service.onFeatureInit();
            redirectConfigMock.whenReady.next();
            tick();

            expect(redirectMessageServiceMock.tryShowMessage).toHaveBeenCalled();
        }));
    });
});
