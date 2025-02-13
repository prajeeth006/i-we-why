import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { QuerySearchParams, SwipeDirection, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock } from '../../../../../core/test/navigation/navigation.mock';
import { WebWorkerServiceMock } from '../../../../../core/test/web-worker/web-worker.service.mock';
import { AccountMenuTasksComponent } from '../../../src/sub-components/tasks/tasks.component';
import { AccountMenuDataServiceMock, AccountMenuTasksServiceMock } from '../../account-menu-data.mock';
import { AccountMenuDrawerServiceMock } from '../../account-menu-drawer.service.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuTrackingServiceMock } from '../../account-menu-tracking.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('AccountMenuTasksComponent', () => {
    let fixture: ComponentFixture<AccountMenuTasksComponent>;
    let component: AccountMenuTasksComponent;
    let accountMenuTasksServiceMock: AccountMenuTasksServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let accountMenuDrawerServiceMock: AccountMenuDrawerServiceMock;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        accountMenuTasksServiceMock = MockContext.useMock(AccountMenuTasksServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        accountMenuDrawerServiceMock = MockContext.useMock(AccountMenuDrawerServiceMock);
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(AccountMenuTasksComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(AccountMenuTasksComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {},
            resources: {},
            children: [{ name: 'item1' }, { name: 'item2' }],
        };
        navigationServiceMock.location.search = new QuerySearchParams('expandtasks=1');

        fixture.detectChanges();
    });

    describe('constructor', () => {
        it('should set expanded', fakeAsync(() => {
            const items = [<any>{ name: 'item1' }, <any>{ name: 'item2' }];
            accountMenuTasksServiceMock.displayItems.next(items);

            expect(component.items).toBe(items);
            expect(component.count).toBe(items.length);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.AccountMenuTasksTimeout,
                { timeout: 100 },
                jasmine.any(Function),
            );

            tick(100);

            expect(component.urgentCount).toBe(0);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.AccountMenuTasksTimeout);

            discardPeriodicTasks();
        }));

        it('should set template', () => {
            accountMenuDataServiceMock.routerMode = true;

            expect(component.template).toBe('menu-mobile');
        });
    });

    describe('ngOnInit', () => {
        it('should trackTasksLoaded', fakeAsync(() => {
            const items = [<any>{ name: 'item1' }, <any>{ name: 'item2' }];
            accountMenuTasksServiceMock.displayItems.next(items);
            tick(1000);

            expect(accountMenuTrackingServiceMock.trackTasksLoaded).toHaveBeenCalledOnceWith(items);
        }));
    });

    describe('toggle', () => {
        it('should work', () => {
            accountMenuDataServiceMock.routerMode = true;
            expect(accountMenuTasksServiceMock.expanded).toBeTrue();
            component.toggle();
            expect(accountMenuTasksServiceMock.expanded).toBeFalse();
            expect(accountMenuDrawerServiceMock.minimizeDrawer).toHaveBeenCalled();
        });
    });

    describe('collapse', () => {
        it('should reset drawer position', () => {
            component.collapse();
            expect(accountMenuTasksServiceMock.expanded).toBeFalse();
            expect(accountMenuDrawerServiceMock.minimizeDrawer).toHaveBeenCalled();
        });
    });

    describe('gotoProfile', () => {
        it('should navigate', () => {
            component.gotoProfile();

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/profile?expandtasks=1');
            expect(accountMenuTrackingServiceMock.trackTaskOpenProfile).toHaveBeenCalled();
        });
    });

    describe('onSwipe', () => {
        it('should hide pending task', () => {
            accountMenuTasksServiceMock.expanded = false;
            component.onSwipe(SwipeDirection.Left);

            expect(accountMenuTasksServiceMock.hide).toHaveBeenCalledOnceWith(component.items);
        });

        it('should collapse', () => {
            component.onSwipe(SwipeDirection.Up);

            expect(accountMenuDrawerServiceMock.minimizeDrawer).toHaveBeenCalled();
        });
    });

    describe('hidePending', () => {
        it('should not invoke hide when expanded', () => {
            expect(accountMenuTasksServiceMock.expanded).toBeTrue();
            component.hidePending();
            expect(accountMenuTasksServiceMock.hide).not.toHaveBeenCalled();
        });

        it('should invoke hide', () => {
            expect(accountMenuTasksServiceMock.expanded).toBeTrue();
            component.toggle();
            component.hidePending();
            expect(accountMenuTasksServiceMock.hide).toHaveBeenCalled();
        });
    });

    describe('showAllHidden', () => {
        it('should work', () => {
            component.showAllHidden(new Event('click'));

            expect(accountMenuTasksServiceMock.expanded).toBeTrue();
            expect(accountMenuTasksServiceMock.showAllHidden).toHaveBeenCalled();
            expect(accountMenuDrawerServiceMock.minimizeDrawer).toHaveBeenCalled();
        });
    });
});
