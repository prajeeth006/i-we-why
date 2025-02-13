import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { BottomNavBootstrapService } from '../src/bottom-nav-bootstrap.service';
import { BottomNavComponent } from '../src/bottom-nav.component';
import { BottomNavConfigMock } from './bottom-nav-config.mock';
import { BottomNavServiceMock } from './bottom-nav.mock';
import { CoreBottomNavServiceMock } from './core-bottom-nav.mock';

describe('BottomNavBootstrapService', () => {
    let service: BottomNavBootstrapService;
    let config: BottomNavConfigMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let coreBottomNavServiceMock: CoreBottomNavServiceMock;
    let bottomNavServiceMock: BottomNavServiceMock;

    beforeEach(() => {
        config = MockContext.useMock(BottomNavConfigMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        coreBottomNavServiceMock = MockContext.useMock(CoreBottomNavServiceMock);
        bottomNavServiceMock = MockContext.useMock(BottomNavServiceMock);

        navigationServiceMock.location.url.and.returnValue('/en');

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BottomNavBootstrapService],
        });

        service = TestBed.inject(BottomNavBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should set service and component', fakeAsync(() => {
            service.onFeatureInit();
            config.whenReady.next();

            tick();

            expect(coreBottomNavServiceMock.set).toHaveBeenCalledWith(bottomNavServiceMock);
            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledWith('app', BottomNavComponent, null);
        }));

        it('should NOT set active item if route is NOT `/menu`', fakeAsync(() => {
            service.onFeatureInit();
            config.whenReady.next();

            tick();

            expect(menuItemsServiceMock.setActive).not.toHaveBeenCalled();
        }));

        it('should set active item if route is `/menu`', fakeAsync(() => {
            navigationServiceMock.location.url.and.returnValue('/menu');

            service.onFeatureInit();
            config.whenReady.next();

            tick();

            expect(bottomNavServiceMock.setHighlightedProduct).toHaveBeenCalled();
        }));

        it('should set active item on navigation change', fakeAsync(() => {
            service.onFeatureInit();
            config.whenReady.next();

            tick();

            navigationServiceMock.locationChange.next({ id: 1, previousUrl: '/en', nextUrl: '/en/menu' });

            tick();

            expect(bottomNavServiceMock.setHighlightedProduct).toHaveBeenCalled();
        }));
    });
});
