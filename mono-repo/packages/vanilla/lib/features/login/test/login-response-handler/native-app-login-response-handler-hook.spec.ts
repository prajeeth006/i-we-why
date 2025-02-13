import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LoginResponseHandlerContext } from '../../../../core/src/login/login-response-handler/login-response-handler-hook';
import { LoginStoreServiceMock } from '../../../../core/test/login/login-store.mock';
import { PostLoginServiceMock } from '../../../../core/test/login/post-login.service.mock';
import { NativeAppLoginResponseHandlerHook } from '../../src/login-response-handler/native-app-login-response-handler-hook';

describe('NativeAppLoginResponseHandlerHook', () => {
    let hook: NativeAppLoginResponseHandlerHook;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let postLoginServiceMock: PostLoginServiceMock;

    beforeEach(() => {
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        postLoginServiceMock = MockContext.useMock(PostLoginServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, NativeAppLoginResponseHandlerHook],
        });

        hook = TestBed.inject(NativeAppLoginResponseHandlerHook);
        loginStoreServiceMock.enablePostLoginCcbDelay.and.returnValue(false);
    });

    describe('onPostLogin', () => {
        it('should send POST_LOGIN event to native app', fakeAsync(() => {
            const response = { postLoginValues: { partnerSessionUid: 'partnerSessionId' } };

            hook.onPostLogin(new LoginResponseHandlerContext(response, { additionalPostLoginCcbParameters: { test: 'yes' } }, true, true));
            tick();

            expect(postLoginServiceMock.sendPostLoginEvent).toHaveBeenCalledWith({ partnerSessionUid: 'partnerSessionId' }, { test: 'yes' });
        }));
    });
});
