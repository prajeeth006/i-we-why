import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LOGIN_RESPONSE_HANDLER_HOOK } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LoginResponseHandlerHookMock, LoginResponseHandlerServiceMock } from '../../login/test/login.mocks';
import { DepositPromptBootstrapService } from '../src/deposit-prompt-bootstrap.service';
import { DepositPromptConfigMock } from './deposit-prompt-config.mock';
import { DepositPromptServiceMock } from './deposit-prompt.mock';

describe('DepositPromptBootstrapService', () => {
    let service: DepositPromptBootstrapService;
    let depositPromptConfigMock: DepositPromptConfigMock;
    let depositPromptServiceMock: DepositPromptServiceMock;
    let loginResponseHandlerServiceMock: LoginResponseHandlerServiceMock;
    let hookMock: LoginResponseHandlerHookMock;

    beforeEach(() => {
        depositPromptConfigMock = MockContext.useMock(DepositPromptConfigMock);
        depositPromptServiceMock = MockContext.useMock(DepositPromptServiceMock);
        loginResponseHandlerServiceMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        hookMock = MockContext.createMock(LoginResponseHandlerHookMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                DepositPromptBootstrapService,
                { provide: LOGIN_RESPONSE_HANDLER_HOOK, useValue: hookMock, multi: true },
            ],
        });

        service = TestBed.inject(DepositPromptBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should call deposit prompt service', fakeAsync(() => {
            service.onFeatureInit();
            depositPromptConfigMock.whenReady.next();
            tick();

            expect(loginResponseHandlerServiceMock.registerHooks).toHaveBeenCalledWith([hookMock]);
            expect(depositPromptServiceMock.atStartup).toHaveBeenCalled();
        }));
    });
});
