import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CookieService, SameSiteMode, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { LoggerMock } from '../languages/logger.mock';
import { CookieOptionsProviderMock } from './cookie-options-provider.mock';
import { TopLevelCookiesConfigMock } from './cookie.mock';

describe('CookieService', () => {
    let service: CookieService;
    let cookieOptionsProviderMock: CookieOptionsProviderMock;
    let loggerMock: LoggerMock;
    let windowMock: WindowMock;
    let topLevelCookiesConfigMock: TopLevelCookiesConfigMock;

    beforeEach(() => {
        cookieOptionsProviderMock = MockContext.useMock(CookieOptionsProviderMock);
        loggerMock = MockContext.useMock(LoggerMock);
        topLevelCookiesConfigMock = MockContext.useMock(TopLevelCookiesConfigMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                ...MockContext.providers,
                CookieService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        cookieOptionsProviderMock.options = {};
        topLevelCookiesConfigMock.setCookieDomain = {
            cookies: [],
            domain: '',
        };
        setCookie('');
        service = TestBed.inject(CookieService);
    });

    describe('put()', () => {
        it('should put cookie to document', fakeAsync(() => {
            service.put('cookie', 'value');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=value');
        }));

        it('should create cookie with default options', fakeAsync(() => {
            cookieOptionsProviderMock.options.domain = 'd.com';
            cookieOptionsProviderMock.options.path = '/';
            cookieOptionsProviderMock.options.sameSite = SameSiteMode.None;
            cookieOptionsProviderMock.options.secure = true;

            service.put('cookie', 'value');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=value;path=/;domain=d.com;secure;SameSite=None');
        }));

        it('log warning if cookie is too long', fakeAsync(() => {
            service.put(
                'cookie',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat purus at felis malesuada vehicula. Nam sit amet ante quis libero commodo interdum. Duis feugiat, dui ut placerat lobortis, lectus felis tempor sem, nec euismod eros leo at tellus. Aenean risus tortor, consectetur et faucibus at, aliquam ut urna. Cras non aliquet lectus. Aenean nisl turpis, pharetra vitae lorem vel, hendrerit cursus sem. Vestibulum magna lacus, dignissim et nisi id, bibendum eleifend augue. Maecenas commodo porttitor suscipit. Mauris laoreet placerat interdum. Sed cursus lorem a venenatis ullamcorper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer iaculis aliquet neque, at aliquam nulla interdum in. Maecenas hendrerit in orci fringilla fermentum. Praesent ullamcorper nibh sit amet sem accumsan dictum. In risus ligula, fermentum et venenatis sed, sodales nec turpis.Morbi at odio id magna sodales condimentum. Duis imperdiet turpis nulla, id laoreet dui blandit id. In sollicitudin metus sem, id facilisis dui cursus nec. Donec dictum felis velit, eu malesuada ligula iaculis at. Nam dignissim suscipit lorem, in tincidunt tortor accumsan eget. Duis blandit posuere aliquam. Ut tempus feugiat lectus quis pulvinar. Nulla ullamcorper tellus in lectus semper, at consequat tellus finibus. Nulla condimentum non mauris sit amet cursus.Ut luctus leo non dui ullamcorper tempor in nec velit. Etiam fermentum laoreet est, eget ultrices urna gravida et. Nunc leo odio, gravida ac mattis a, tincidunt in quam. Cras posuere purus quis mattis rhoncus. Donec erat mi, pretium id justo vitae, egestas suscipit dolor. Duis commodo, nisl sed iaculis ullamcorper, nibh mauris aliquet erat, nec varius justo orci a neque. Phasellus id tellus bibendum, faucibus augue sed, venenatis risus.Sed iaculis quis mauris ac varius. Nulla congue dolor justo, non iaculis velit ornare at. Vivamus maximus tellus justo, vitae sagittis sem malesuada ut. Curabitur tincidunt hendrerit risus, eu congue odio aliquet a. Suspendisse metus tortor, imperdiet ac velit a, varius fringilla dolor. Morbi sodales aliquet posuere. Proin ut magna ligula. Nullam sodales ullamcorper tellus tempus interdum. Duis faucibus cursus finibus.Sed consectetur erat nec aliquam consectetur. Donec pharetra mauris nibh, quis scelerisque est mattis vel. Phasellus eros enim, pharetra sed finibus non, fringilla eu urna. Sed id risus eu quam tristique accumsan ut eu nulla. Curabitur scelerisque placerat ultrices. Etiam posuere congue diam ac commodo. Mauris at arcu eleifend, faucibus felis in, venenatis lorem. Vivamus ut justo convallis, tristique elit eu, porta lorem. Maecenas mollis sapien in mi pretium euismod. Suspendisse id ipsum ac mauris rutrum maximus vel et elit. Donec est lorem, consequat nec ligula porta, commodo egestas sem. Aenean accumsan enim nisl, id fermentum urna interdum eu. Nullam odio felis, finibus et euismod id, cursus a mauris. Maecenas vel ante vel sapien laoreet iaculis. Nam accumsan sapien metus, et condimentum mi pretium ut. Donec bibendum feugiat nisi, ac euismod tortor condimentum eget.Suspendisse faucibus ligula in neque rhoncus, eget vehicula risus blandit. Suspendisse sed aliquet lorem. Ut gravida iaculis elit non elementum. Suspendisse ut justo lectus. Pellentesque ullamcorper quam et lorem dapibus molestie et id leo. Duis pharetra viverra elit, a pharetra nulla. Maecenas fringilla porta dignissim. Integer dictum id orci eget condimentum. Mauris dictum pretium nulla vel pharetra.Phasellus ornare accumsan vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed feugiat odio. Vivamus eu massa est. Morbi faucibus, nisl sit amet eleifend malesuada, nisl orci venenatis neque, a ullamcorper tortor eros non neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam eget ante sodales, pulvinar nunc eu, hendrerit tortor.Etiam eu mattis odio. Etiam auctor in lorem id cursus. Mauris convallis at felis ut tincidunt. Fusce porta ornare eleifend. Sed sollicitudin sit amet est id viverra fusce.',
            );

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expect(loggerMock.warn).toHaveBeenCalled();
        }));

        it('should create cookie with custom options', fakeAsync(() => {
            const date = new Date();
            date.toUTCString = () => {
                return 'UTC DATE';
            };

            service.put('cookie', 'value', {
                domain: 'd.com',
                path: '/',
                sameSite: SameSiteMode.None,
                secure: true,
                expires: date,
                httpOnly: true,
            });

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=value;path=/;domain=d.com;expires=UTC DATE;secure;SameSite=None;HttpOnly');
        }));

        it('should create cookie with default options extended with custom options', fakeAsync(() => {
            cookieOptionsProviderMock.options.domain = 'd.com';
            cookieOptionsProviderMock.options.path = '/';
            cookieOptionsProviderMock.options.sameSite = SameSiteMode.None;
            cookieOptionsProviderMock.options.secure = false;

            const date = new Date();
            date.toUTCString = () => {
                return 'UTC DATE';
            };

            service.put('cookie', 'value', {
                sameSite: SameSiteMode.Strict,
                expires: date,
            });

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=value;path=/;domain=d.com;expires=UTC DATE;SameSite=Strict');
        }));
    });

    describe('putRaw()', () => {
        it('should put cookie to document', fakeAsync(() => {
            service.putRaw('cookie', 'value');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=value');
        }));

        it('should remove cookie if value is undefined', fakeAsync(() => {
            service.putRaw('cookie', undefined);

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
        }));
    });

    describe('putObject', () => {
        it('should store serialized object', fakeAsync(() => {
            service.putObject('cookie', { a: '1' });

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=%7B%22a%22%3A%221%22%7D');
        }));
    });

    describe('get()', () => {
        it('should get cookie value', () => {
            setCookie('cookie=value; cookie2=value2');

            expect(service.get('cookie')).toBe('value');
            expect(service.get('cookie2')).toBe('value2');
            expect(service.get('cookie3')).toBeUndefined();
        });

        it('should decode name and value', () => {
            setCookie('c%20%26=val%20%26');

            expect(service.get('c &')).toBe('val &');
        });

        it('should get value of the first cookie', () => {
            setCookie('cookie=value; cookie=value2');

            expect(service.get('cookie')).toBe('value');
        });
    });

    describe('getObject', () => {
        it('should get deserialized object', () => {
            setCookie('cookie=%7B%22a%22%3A%221%22%7D');

            expect(service.getObject('cookie')).toEqual({ a: '1' });
        });

        it('should get return invalid json as string', () => {
            setCookie('cookie=%7B%22a%22%3A%221%22');

            expect(service.getObject('cookie')).toBe('{"a":"1"');
        });

        it('should get return undefined if ccokie doesnt exist', () => {
            expect(service.getObject('cookie')).toBeUndefined();
        });
    });

    describe('getAll()', () => {
        it('should get value of all cookies', () => {
            setCookie('cookie=value; cookie2=value2');

            expect(service.getAll()).toEqual({
                cookie: 'value',
                cookie2: 'value2',
            });
        });
    });

    describe('remove()', () => {
        it('should write cookie with undefined value', fakeAsync(() => {
            cookieOptionsProviderMock.options.domain = 'd.com';
            cookieOptionsProviderMock.options.path = '/';
            cookieOptionsProviderMock.options.sameSite = SameSiteMode.None;
            cookieOptionsProviderMock.options.secure = true;

            service.remove('cookie');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=;path=/;domain=d.com;expires=Thu, 01 Jan 1970 00:00:00 GMT;secure;SameSite=None');
        }));

        it('should write cookie with undefined value with default options extended with custom options', fakeAsync(() => {
            cookieOptionsProviderMock.options.domain = 'd.com';
            cookieOptionsProviderMock.options.path = '/';
            cookieOptionsProviderMock.options.sameSite = SameSiteMode.None;
            cookieOptionsProviderMock.options.secure = false;

            const date = new Date();
            date.toUTCString = () => {
                return 'UTC DATE';
            };

            service.remove('cookie', {
                sameSite: SameSiteMode.Strict,
                expires: date,
            });

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=;path=/;domain=d.com;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Strict');
        }));
    });

    describe('removeAll()', () => {
        it('should remove all cookies', fakeAsync(() => {
            setCookie('cookie=value; cookie2=value2');

            service.removeAll();

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
            expectCookie('cookie2=;expires=Thu, 01 Jan 1970 00:00:00 GMT');
        }));
    });

    describe('addToQueryCollection()', () => {
        it('should initialize cookie if empty', fakeAsync(() => {
            service.addToQueryCollection('cookie', 'key', 'value');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=key=value');
        }));

        it('should pass options', fakeAsync(() => {
            const date = new Date();
            date.toUTCString = () => {
                return 'UTC DATE';
            };

            service.addToQueryCollection('cookie', 'key', 'value', {
                domain: '.bwin.com',
                path: '/la',
                expires: date,
                secure: true,
            });

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=key=value;path=/la;domain=.bwin.com;expires=UTC DATE;secure');
        }));

        it('should add more value under a key', fakeAsync(() => {
            setCookie('cookie=key=val');

            service.addToQueryCollection('cookie', 'key', 'value');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=key=val|value');
        }));

        it('should add new key with value', fakeAsync(() => {
            setCookie('cookie=key=val|val2');

            service.addToQueryCollection('cookie', 'key2', 'value');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=key=val|val2&key2=value');
        }));

        it('should encode value', fakeAsync(() => {
            service.addToQueryCollection('cookie', 'key', 'val &');

            topLevelCookiesConfigMock.whenReady.next();
            tick();

            expectCookie('cookie=key=val%20%26');
        }));
    });

    describe('getQueryCollection()', () => {
        it('should return values for given key', () => {
            setCookie('cookie=key=lol|wtf|omg&q=ee');

            const values = service.getQueryCollection('cookie', 'key');

            expect(values).toEqual(['lol', 'wtf', 'omg']);
        });

        it('should return empty if no cookie', () => {
            const values = service.getQueryCollection('cookie', 'key');

            expect(values).toBeEmptyArray();
        });

        it('should return empty if missing the key', () => {
            setCookie('other=val1|val2');

            const values = service.getQueryCollection('cookie', 'key');

            expect(values).toBeEmptyArray();
        });
    });

    function expectCookie(cookie: string) {
        expect(windowMock.document.cookieSetHistory).toContain(cookie);
    }

    function setCookie(cookieString: string) {
        windowMock.document.currentCookie = cookieString;
    }
});
