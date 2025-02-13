import { Page } from '@frontend/vanilla/core';

import { localeFactory } from '../../src/languages/languages.feature';

describe('localeFactory', () => {
    let page: Page;

    beforeEach(() => {
        page = new Page();
        page.locale = 'en';
        page.browserPreferredCulture = 'en-GB';
    });

    it('localeFactory should return browser language if enabled', () => {
        page.useBrowserLanguage = true;
        expect(localeFactory(page)).toBe('en-GB');
    });

    it('localeFactory should return dynacon locale if browser language disabled', () => {
        expect(localeFactory(page)).toBe('en');
    });

    it('localeFactory should return dynacon locale if browser language is empty', () => {
        page.browserPreferredCulture = '';
        expect(localeFactory(page)).toBe('en');
    });
});
