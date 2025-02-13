import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMenuComponent, AccountMenuRouter } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { AccountMenuRouterMock } from './account-menu-router.mock';
import { PublicAccountMenuServiceMock as AccountMenuServiceMock } from './account-menu.mock';
import { AccountMenuConfigMock } from './menu-content.mock';

class Cmp {}

describe('AccountMenuComponent', () => {
    let fixture: ComponentFixture<AccountMenuComponent>;
    let accountMenuServiceMock: AccountMenuServiceMock;
    let accountMenuRouterMock: AccountMenuRouterMock;
    let route: string;

    beforeEach(() => {
        MockContext.useMock(AccountMenuConfigMock);
        accountMenuServiceMock = MockContext.useMock(AccountMenuServiceMock);
        accountMenuRouterMock = MockContext.createMock(AccountMenuRouterMock);

        TestBed.overrideComponent(AccountMenuComponent, {
            set: {
                imports: [],
                providers: [{ provide: AccountMenuRouter, useValue: accountMenuRouterMock }, MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(AccountMenuComponent);
        fixture.componentInstance.route = route;

        fixture.componentInstance.ngOnInit();
        fixture.componentInstance.ngOnChanges();
    }

    it('should set route', () => {
        route = 'menu/route';

        initComponent();
        accountMenuRouterMock.routerInitialized.next(true);

        const content: any = { name: 'x' };

        expect(accountMenuRouterMock.setRoute).toHaveBeenCalledWith('menu/route');
        accountMenuRouterMock.currentRoute.next(<any>{ item: content });
        expect(fixture.componentInstance.content).toBe(content);
    });

    it('should set route on changes', () => {
        route = 'menu/route';

        initComponent();

        fixture.componentInstance.route = 'menu/route2';
        fixture.componentInstance.ngOnChanges();
        accountMenuRouterMock.routerInitialized.next(true);

        expect(accountMenuRouterMock.setRoute).toHaveBeenCalledWith('menu/route2');
    });

    describe('getItemComponent()', () => {
        it('should get template for item type', () => {
            accountMenuServiceMock.getAccountMenuComponent.withArgs('type').and.returnValue(Cmp);

            initComponent();

            expect(fixture.componentInstance.getItemComponent('type')).toBe(Cmp);
        });
    });
});
