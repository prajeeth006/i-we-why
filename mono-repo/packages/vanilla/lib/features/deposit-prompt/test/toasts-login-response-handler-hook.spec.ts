import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginResponse, LoginResponseHandlerContext, ToastrSchedule } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ToastsLoginResponseHandlerHook } from '../src/toasts-login-response-handler-hook';
import { DepositPromptServiceMock } from './deposit-prompt.mock';

describe('ToastsLoginResponseHandlerHook', () => {
    let hook: ToastsLoginResponseHandlerHook;
    let depositPromptServiceMock: DepositPromptServiceMock;
    let response: LoginResponse;

    beforeEach(() => {
        depositPromptServiceMock = MockContext.useMock(DepositPromptServiceMock);
        response = {};

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ToastsLoginResponseHandlerHook],
        });

        hook = TestBed.inject(ToastsLoginResponseHandlerHook);
    });

    describe('onPostLogin', () => {
        describe('last login session info and migrated player onboarding', () => {
            testToast(false, ToastrSchedule.Immediate);
            testToast(true, ToastrSchedule.AfterNextNavigation);

            function testToast(willRedirect: boolean, expectedSchedule: string) {
                it(`should add to toastrqueue with ${expectedSchedule} schedule if url willRedirect=${willRedirect}`, () => {
                    hook.onPostLogin(new LoginResponseHandlerContext(response, {}, willRedirect, true));
                });
            }
        });

        describe('deposit prompt', () => {
            testToast(true);
            testToast(false);

            function testToast(willRedirect: boolean) {
                it(`should call deposit prompt service if url willRedirect=${willRedirect}`, () => {
                    hook.onPostLogin(new LoginResponseHandlerContext(response, {}, willRedirect, true));

                    expect(depositPromptServiceMock.postLogin).toHaveBeenCalledWith({ willRedirect });
                });
            }

            it(`should call deposit prompt service after last session info`, () => {
                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, true, true));

                expect(depositPromptServiceMock.postLogin).toHaveBeenCalledWith({ willRedirect: true });
            });

            it('should not call deposit prompt service if default action is not used', () => {
                response.redirectUrl = 'url';

                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));

                expect(depositPromptServiceMock.postLogin).not.toHaveBeenCalledWith();
            });
        });

        it('should return a promise', fakeAsync(() => {
            const spy = jasmine.createSpy();

            hook.onPostLogin(new LoginResponseHandlerContext(response, {}, true, true)).then(spy);

            expect(spy).not.toHaveBeenCalled();

            depositPromptServiceMock.postLogin.resolve();
            tick();

            expect(spy).toHaveBeenCalled();
        }));
    });
});
