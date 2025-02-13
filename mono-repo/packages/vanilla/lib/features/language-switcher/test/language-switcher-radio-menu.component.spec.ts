import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { LanguageSwitcherRadioMenuComponent } from '../src/language-switcher-radio-menu.component';
import { LanguageSwitcherItem } from '../src/language-switcher.models';
import { LanguageSwitcherServiceMock, LanguageSwitcherTrackingServiceMock } from './language-switcher.mock';

describe('LanguageSwitcherRadioMenuComponent', () => {
    let fixture: ComponentFixture<LanguageSwitcherRadioMenuComponent>;
    let pageMock: PageMock;
    let languageSwitcherTrackingServiceMock: LanguageSwitcherTrackingServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        languageSwitcherTrackingServiceMock = MockContext.useMock(LanguageSwitcherTrackingServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(LanguageSwitcherServiceMock);
        MockContext.useMock(CommonMessagesMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        fixture = TestBed.createComponent(LanguageSwitcherRadioMenuComponent);

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track display', () => {
            expect(languageSwitcherTrackingServiceMock.trackDisplay).toHaveBeenCalledOnceWith(true);
        });
    });

    describe('change', () => {
        it('should send event to native, track language change and navigate', fakeAsync(() => {
            const lang: LanguageSwitcherItem = {
                culture: 'en',
                routeValue: 'en',
                url: 'https://example.com',
                nativeName: 'English',
                image: null,
                isActive: true,
            };

            fixture.componentInstance.change(lang);

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({
                eventName: NativeEventType.LANGUAGEUPDATED,
                parameters: { newLanguage: lang.culture, routeValue: lang.routeValue },
            });
            expect(languageSwitcherTrackingServiceMock.trackChangeLanguage).toHaveBeenCalledOnceWith(true, pageMock.lang, lang.routeValue);

            languageSwitcherTrackingServiceMock.trackChangeLanguage.resolve();
            tick();

            expect(navigationServiceMock.goTo).toHaveBeenCalledOnceWith(lang.url);
        }));
    });
});
