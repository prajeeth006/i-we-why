import { TestBed } from '@angular/core/testing';

import { ParsedUrl, UrlService } from '@frontend/vanilla/core';
import { Mock, MockContext, StubObservable } from 'moxxi';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { FlagsServiceMock } from '../../user-flags/test/flags.mock';
import { LANGUAGE_SWITCHER_URLS_PROVIDER, LanguageSwitcherUrlsProvider } from '../src/language-switcher-urls-provider';
import { LanguageSwitcherService } from '../src/language-switcher.service';
import { LanguageSwitcherConfigMock } from './language-switcher.mock';

@Mock({ of: LANGUAGE_SWITCHER_URLS_PROVIDER })
export class LanguageSwitcherUrlsProviderMock implements LanguageSwitcherUrlsProvider {
    @StubObservable() getUrls: jasmine.ObservableSpy;
}

describe('LanguageSwitcherService', () => {
    let service: LanguageSwitcherService;
    let navigationServiceMock: NavigationServiceMock;
    let flagsServiceMock: FlagsServiceMock;
    let languageSwitcherUrlsProviderMock: LanguageSwitcherUrlsProviderMock;
    let dslServiceMock: DslServiceMock;
    let map: Map<string, string>;
    let url: ParsedUrl;
    let spy: jasmine.Spy;
    let configMock: LanguageSwitcherConfigMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        flagsServiceMock = MockContext.useMock(FlagsServiceMock);
        languageSwitcherUrlsProviderMock = MockContext.createMock(LanguageSwitcherUrlsProviderMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        configMock = MockContext.useMock(LanguageSwitcherConfigMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                UrlService,
                LanguageSwitcherService,
                UrlService,
                { provide: LANGUAGE_SWITCHER_URLS_PROVIDER, useValue: languageSwitcherUrlsProviderMock },
            ],
        });

        url = TestBed.inject(UrlService).parse('http://bwin.com/en/page');
        navigationServiceMock.location.absUrl.and.returnValue('http://bwin.com/en/page');
        navigationServiceMock.location.clone.and.returnValue(url);
        map = new Map([
            ['en', 'eurl'],
            ['de', 'durl'],
        ]);
        spy = jasmine.createSpy();

        service = TestBed.inject(LanguageSwitcherService);
    });

    it('should get data for language switcher', () => {
        service.getLanguageSwitcherData().subscribe(spy);
        configMock.whenReady.next();

        expect(languageSwitcherUrlsProviderMock.getUrls).toHaveBeenCalledWith(url, ['en', 'de']);

        flagsServiceMock.available.next({ en: 'http://www.google.com' });
        languageSwitcherUrlsProviderMock.getUrls.next(map);

        expect(spy).toHaveBeenCalled();
        const languages = spy.calls.mostRecent().args[0];

        expect(languages[0].url).toBe('eurl');
        expect(languages[0].routeValue).toBe('en');
        expect(languages[0].nativeName).toBe('English');
        expect(languages[0].isActive).toBeTrue();
        expect(languages[1].url).toBe('durl');
        expect(languages[1].isActive).toBeFalse();
        expect(languages[0].culture).toBe('en-US');
    });

    it('should cache data until url changes', () => {
        service.getLanguageSwitcherData().subscribe();
        configMock.whenReady.next();
        expect(languageSwitcherUrlsProviderMock.getUrls).toHaveBeenCalledTimes(1);
        languageSwitcherUrlsProviderMock.getUrls.calls.reset();
        service.getLanguageSwitcherData().subscribe();
        expect(languageSwitcherUrlsProviderMock.getUrls).toHaveBeenCalledTimes(0);
        service.getLanguageSwitcherData().subscribe();
        expect(languageSwitcherUrlsProviderMock.getUrls).toHaveBeenCalledTimes(0);
    });

    it('should throw when url for a language is missing', () => {
        service.getLanguageSwitcherData().subscribe({ error: spy });
        map = new Map([['en', 'eurl']]);
        configMock.whenReady.next();
        languageSwitcherUrlsProviderMock.getUrls.next(map);

        expect(spy).toHaveBeenCalled();
    });

    it('showHeader', () => {
        expect(service.headerEnabled()).toBeFalse();

        configMock.whenReady.next();
        dslServiceMock.evaluateExpression.completeWith(true);

        expect(service.headerEnabled()).toBeTrue();
    });
});
