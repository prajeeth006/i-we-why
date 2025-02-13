import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SeoLanguageLinksComponent } from '../src/seo-language-links.component';
import { LanguageSwitcherServiceMock } from './language-switcher.mock';

describe('SeoLanguageLinksComponent', () => {
    let fixture: ComponentFixture<SeoLanguageLinksComponent>;
    let languageSwitcherServiceMock: LanguageSwitcherServiceMock;
    const languages = <any>[{ routeValue: 'en' }];

    beforeEach(() => {
        languageSwitcherServiceMock = MockContext.useMock(LanguageSwitcherServiceMock);

        TestBed.overrideComponent(SeoLanguageLinksComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(SeoLanguageLinksComponent);

        fixture.detectChanges();

        languageSwitcherServiceMock.getLanguageSwitcherData.next(languages);
    }

    describe('init', () => {
        it('should init correctly', () => {
            initComponent();

            expect(fixture.componentInstance.languages).toBe(languages);
        });
    });
});
