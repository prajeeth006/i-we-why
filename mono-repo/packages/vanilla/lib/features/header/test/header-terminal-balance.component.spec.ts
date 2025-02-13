import { AsyncPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CurrencyPipe, MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Observable, Subject } from 'rxjs';

import { SessionStoreServiceMock } from '../../../core/src/browser/store/test/session-store.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { TerminalBalanceComponent } from '../src/terminal-balance/terminal-balance.component';
import { HeaderConfigMock } from './header.mock';

describe('TerminalBalanceComponent', () => {
    let fixture: ComponentFixture<TerminalBalanceComponent>;
    let component: TerminalBalanceComponent;
    let headerContentMock: HeaderConfigMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let dslServiceMock: DslServiceMock;
    let sessionStoreServiceMock: SessionStoreServiceMock;
    let item: MenuContentItem;

    beforeEach(() => {
        headerContentMock = MockContext.useMock(HeaderConfigMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        sessionStoreServiceMock = MockContext.useMock(SessionStoreServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(IntlServiceMock);

        TestBed.overrideComponent(TerminalBalanceComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [CurrencyPipe, AsyncPipe],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        item = { name: 'x', parameters: {} } as any;
        headerContentMock.elements.authItems = { parameters: {} } as any;

        fixture = TestBed.createComponent(TerminalBalanceComponent);
        component = fixture.componentInstance;
        component.item = item;
    });

    describe('init', () => {
        it('should setup properties', () => {
            expect(component.showVisibilityToggle).toBeFalsy();
            expect(component.isBalanceVisible).toBeFalsy();
            expect(sessionStoreServiceMock.set).not.toHaveBeenCalled();
        });

        it('should set local storage entry if visibility toggle is enabled', () => {
            item.parameters = {
                'balance-visible': 'false',
                'visibility-toggle': 'true',
            };
            sessionStoreServiceMock.get.and.returnValue(null);

            fixture.detectChanges();

            expect(sessionStoreServiceMock.set).toHaveBeenCalledWith('isBalanceVisible', false);
        });

        it('should setup parameters', () => {
            item.name = 'terminal-balance';
            item.parameters = {
                'balance-formula': 'f',
                'balance': 'b',
                'balance-visible': 'false',
                'visibility-toggle': 'true',
            };
            sessionStoreServiceMock.get.and.returnValue(true);

            const balanceSubject: Observable<number> = new Subject();
            dslServiceMock.evaluateExpression.withArgs('b').and.returnValue(balanceSubject);

            fixture.detectChanges();

            expect(component.balance).toBe(balanceSubject);
            expect(component.showVisibilityToggle).toBeTrue();
            expect(component.isBalanceVisible).toBeTrue();
        });
    });

    describe('processClick()', () => {
        beforeEach(() => {
            item.parameters = {
                'visibility-toggle': 'true',
                'balance-refresh-timeout': '5000',
            };

            fixture.detectChanges();
        });

        it('should toggle balance visibility and set entry in local store', () => {
            component.processClick();

            expect(menuActionsServiceMock.processClick).not.toHaveBeenCalled();
            expect(component.isBalanceVisible).toBeTrue();
            expect(sessionStoreServiceMock.get).toHaveBeenCalledWith('isBalanceVisible');
            expect(sessionStoreServiceMock.set).toHaveBeenCalledWith('isBalanceVisible', true);
        });

        it('should refresh balance if visible', () => {
            component.processClick();

            expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
        });

        it('should not refresh balance if not visible', () => {
            sessionStoreServiceMock.get.and.returnValue(true);

            component.processClick();

            expect(balancePropertiesServiceMock.refresh).not.toHaveBeenCalled();
        });

        it('should not refresh balance if refreshed recently', () => {
            component.processClick();
            component.processClick();
            component.processClick();

            expect(balancePropertiesServiceMock.refresh).toHaveBeenCalledTimes(1);
        });

        it('should refresh balance after the timeout', fakeAsync(() => {
            component.processClick();
            expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();

            component.processClick();
            tick(6000);
            expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
        }));
    });
});
