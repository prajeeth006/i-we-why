import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEvent, PostLoginService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { BalanceProperties } from '../../src/user/user.models';
import { CookieServiceMock } from '../browser/cookie.mock';
import { LocalStoreServiceMock } from '../browser/local-store.mock';
import { BalancePropertiesCoreServiceMock } from '../lazy/lazy-client-config.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { ClaimsServiceMock } from '../user/claims.mock';
import { UserServiceMock } from '../user/user.mock';
import { RememberMeServiceMock } from './remember-me/remember-me.service.mock';

describe('PostLoginService', () => {
    let service: PostLoginService;
    let nativeAppServiceMock: NativeAppServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let userMock: UserServiceMock;
    let balancePropertiesCoreServiceMock: BalancePropertiesCoreServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let rememberMeService: RememberMeServiceMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        claimsServiceMock = <any>userMock.claims;
        balancePropertiesCoreServiceMock = MockContext.useMock(BalancePropertiesCoreServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        rememberMeService = MockContext.useMock(RememberMeServiceMock);
        MockContext.useMock(LocalStoreServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PostLoginService],
        });

        service = TestBed.inject(PostLoginService);
    });

    describe('onPostLogin', () => {
        it('should send POST_LOGIN event to native app', fakeAsync(() => {
            rememberMeService.tokenExists.and.returnValue(true);

            userMock.isAuthenticated = true;
            userMock.accountId = 'account-id-1';
            userMock.currency = 'USD';
            userMock.id = 'user-id-1';
            userMock.country = 'AT';
            userMock.country = 'DE';
            userMock.screenname = 'nickname';
            userMock.ssoToken = 'sso-token';
            userMock.username = 'username';
            userMock.workflowType = 1;
            userMock.lastLoginTime = '2014-11-06T09:46:17.02Z';
            balancePropertiesCoreServiceMock.balanceInfo = <BalanceProperties>{ accountBalance: 1001 };
            cookieServiceMock.get.withArgs('superCookie').and.returnValue('super_cookie_value');
            claimsServiceMock.get.and.callFake((key: string) => {
                const values: Record<string, string> = {
                    dateofbirth: '1970-01-01',
                    email: 'em@i.l',
                    sessiontoken: 'session-token',
                    usertoken: 'user-token',
                    givenname: 'frodo',
                    surname: 'baggins',
                    secondsurname: 'shire',
                };
                return values[key];
            });

            const timeStamp = Date.now();

            let payload: NativeEvent = <any>null;
            nativeAppServiceMock.sendToNative.and.callFake((p: any) => {
                p.parameters.timeStamp = timeStamp;
                payload = p;
                return payload;
            });

            service.sendPostLoginEvent({ partnerSessionUid: 'partnerSessionId' }, { test: 'yes' });
            balancePropertiesCoreServiceMock.whenReady.next();
            tick();

            expect(payload).toEqual({
                eventName: 'POST_LOGIN',
                parameters: {
                    accountBalance: 1001,
                    accountCurrency: 'USD',
                    accountId: 'account-id-1',
                    birthDate: '1970-01-01',
                    countryCode: 'DE',
                    email: 'em@i.l',
                    language: 'en',
                    nameIdentifier: 'user-id-1',
                    screenName: 'nickname',
                    sessionToken: 'session-token',
                    ssoToken: 'sso-token',
                    timeStamp: timeStamp,
                    userName: 'username',
                    userToken: 'user-token',
                    workflowType: 1,
                    firstName: 'frodo',
                    lastName: 'baggins',
                    secondLastName: 'shire',
                    postLoginValues: { partnerSessionUid: 'partnerSessionId' },
                    superCookie: 'super_cookie_value',
                    test: 'yes',
                    lastLoginTime: '2014-11-06T09:46:17.02Z',
                    rememberMeEnabled: true,
                },
            });
        }));
    });
});
