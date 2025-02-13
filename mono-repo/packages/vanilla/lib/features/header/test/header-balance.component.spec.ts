import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { FakeCurrencyPipe2 } from '../../../core/test/intl/intl.mock';
import { FakeSolvePipe2 } from '../../../core/test/math/arithmetic.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { BalanceComponent } from '../src/balance/balance.component';
import { HeaderConfigMock, HeaderServiceMock } from './header.mock';

describe('BalanceComponent', () => {
    let fixture: ComponentFixture<BalanceComponent>;
    let component: BalanceComponent;
    let headerContentMock: HeaderConfigMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let dslServiceMock: DslServiceMock;
    let headerServiceMock: HeaderServiceMock;
    let item: MenuContentItem;

    beforeEach(() => {
        headerContentMock = MockContext.useMock(HeaderConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        headerServiceMock = MockContext.useMock(HeaderServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(BalancePropertiesServiceMock);

        TestBed.overrideComponent(BalanceComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [FakeCurrencyPipe2, FakeSolvePipe2],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        item = { name: 'x', parameters: {} } as any;

        headerContentMock.elements.authItems = { parameters: {} } as any;

        fixture = TestBed.createComponent(BalanceComponent);
        component = fixture.componentInstance;
        component.item = item;
    });

    describe('ngOnInit', () => {
        it('should setup parameters', () => {
            item.name = 'balance';
            item.parameters = { 'balance-formula': 'f', 'balance': 'b', 'show-arrow': 'true', 'arrow-class': 'ac' };

            headerServiceMock.balance.set(100);
            fixture.detectChanges();

            expect(component.balanceFormula).toBeUndefined();
            expect(component.showArrow).toBeTrue();
            expect(component.arrowClass).toBe('ac');
        });

        it('should setup parameters legacy', () => {
            item.name = 'balance';
            item.parameters = { 'balance-formula': 'f' };

            dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(of(100));
            fixture.detectChanges();

            expect(component.balanceFormula).toBe('f');
        });
    });

    describe('processClick', () => {
        it('should open account menu on balance route', () => {
            const event = new Event('click');

            component.processClick(event);

            expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'Header');
        });
    });
});
