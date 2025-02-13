import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { LanguageSwitcherBootstrapService } from '../src/language-switcher-bootstrap.service';
import { LanguageSwitcherConfigMock, LanguageSwitcherOverlayServiceMock } from './language-switcher.mock';

describe('LanguageSwitcherBootstrapService', () => {
    let service: LanguageSwitcherBootstrapService;
    let cookieServiceMock: CookieServiceMock;
    let languageSwitcherOverlayServiceMock: LanguageSwitcherOverlayServiceMock;
    let languageSwitcherConfigMock: LanguageSwitcherConfigMock;
    let dslServiceMock: DslServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        languageSwitcherOverlayServiceMock = MockContext.useMock(LanguageSwitcherOverlayServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        languageSwitcherConfigMock = MockContext.useMock(LanguageSwitcherConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LanguageSwitcherBootstrapService],
        });

        service = TestBed.inject(LanguageSwitcherBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should not show language switcher', fakeAsync(() => {
            service.onFeatureInit(); // act
            languageSwitcherConfigMock.whenReady.next();
            tick();
            dslServiceMock.evaluateExpression.completeWith(false);

            expect(menuActionsServiceMock.register).toHaveBeenCalledWith('toggleLanguageSwitcher', jasmine.anything());
            expect(languageSwitcherOverlayServiceMock.openMenu).not.toHaveBeenCalled();
            expect(cookieServiceMock.remove).not.toHaveBeenCalledWith('unsupportedBrowserLanguage');
        }));

        it('should shown language switcher', fakeAsync(() => {
            service.onFeatureInit(); // act
            languageSwitcherConfigMock.whenReady.next();
            tick();
            dslServiceMock.evaluateExpression.completeWith(true);

            expect(languageSwitcherOverlayServiceMock.openMenu).toHaveBeenCalled();
            expect(cookieServiceMock.remove).toHaveBeenCalledWith('unsupportedBrowserLanguage');
        }));
    });
});
