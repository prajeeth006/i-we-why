import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { CALLBACK, RecaptchaEnterpriseService } from '../src/recaptcha-enterprise.service';
import { ReCaptchaConfigMock } from './recaptcha-config.mock';

describe('RecaptchaEnterpriseService', () => {
    let service: RecaptchaEnterpriseService;
    let windowMock: WindowMock;
    let pageMock: PageMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(ReCaptchaConfigMock);
        MockContext.useMock(LoggerMock);

        (<any>window).grecaptcha = {
            enterprise: {
                ready: () => {},
                execute: () => {},
                render: () => {},
                reset: () => {},
            },
        };

        windowMock.document.createElement.and.callFake(() => {
            return {};
        });

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                RecaptchaEnterpriseService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(RecaptchaEnterpriseService);
    });

    describe('initReCaptchaAPI()', () => {
        it('should add script and callback if not initialized', () => {
            windowMock.document.getElementById.and.returnValue(undefined);
            service.initReCaptchaAPI();

            expect(windowMock.document.createElement).toHaveBeenCalledWith('script');
            expect(windowMock.document.head.appendChild).toHaveBeenCalled();
        });
        it('should not add script if already added', () => {
            windowMock.document.getElementById.and.returnValue('recaptcha-enterprise');
            service.initReCaptchaAPI();

            expect(windowMock.document.createElement).not.toHaveBeenCalledWith('script');
            expect(windowMock.document.head.appendChild).not.toHaveBeenCalled();
        });
    });

    describe('executeRecaptcha()', () => {
        it('should call execute on recaptcha api', () => {
            pageMock.domain = 'bwin.com';

            service.initReCaptchaAPI();
            (<any>window)[CALLBACK]();
            spyOn((<any>service).reCaptchaApi, 'execute').and.returnValue(new Promise(() => 'token'));

            service.executeRecaptcha('action', 'key');
            service.scriptLoaded.next(true);

            expect((<any>service).reCaptchaApi.execute).toHaveBeenCalledWith('key', { action: 'action_bwincom' });
        });
    });

    describe('renderRecaptcha()', () => {
        it('should call render on recaptcha api', () => {
            service.initReCaptchaAPI();
            (<any>window)[CALLBACK]();
            spyOn((<any>service).reCaptchaApi, 'render');

            service.renderRecaptcha('id');

            expect((<any>service).reCaptchaApi.render).toHaveBeenCalledWith('id', jasmine.anything());
        });
    });
});
