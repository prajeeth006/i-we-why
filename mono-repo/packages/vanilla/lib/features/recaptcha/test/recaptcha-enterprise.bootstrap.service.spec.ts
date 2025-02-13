import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { RecaptchaEnterpriseBootstrapService } from '../src/recaptcha-enterprise-bootstrap.service';
import { ReCaptchaConfigMock } from './recaptcha-config.mock';
import { RecaptchaEnterpriseServiceMock } from './recaptcha.mock';

describe('RecaptchaEnterpriseBootstrapService', () => {
    let service: RecaptchaEnterpriseBootstrapService;
    let navigationServiceMock: NavigationServiceMock;
    let recaptchaEnterpriseServiceMock: RecaptchaEnterpriseServiceMock;
    let config: ReCaptchaConfigMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        recaptchaEnterpriseServiceMock = MockContext.useMock(RecaptchaEnterpriseServiceMock);
        config = MockContext.useMock(ReCaptchaConfigMock);
        TestBed.configureTestingModule({
            providers: [RecaptchaEnterpriseBootstrapService, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(RecaptchaEnterpriseBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should not init page instrumentation if not enabled', fakeAsync(() => {
            config.instrumentationOnPageLoad = false;
            service.onFeatureInit();
            config.whenReady.next();
            tick();
            expect(recaptchaEnterpriseServiceMock.initReCaptchaAPI).not.toHaveBeenCalled();
        }));
        it('should init page instrumentation', fakeAsync(() => {
            config.instrumentationOnPageLoad = true;
            service.onFeatureInit();
            config.whenReady.next();
            tick();
            expect(recaptchaEnterpriseServiceMock.initReCaptchaAPI).toHaveBeenCalled();
        }));
        it('should execute recaptcha on location change', fakeAsync(() => {
            config.instrumentationOnPageLoad = true;
            service.onFeatureInit();
            config.whenReady.next();
            tick();
            expect(recaptchaEnterpriseServiceMock.executeRecaptcha).not.toHaveBeenCalled();

            navigationServiceMock.locationChange.next({ id: 1, nextUrl: 'previous', previousUrl: 'next' });

            expect(recaptchaEnterpriseServiceMock.executeRecaptcha).toHaveBeenCalled();
        }));
    });
});
