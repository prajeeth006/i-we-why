import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveLanguageSwitcherComponent } from '@frontend/vanilla/features/language-switcher';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { FlagsServiceMock } from '../../user-flags/test/flags.mock';
import { LanguageItemComponent } from '../src/language-item.component';
import { SeoLanguageLinksComponent } from '../src/seo-language-links.component';
import { LanguageSwitcherConfigMock, LanguageSwitcherOverlayServiceMock, LanguageSwitcherTrackingServiceMock } from './language-switcher.mock';

describe('ResponsiveLanguageSwitcherComponent', () => {
    let fixture: ComponentFixture<ResponsiveLanguageSwitcherComponent>;
    let pageMock: PageMock;
    let flagsServiceMock: FlagsServiceMock;
    let languageSwitcherOverlayServiceMock: LanguageSwitcherOverlayServiceMock;
    let trackingServiceMock: LanguageSwitcherTrackingServiceMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        flagsServiceMock = MockContext.useMock(FlagsServiceMock);
        languageSwitcherOverlayServiceMock = MockContext.useMock(LanguageSwitcherOverlayServiceMock);
        trackingServiceMock = MockContext.useMock(LanguageSwitcherTrackingServiceMock);
        MockContext.useMock(LanguageSwitcherConfigMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(DeviceServiceMock);

        TestBed.overrideComponent(ResponsiveLanguageSwitcherComponent, {
            set: {
                imports: [SeoLanguageLinksComponent, LanguageItemComponent],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(ResponsiveLanguageSwitcherComponent);
        fixture.detectChanges();
    }

    it('should init correctly', () => {
        initComponent();
        flagsServiceMock.find.completeWith('www.pics.com');
        expect(fixture.componentInstance.currentLanguage.routeValue).toBe(pageMock.uiLanguages[0]!.routeValue);
        expect(fixture.componentInstance.currentLanguage.image).toBe('www.pics.com');
    });

    describe('openMenu', () => {
        it('should create an overlay', () => {
            initComponent();

            fixture.componentInstance.openMenu();

            expect(trackingServiceMock.trackOpenLanguageSwitcherMenu).toHaveBeenCalled();
            expect(languageSwitcherOverlayServiceMock.openMenu).toHaveBeenCalled();
        });
    });
});
