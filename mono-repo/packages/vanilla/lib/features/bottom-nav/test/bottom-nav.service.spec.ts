import { MockContext } from 'moxxi';

import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { BottomNavService } from '../src/bottom-nav.service';
import { BottomNavConfigMock } from './bottom-nav-config.mock';
import { MenuItemHighlightServiceMock } from './menu-highlight-service.mock';

describe('BottomNavService', () => {
    let service: BottomNavService;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let dslServiceMock: DslServiceMock;
    let bottomNavConfigMock: BottomNavConfigMock;
    let eventSpy: jasmine.Spy;
    let navService: NavigationServiceMock;
    let menuItemHighlightServiceMock: MenuItemHighlightServiceMock;

    beforeEach(() => {
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        bottomNavConfigMock = MockContext.useMock(BottomNavConfigMock);
        menuItemHighlightServiceMock = MockContext.useMock(MenuItemHighlightServiceMock);
        MockContext.useMock(PageMock);
        MockContext.useMock(UrlServiceMock);
        navService = MockContext.useMock(NavigationServiceMock);

        service = new BottomNavService(
            <any>menuItemsServiceMock,
            <any>bottomNavConfigMock,
            <any>dslServiceMock,
            <any>navService,
            <any>menuItemHighlightServiceMock,
        );

        eventSpy = jasmine.createSpy();
        service.inputEvents.subscribe(eventSpy);
    });

    describe('show()', () => {
        it('should send show parameters', () => {
            service.show();

            expect(eventSpy).toHaveBeenCalledWith({ state: 'show' });
        });
    });

    describe('hide()', () => {
        it('should send enable parameters', () => {
            service.hide();

            expect(eventSpy).toHaveBeenCalledWith({ state: 'hide' });
        });
    });

    describe('setItemCounter()', () => {
        it('should set item counter', () => {
            service.setItemCounter('home', 5, 'red');

            expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('BottomNav', 'home', 5, 'red');
        });
    });

    describe('Highlight manuitem with highlight service', () => {
        it('should set active item', () => {
            menuItemHighlightServiceMock.setActiveItem('BottomNav', 'home');

            expect(menuItemHighlightServiceMock.setActiveItem).toHaveBeenCalledWith('BottomNav', 'home');
        });
    });

    describe('setActiveItem()', () => {
        it('should set active item', () => {
            service.setActiveItem('home');

            expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith('BottomNav', 'home');
        });
    });

    describe('isEnabled()', () => {
        it('should return enablement status', () => {
            bottomNavConfigMock.isEnabledCondition = 'condition';
            service.isEnabled();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('condition');
        });
    });
});
