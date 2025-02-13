import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LoginResponse, LoginResponseHandlerContext, ToastrQueueCurrentToastContext, ToastrSchedule } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ToastrQueueServiceMock } from '../../../../core/test/toastr/toastr-queue.mock';
import { LimitsToastrLoginResponseHandlerHook } from '../../../../features/login/src/login-response-handler/limits-toastr-login-response-handler-hook';
import { LoginConfigMock } from '../../../../features/login/test/login.mocks';
import { LimitsServiceMock } from '../../../../shared/limits/test/deposit-limits.mock';

describe('LimitsToastrLoginResponseHandlerHook', () => {
    let hook: LimitsToastrLoginResponseHandlerHook;
    let limitsServiceMock: LimitsServiceMock;
    let loginConfigMock: LoginConfigMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let response: LoginResponse;

    beforeEach(() => {
        limitsServiceMock = MockContext.useMock(LimitsServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        response = {};

        loginConfigMock.enableLimitsToaster = true;

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LimitsToastrLoginResponseHandlerHook],
        });

        hook = TestBed.inject(LimitsToastrLoginResponseHandlerHook);
    });

    describe('onPostLogin', () => {
        describe('toastrqueue add', () => {
            testToast(false, ToastrSchedule.Immediate);
            testToast(true, ToastrSchedule.AfterNextNavigation);

            function testToast(willRedirect: boolean, expectedSchedule: string) {
                it(`should add to toastrqueue with ${expectedSchedule} schedule if url willRedirect=${willRedirect}`, fakeAsync(() => {
                    hook.onPostLogin(new LoginResponseHandlerContext(response, {}, willRedirect, true));
                    limitsServiceMock.getToasterPlaceholders.resolve({});
                    tick();

                    expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('loginlimits', { placeholders: {}, schedule: expectedSchedule });
                }));
            }

            it('should add to toastrqueue with afterNextNavigation if another toast is active', fakeAsync(() => {
                toastrQueueServiceMock.currentToast = new ToastrQueueCurrentToastContext({ name: '', templateName: '' }, {});

                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));
                limitsServiceMock.getToasterPlaceholders.resolve({});
                tick();

                expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('loginlimits', {
                    placeholders: {},
                    schedule: ToastrSchedule.AfterNextNavigation,
                });
            }));

            it('should not add to toastrqueue if default action is not used', () => {
                response.redirectUrl = 'url';

                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));

                expect(toastrQueueServiceMock.add).not.toHaveBeenCalledWith('loginlimits', jasmine.anything());
            });

            it('should not add to toastrqueue if disabled', () => {
                loginConfigMock.enableLimitsToaster = false;

                hook.onPostLogin(new LoginResponseHandlerContext(response, {}, false, true));

                expect(toastrQueueServiceMock.add).not.toHaveBeenCalledWith('lastsessioninfo', jasmine.anything());
            });
        });
    });
});
