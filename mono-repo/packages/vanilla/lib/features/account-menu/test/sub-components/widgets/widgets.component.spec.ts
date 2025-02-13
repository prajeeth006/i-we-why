import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DslServiceMock } from '../../../../../core/test/dsl/dsl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { AccountMenuWidgetsComponent } from '../../../src/sub-components/widgets/widgets.component';
import { AccountMenuDataServiceMock } from '../../account-menu-data.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuTrackingServiceMock } from '../../account-menu-tracking.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('AccountMenuWidgetsComponent', () => {
    let fixture: ComponentFixture<AccountMenuWidgetsComponent>;
    let component: AccountMenuWidgetsComponent;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let dslServiceMock: DslServiceMock;
    const items = [<any>{ name: 'item1', parameters: { order: '2' } }, <any>{ name: 'item2', parameters: { order: '1' } }];
    const expectedResult = [<any>{ name: 'item2', parameters: { order: '1' } }, <any>{ name: 'item1', parameters: { order: '2' } }];

    beforeEach(() => {
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);
        MockContext.useMock(AccountMenuTrackingServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.overrideComponent(AccountMenuWidgetsComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
            },
        });

        accountMenuDataServiceMock.routerMode = true;

        fixture = TestBed.createComponent(AccountMenuWidgetsComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {},
            resources: {},
            children: [{ name: 'item1' }, { name: 'item2' }],
        };

        fixture.detectChanges();
    });

    describe('init', () => {
        it('set showWidgets', () => {
            expect(component.showWidgets).toBeTrue();
            expect(dslServiceMock.evaluateContent).toHaveBeenCalledWith([{ name: 'item1' }, { name: 'item2' }]);

            accountMenuDataServiceMock.routerMode = false;
            component.ngOnInit();

            expect(component.showWidgets).toBeFalse();

            component.mode = 'page';
            component.ngOnInit();

            expect(component.showWidgets).toBeTrue();
        });

        it('set items', () => {
            dslServiceMock.evaluateContent.next(items);
            expect(component.items).toEqual(expectedResult);
        });

        it('refresh items', () => {
            component.items = items;
            accountMenuDataServiceMock.widgetUpdate.next();

            expect(component.items).toEqual(expectedResult);
        });
    });
});
