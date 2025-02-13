import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { LanguageSwitcherMenuComponent } from '../src/language-switcher-menu.component';
import { LanguageSwitcherMenuData } from '../src/language-switcher.models';
import { LANGUAGE_SWITCHER_MENU_DATA } from '../src/language-switcher.tokens';
import { LanguageSwitcherServiceMock, LanguageSwitcherTrackingServiceMock } from './language-switcher.mock';

describe('LanguageSwitcherMenuComponent', () => {
    let fixture: ComponentFixture<LanguageSwitcherMenuComponent>;
    let languageSwitcherServiceMock: LanguageSwitcherServiceMock;
    let pageMock: PageMock;
    let trackingServiceMock: LanguageSwitcherTrackingServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let overlayRefMock: OverlayRefMock;
    const languages = <any>[{ routeValue: 'en' }];
    let data: LanguageSwitcherMenuData;
    let nativeAppServiceMock: NativeAppServiceMock;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        data = { openedByLanguageSelector: false };
        languageSwitcherServiceMock = MockContext.useMock(LanguageSwitcherServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        pageMock = MockContext.useMock(PageMock);
        trackingServiceMock = MockContext.useMock(LanguageSwitcherTrackingServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(DslServiceMock);
        MockContext.useMock(CommonMessagesMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, { provide: LANGUAGE_SWITCHER_MENU_DATA, useValue: data }],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(LanguageSwitcherMenuComponent);

        fixture.detectChanges();

        languageSwitcherServiceMock.getLanguageSwitcherData.next(languages);
    }

    describe('init', () => {
        it('should init correctly', () => {
            initComponent();

            expect(fixture.componentInstance.languages).toBe(languages);
        });
    });

    describe('close()', () => {
        it('should close the overlay', () => {
            initComponent();

            fixture.componentInstance.close();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('change()', () => {
        it('should track and redirect', fakeAsync(() => {
            pageMock.lang = 'es';
            initComponent();

            fixture.componentInstance.change(<any>{ url: 'https://bwin.com', routeValue: 'de', culture: 'de-AT' });

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: 'LanguageUpdated',
                parameters: { newLanguage: 'de-AT', routeValue: 'de' },
            });

            expect(trackingServiceMock.trackChangeLanguage).toHaveBeenCalledWith(false, 'es', 'de');

            trackingServiceMock.trackChangeLanguage.resolve();
            tick();
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('https://bwin.com');
        }));
    });

    describe('gridRows', () => {
        it('should be a number > 3', () => {
            initComponent();

            expect((deviceServiceMock.isMobile = true)).toBeBoolean();
            expect((deviceServiceMock.isTablet = true)).toBeBoolean();

            expect(fixture.componentInstance.gridRows).toBeNumber();
            expect(fixture.componentInstance.gridRows > 3).toBeTrue();
        });
    });
});
