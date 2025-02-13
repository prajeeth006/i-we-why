import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { UrlService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { LanguageInfoMock, PageMock } from '../browsercommon/page.mock';

describe('UrlService', () => {
    let urlService: UrlService;
    let setAttributeSpy: jasmine.Spy;
    let pageMock: PageMock;
    let windowMock: WindowMock;
    let doc: Document;

    let testUrl: string;
    let testRelativeUrl: string;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        windowMock = new WindowMock();
        pageMock.uiLanguages = [new LanguageInfoMock('en', 'English'), new LanguageInfoMock('es-xl', 'Mehlang')];
        pageMock.defaultLanguage = new LanguageInfoMock('en', 'English');

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                UrlService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        doc = TestBed.inject(DOCUMENT);

        const createElementSpy = spyOn(doc, 'createElement').and.callThrough();

        urlService = TestBed.inject(UrlService);

        setAttributeSpy = spyOn(createElementSpy.calls.mostRecent().returnValue, 'setAttribute').and.callThrough();
        windowMock.location.href = location.href;

        testUrl = 'http://dev.www.bwin.com:1337/en/casino/play/blackjack?mode=real#hash';
        testRelativeUrl = '/en/casino/play/blackjack?mode=real#hash';
    });

    it('should parse absolute url to parts', () => {
        const url = urlService.parse(testUrl);

        expect(url.protocol).toBe('http');
        expect(url.port).toBe('1337');
        expect(url.hostname).toBe('dev.www.bwin.com');
        expect(url.pathname).toBe('/en/casino/play/blackjack');
        expect(url.hash).toBe('hash');
        expect(url.search.get('mode')).toBe('real');
        expect(url.culture).toBe('en');
    });

    it('should parse relative url to parts', () => {
        const path = '/en/casino/play/blackjack?mode=real#hash';
        const url = urlService.parse(path);
        const location = window.location;

        expect(url.protocol).toBe(location.protocol.replace(':', ''));
        expect(url.port).toBe(location.port);
        expect(url.hostname).toBe(location.hostname);
        expect(url.pathname).toBe('/en/casino/play/blackjack');
        expect(url.hash).toBe('hash');
        expect(url.search.get('mode')).toBe('real');
        expect(url.culture).toBe('en');
    });

    it('should parse current url to parts', () => {
        const location = window.location;
        windowMock.location.href = location.href;
        const url = urlService.current();

        expect(url.protocol).toBe(location.protocol.replace(':', ''));
        expect(url.port).toBe(location.port);
        expect(url.hostname).toBe(location.hostname);
        expect(url.pathname).toBe(location.pathname);
        expect(url.hash).toBe(location.hash);
        expect(url.search.toString().length).toBe(0);
        expect(url.culture).toBeNull();
    });

    it('should set isSameHost if url is on the same host', () => {
        const url = urlService.parse(window.location.href);

        expect(url.isSameHost).toBeTrue();
    });

    it('should set isSameTopDomain if url is on the same top domain', () => {
        pageMock.domain = '.bwin.com';

        const url = urlService.parse(testUrl);

        expect(url.isSameTopDomain).toBeTrue();
    });

    describe('search', () => {
        it('should parse query string array', () => {
            const url = urlService.parse('/page?a=1&a=2&a=3');

            expect(url.search.getAll('a')).toContain('1');
            expect(url.search.getAll('a')).toContain('2');
            expect(url.search.getAll('a')).toContain('3');
        });

        it('should reconstruct query string array', () => {
            const url = '/en/page?a=1&a=2&a=3';
            const parsedUrl = urlService.parse(url);

            expect(parsedUrl.url()).toBe(url);
        });

        it('should be case insensitive', () => {
            const url = urlService.parse('/page?A=1&a=2&B=3&wEiRd=4');

            expect(url.search.getAll('a')).toEqual(['1', '2']);
            expect(url.search.get('b')).toBe('3');
            expect(url.search.has('b')).toBeTrue();
            expect(url.search.has('B')).toBeTrue();

            url.search.delete('A');
            expect(url.search.get('a')).toBeNull();

            url.search.append('b', '2');
            expect(url.search.getAll('b')).toEqual(['3', '2']);

            url.search.delete('WeIrD');
            expect(url.search.has('weird')).toBeFalse();
        });

        it('should decode values', () => {
            const url = '/en/page?a=http%3A%2F%2Fwww.bwin.com';
            const parsedUrl = urlService.parse(url);

            expect(parsedUrl.search.get('a')).toBe('http://www.bwin.com');
        });

        it('should decode keys', () => {
            const url = '/en/page?a%3A=1';
            const parsedUrl = urlService.parse(url);

            expect(parsedUrl.search.get('a:')).toBe('1');
        });
    });

    describe('baseUrl', () => {
        it('should return baseUrl', () => {
            const url = urlService.parse(testUrl);

            expect(url.baseUrl()).toBe('http://dev.www.bwin.com:1337');
        });
    });

    describe('url', () => {
        it('should return path', () => {
            const url = urlService.parse(testUrl);

            expect(url.url()).toBe(testRelativeUrl);
        });

        it('should not add hash to path if not specified', () => {
            const path = '/en/casino/api?x=y';
            const url = urlService.parse(path);

            expect(url.url()).toBe(path);
        });

        it('should not add query to path if not specified', () => {
            const path = '/en/casino/page';
            const url = urlService.parse(path);

            expect(url.url()).toBe(path);
        });

        it('should support replacement values', () => {
            const url = urlService.parse('/{culture}/page');

            expect(url.url()).toBe('/en/page');
        });

        it('should support replacement values multiple times', () => {
            const url = urlService.parse('/{culture}/page?lang={culture}');

            expect(url.url()).toBe('/en/page?lang=en');
        });

        it('should add relative path to current url', () => {
            windowMock.location.pathname = '/en/casino/page';

            const url = urlService.parse('continue/path');

            expect(url.url()).toBe('/en/casino/page/continue/path');
        });

        it('should add relative query to current url', () => {
            windowMock.location.pathname = '/en/casino/page';

            const url = urlService.parse('?a=b');

            expect(url.url()).toBe('/en/casino/page?a=b');
        });
    });

    describe('absUrl', () => {
        it('should return absolute url', () => {
            const url = urlService.parse(testUrl);

            expect(url.absUrl()).toBe(testUrl);
        });

        it('should return absolute url without port', () => {
            const uri = 'http://dev.www.bwin.com/en/casino/play/blackjack?mode=real#hash';
            const url = urlService.parse(uri);

            expect(url.absUrl()).toBe(uri);
        });

        it('should preserve external url', () => {
            const uri = 'http://www.google.com/';
            const url = urlService.parse(uri);

            expect(url.absUrl()).toBe(uri);
        });
    });

    describe('path()', () => {
        it('should return pathname', () => {
            const url = urlService.parse(testUrl);

            expect(url.path()).toBe(url.pathname);
        });
    });

    describe('language', () => {
        it('should set culture to page language if not specified', () => {
            pageMock.lang = 'es-xl';

            const url = urlService.parse('/page');

            expect(url.culture).toBe('es-xl');
        });

        it('should set culture to default language if not specified in absolute url', () => {
            const url = urlService.parse('http://jo.com');

            expect(url.culture).toBe('en');
        });

        it('should allow url with supported language other than current', () => {
            const url = urlService.parse('/es-xl/page');

            expect(url.culture).toBe('es-xl');
        });
    });

    describe('changeCulture', () => {
        it('should throw if language is not supported', () => {
            const url = urlService.parse(testUrl);

            expect(() => {
                url.changeCulture('xx');
            }).toThrow();
        });

        it('should update language regardless of case', () => {
            const url = urlService.parse(testUrl);

            url.changeCulture('ES-XL');

            expect(url.culture).toBe('es-xl');

            url.changeCulture('en');

            expect(url.culture).toBe('en');
        });

        it('should update path', () => {
            const url = urlService.parse('/en/page');

            url.changeCulture('es-xl');

            expect(url.url()).toBe('/es-xl/page');
        });

        it('should insert language for root url', () => {
            const url = urlService.parse('http://www.bwin.com/');

            url.changeCulture('es-xl');

            expect(url.url()).toBe('/es-xl');
        });

        it('should not insert page language if language is not specified', () => {
            const url = urlService.parse('http://dev.www.bwin.com/portal?menu=view');

            url.changeCulture('es-xl');

            expect(url.url()).toBe('/portal?menu=view');
        });
    });

    describe('appendReferrer', () => {
        beforeEach(() => {
            testUrl = '/link-path';
        });

        it('should append rurl', () => {
            windowMock.location.href = 'http://www.bwin.com/original-path';

            const url = urlService.appendReferrer(testUrl);

            expect(url).toEndWith('/link-path?rurl=%2Foriginal-path');
        });

        it('should handle query string and fragment', () => {
            windowMock.location.href = 'http://www.bwin.com/original-path?query=1#section';

            const url = urlService.appendReferrer(testUrl);

            expect(url).toEndWith('/link-path?rurl=%2Foriginal-path%3Fquery%3D1%23section');
        });

        it('should reuse existing rurl', () => {
            windowMock.location.href = 'http://www.bwin.com/original-path?rurl=/root';

            const url = urlService.appendReferrer(testUrl);

            expect(url).toEndWith('/link-path?rurl=%2Froot');
        });

        it('should append absolute URL', () => {
            windowMock.location.href = 'http://www.bwin.com/original-path';

            const url = urlService.appendReferrer(testUrl, { absolute: true });

            expect(url).toEndWith('/link-path?rurl=http:%2F%2Fwww.bwin.com%2Foriginal-path');
        });

        it('should change rurl to absolute url if target is absolute url', () => {
            testUrl = 'http://bwin.xx/en/link-path';
            windowMock.location.href = 'http://www.bwin.com/original-path';

            const url = urlService.appendReferrer(testUrl);

            expect(url).toBe('http://bwin.xx/en/link-path?rurl=' + getAbsReturnUrl());
        });

        it('should change rurl to absolute url if target is absolute url (HTTPS)', () => {
            testUrl = 'https://bwin.xx/en/link-path';
            windowMock.location.href = 'http://www.bwin.com/original-path';

            const url = urlService.appendReferrer(testUrl);

            expect(url).toBe('https://bwin.xx/en/link-path?rurl=' + getAbsReturnUrl());
        });

        function getAbsReturnUrl() {
            return location.protocol + '%2F%2F' + location.host + '%2Fen%2Foriginal-path';
        }
    });

    describe('msie hack', () => {
        beforeEach(() => {
            (<any>doc).documentMode = 'ie';
        });

        afterEach(() => {
            delete (<any>doc).documentMode;
        });

        it('should parse twice for msie', () => {
            urlService.parse(testUrl);

            expect(setAttributeSpy.calls.count()).toBe(2);
        });
    });
});
