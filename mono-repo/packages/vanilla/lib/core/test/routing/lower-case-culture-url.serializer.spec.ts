import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LowerCaseCultureUrlSerializer } from '../../src/routing/lower-case-culture-url.serializer';
import { UrlServiceMock } from '../navigation/url.mock';

describe('LowerCaseCultureUrlSerializer', () => {
    let serializer: LowerCaseCultureUrlSerializer;
    let urlServiceMock: UrlServiceMock;

    beforeEach(() => {
        urlServiceMock = MockContext.useMock(UrlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LowerCaseCultureUrlSerializer],
        });

        urlServiceMock.culturePattern = '^/?(en|en-ca|en-xll)(/|\\?|$)';

        serializer = new LowerCaseCultureUrlSerializer(<any>urlServiceMock);
    });

    const shoudModify = [
        { originUrl: '/EN/test', finalUrl: '/en/test' },
        { originUrl: '/EN/', finalUrl: '/en/' },
        { originUrl: '/En/test', finalUrl: '/en/test' },
        { originUrl: '/eN/test', finalUrl: '/en/test' },
        { originUrl: '/en-XLl/test', finalUrl: '/en-xll/test' },
        { originUrl: '/EN-XLL/test', finalUrl: '/en-xll/test' },
        { originUrl: '/eN-xLl/test', finalUrl: '/en-xll/test' },
        { originUrl: '/en-Xll/test', finalUrl: '/en-xll/test' },
        { originUrl: '/en-Ca/test', finalUrl: '/en-ca/test' },
        { originUrl: '/eN-ca/test', finalUrl: '/en-ca/test' },
    ];

    describe('should modify url', () => {
        shoudModify.forEach((c) => runTest(c.originUrl, c.finalUrl));
    });

    const shoudNotModify = [
        { originUrl: '/en', finalUrl: '/en' },
        { originUrl: '/E', finalUrl: '/E' },
        { originUrl: '/en/test', finalUrl: '/en/test' },
        { originUrl: '/en-xll/test', finalUrl: '/en-xll/test' },
        { originUrl: '/en/test', finalUrl: '/en/test' },
        { originUrl: '/aaaa/test', finalUrl: '/aaaa/test' },
        { originUrl: '/e-Xll/test', finalUrl: '/e-Xll/test' },
        { originUrl: '/en-X/test', finalUrl: '/en-X/test' },
        { originUrl: '/EN-pa/test', finalUrl: '/EN-pa/test' },
    ];

    describe('should not modify url', () => {
        shoudNotModify.forEach((c) => runTest(c.originUrl, c.finalUrl));
    });

    it('should not affect route path', () => {
        const tree = serializer.parse('/');

        expect(tree.root.children['primary']?.segments).toBeUndefined();
    });

    function runTest(originUrl: string, finalUrl: string) {
        it(originUrl, () => {
            const tree = serializer.parse(originUrl);

            const normalizedUrl = '/' + tree.root.children['primary']?.segments.map((s) => s.path).join('/');
            expect(normalizedUrl).toEqual(finalUrl);
        });
    }
});
