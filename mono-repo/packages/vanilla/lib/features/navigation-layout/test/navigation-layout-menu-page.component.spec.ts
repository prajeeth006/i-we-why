import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { RouteDataServiceMock } from '../../../core/test/routing/route-data.mock';
import { NavigationLayoutMenuPageComponent } from '../src/navigation-layout-menu-page.component';
import { NavigationLayoutServiceMock } from './navigation-layout.mocks';

describe('NavigationLayoutMenuPageComponent', () => {
    let fixture: ComponentFixture<NavigationLayoutMenuPageComponent>;
    let component: NavigationLayoutMenuPageComponent;
    let navigationServiceMock: NavigationServiceMock;
    let routeDataService: RouteDataServiceMock;
    let observableMediaMock: MediaQueryServiceMock;
    let routeDataMock: any;
    let navigationLayoutServiceMock: NavigationLayoutServiceMock;
    let activatedRouteMock: ActivatedRouteMock;

    beforeEach(() => {
        routeDataMock = getRouteDataMock();
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        routeDataService = MockContext.useMock(RouteDataServiceMock);
        observableMediaMock = MockContext.useMock(MediaQueryServiceMock);
        navigationLayoutServiceMock = MockContext.useMock(NavigationLayoutServiceMock);
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);

        TestBed.overrideComponent(NavigationLayoutMenuPageComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        routeDataService.get.and.returnValue(routeDataMock);
        navigationLayoutServiceMock.getItem.and.returnValue({});
        activatedRouteMock.snapshot.params['itemName'] = 'settings';
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    function initComponent() {
        fixture = TestBed.createComponent(NavigationLayoutMenuPageComponent);
        component = fixture.componentInstance;
        navigationLayoutServiceMock.initialized.next(true);
    }

    it('should create component successfully, properties and functions are defined', () => {
        initComponent();
        expect(component.ngOnInit).toBeDefined();
        expect(component.ngOnDestroy).toBeDefined();
    });

    it('should redirect to first menu item on init when mediaQuery != xs and no mediachange event emitted', () => {
        navigationLayoutServiceMock.getItem.and.returnValue({ leftMenuItems: [{ url: 'url' }] });
        observableMediaMock.isActive.withArgs('xs').and.returnValue(false);
        observableMediaMock.isActive.withArgs('gt-xs').and.returnValue(true);
        initComponent();
        component.ngOnInit();
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('url');
    });

    it('should redirect to first menu item on mediaQuery != xs', () => {
        navigationLayoutServiceMock.getItem.and.returnValue({ leftMenuItems: [{ url: 'url' }] });
        initComponent();
        component.ngOnInit();

        observableMediaMock.isActive.withArgs('xs').and.returnValue(false);
        observableMediaMock.isActive.withArgs('gt-xs').and.returnValue(true);
        observableMediaMock.observe.next();
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('url');
    });

    it('should not redirect to first menu item on mediaQuery == xs', () => {
        initComponent();
        component.ngOnInit();

        observableMediaMock.isActive.withArgs('xs').and.returnValue(true);
        observableMediaMock.isActive.withArgs('gt-xs').and.returnValue(false);
        observableMediaMock.observe.next();
        expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
    });

    function getRouteDataMock() {
        return {
            settingsMenuItems: {
                items: [{ url: 'firstUrl' }],
            },
        };
    }
});
