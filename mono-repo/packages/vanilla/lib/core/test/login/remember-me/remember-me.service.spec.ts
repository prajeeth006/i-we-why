import { TestBed } from '@angular/core/testing';

import { CookieName, RememberMeService, UserConfig, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DeviceFingerprintServiceMock } from '../../../../features/login/test/device-fingerprint.mock';
import { WindowMock } from '../../../src/browser/window/test/window-ref.mock';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { DeviceServiceMock } from '../../browser/device.mock';
import { PageMock } from '../../browsercommon/page.mock';
import { NativeAppServiceMock } from '../../native-app/native-app.mock';
import { RememberMeConfigMock } from './remember-me.config.mock';

describe('RememberMeService', () => {
    let target: RememberMeService;
    let rememberMeConfigMock: RememberMeConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let windowMock: WindowMock;
    let userConfig: UserConfig;
    let nativeAppServiceMock: NativeAppServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let pageMock: PageMock;

    beforeEach(() => {
        rememberMeConfigMock = MockContext.useMock(RememberMeConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(DeviceFingerprintServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        windowMock = new WindowMock();
        userConfig = new UserConfig();

        TestBed.configureTestingModule({
            providers: [
                RememberMeService,
                MockContext.providers,
                { provide: UserConfig, useValue: userConfig },
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        pageMock.lang = 'elf';
        rememberMeConfigMock.isEnabled = true;
        rememberMeConfigMock.apiHost = 'https://www.bwin.com/';
    });

    describe('tokenExists()', () => {
        const testCases = [
            { expected: true, cookie: 'abc' },
            { expected: false, cookie: null },
            { expected: false, cookie: '' },
        ];
        for (const tc of testCases) {
            it(`should return ${tc.expected} if cookie is ${JSON.stringify(tc.cookie)}`, () => {
                target = TestBed.inject(RememberMeService);
                cookieServiceMock.get.withArgs('rm-i').and.returnValue(tc.cookie);

                const result = target.tokenExists(); // act

                expect(result).toBe(tc.expected);
            });
        }

        it('should return false if disabled in config', () => {
            rememberMeConfigMock.isEnabled = false;
            target = TestBed.inject(RememberMeService);

            const result = target.tokenExists(); // act

            expect(result).toBeFalse();
            expect(cookieServiceMock.get).not.toHaveBeenCalled();
        });
    });

    describe('setupTokenAfterLogin()', () => {
        it('should make PUT request', () => {
            target = TestBed.inject(RememberMeService);
            target.setupTokenAfterLogin().subscribe(); // act

            expectApiRequest('PUT');
        });

        it('should not make any request if disabled in config', () => {
            rememberMeConfigMock.isEnabled = false;
            target = TestBed.inject(RememberMeService);

            target.setupTokenAfterLogin().subscribe(); // act

            expect(windowMock.fetch).not.toHaveBeenCalled();
        });
    });

    it('login() should make POST request', () => {
        const data = { productId: 'PORN' };
        target = TestBed.inject(RememberMeService);

        target.login(data);

        expectApiRequest('POST', data);
    });

    it('authTokenExists() should return boolean value.', () => {
        target = TestBed.inject(RememberMeService);
        let result = target.authTokenExists(); // act
        expect(result).toBeFalse();

        cookieServiceMock.get.withArgs(CookieName.VnAuth).and.returnValue('authcookie');
        result = target.authTokenExists(); // act
        expect(result).toBeTrue();
    });

    it('logout() should make DELETE request', () => {
        target = TestBed.inject(RememberMeService);
        target.logout().subscribe(); // act

        expectApiRequest('DELETE');
    });

    function expectApiRequest(method: string, data?: any) {
        expect(windowMock.fetch).toHaveBeenCalledWith('https://www.bwin.com/api/auth/rememberme?culture=elf', {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-app-context': nativeAppServiceMock.context,
                'x-bwin-sf-api': pageMock.environment,
                'x-device-type': deviceServiceMock.deviceType,
                'x-from-product': pageMock.product,
                'x-xsrf-token': userConfig.xsrfToken || '',
                'x-bwin-browser-url': windowMock.location.href,
            },
            credentials: 'include',
            keepalive: true,
        });
    }
});
