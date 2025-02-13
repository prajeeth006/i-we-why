import { TestBed } from '@angular/core/testing';

import { ParsedUrl, UrlService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DefaultLanguageSwitcherUrlsProvider } from '../src/default-language-switcher-urls-provider';

describe('DefaultLanguageSwitcherUrlsProvider', () => {
    let provider: DefaultLanguageSwitcherUrlsProvider;
    let url: ParsedUrl;
    let spy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers, DefaultLanguageSwitcherUrlsProvider, UrlService],
        });

        spy = jasmine.createSpy();
        url = TestBed.inject(UrlService).parse('http://bwin.com/en/page');
        provider = TestBed.inject(DefaultLanguageSwitcherUrlsProvider);
    });

    it('should get data for language switcher', () => {
        provider.getUrls(url, ['en', 'de']).subscribe(spy);

        const urls = spy.calls.mostRecent().args[0];

        expect(urls.get('en')).toBe('/en/page');
        expect(urls.get('de')).toBe('/de/page');
    });
});
