import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MenuSection } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuItemsServiceMock } from '../../../account-menu/test/menu-items.mock';
import { NavigationPillService } from '../../src/navigation-pill/navigation-pill.service';

describe('NavigationPillService', () => {
    let service: NavigationPillService;
    let menuItemsServiceMock: MenuItemsServiceMock;

    beforeEach(() => {
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, NavigationPillService],
        });

        service = TestBed.inject(NavigationPillService);
    });

    describe('setBadgeCounter', () => {
        it('should counter', () => {
            service.setBadgeCounter('live', 2, 'red');

            expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith(MenuSection.HeaderPills, 'live', 2, 'red');
        });
    });

    describe('resetActiveItem', () => {
        it('should reset navigation and filter pills', fakeAsync(() => {
            const navigationPillSpy = jasmine.createSpy();
            const filterPillSpy = jasmine.createSpy();

            service.activeNavigationPill.subscribe(navigationPillSpy);
            service.activeFilterPill.subscribe(filterPillSpy);

            service.resetActiveItem();
            tick();

            expect(navigationPillSpy).toHaveBeenCalledWith(null);
            expect(filterPillSpy).toHaveBeenCalledWith(null);
        }));
    });

    describe('setActiveItem', () => {
        it('should set navigation pill active', fakeAsync(() => {
            const { item, navigationPillSpy, filterPillSpy } = setActiveItem('selectNavigationPill');

            expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith(MenuSection.HeaderPills, item.name);
            expect(navigationPillSpy).toHaveBeenCalledWith(item);
            expect(filterPillSpy).not.toHaveBeenCalled();
        }));

        it('should set filter pill active', fakeAsync(() => {
            const { item, navigationPillSpy, filterPillSpy } = setActiveItem('selectFilterPill');

            expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith(MenuSection.HeaderPills, item.name);
            expect(filterPillSpy).toHaveBeenCalledWith(item);
            expect(navigationPillSpy).not.toHaveBeenCalled();
        }));

        it('should toggle if already active', fakeAsync(() => {
            menuItemsServiceMock.isActive.and.returnValue(true);

            const { filterPillSpy } = setActiveItem('selectFilterPill');

            expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith(MenuSection.HeaderPills, null);
            expect(filterPillSpy).toHaveBeenCalledWith(null);
        }));
    });

    function setActiveItem(clickAction: string) {
        const navigationPillSpy = jasmine.createSpy();
        const filterPillSpy = jasmine.createSpy();

        service.activeNavigationPill.subscribe(navigationPillSpy);
        service.activeFilterPill.subscribe(filterPillSpy);

        const item: any = { name: 'Live', clickAction };

        service.setActiveItem(item);
        tick();

        return { item, navigationPillSpy, filterPillSpy };
    }
});
