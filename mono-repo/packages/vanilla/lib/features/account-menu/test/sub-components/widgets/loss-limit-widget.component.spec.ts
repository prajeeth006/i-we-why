import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../../core/src/tracking/test/tracking.mock';
import { IntlServiceMock } from '../../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../../../core/test/user/user.mock';
import { LossLimitWidgetComponent } from '../../../../../features/account-menu/src/sub-components/widgets/loss-limit-widget.component';
import { AccountMenuDataServiceMock } from '../../account-menu-data.mock';
import { AccountMenuResourceServiceMock } from '../../account-menu-resource.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuTrackingServiceMock } from '../../account-menu-tracking.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('LossLimitWidgetComponent', () => {
    let fixture: ComponentFixture<LossLimitWidgetComponent>;
    let component: LossLimitWidgetComponent;
    let accountMenuResourceServiceMock: AccountMenuResourceServiceMock;
    let intlServiceMock: IntlServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        accountMenuResourceServiceMock = MockContext.useMock(AccountMenuResourceServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(LossLimitWidgetComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(LossLimitWidgetComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {
                'order': '2',
                'trigger-reorder-percentage': '80',
            },
            resources: {
                LimitText: '_GLOBAL_LOSS_LIMIT_ _TOTAL_LOSS_LIMIT_',
                MONTHLYTitle: 'MONTHLY _TOTAL_LOSS_LIMIT_',
                YEARLYTitle: 'YEARLY _TOTAL_LOSS_LIMIT_',
                LimitNotReachedText: '_REMAINNING_DEPOSIT_',
                MONTHLYDescription: 'monthly desc',
                YEARLYDescription: 'yearly desc',
                MONTHLYLimitReachedText: 'monthly limit reached',
                YEARLYLimitReachedText: 'yearly limit reached',
            },
            trackEvent: {
                'LoadedEvent.component.PositionEvent': 'test',
            },
            children: [],
            text: 'Monthly',
        };
        intlServiceMock.formatCurrency.withArgs(100).and.returnValue('100 EUR');
        intlServiceMock.formatCurrency.withArgs(75).and.returnValue('75 EUR');
        intlServiceMock.formatCurrency.withArgs(125).and.returnValue('125 EUR');
        intlServiceMock.formatCurrency.withArgs(25).and.returnValue('25 EUR');
        intlServiceMock.formatCurrency.withArgs(0).and.returnValue('0 EUR');
        intlServiceMock.formatDate.and.returnValue('01.01.2012');

        fixture.detectChanges();
    });

    describe('net deposit higher then 0', () => {
        it('monthly not reached limit', () => {
            accountMenuResourceServiceMock.getLossLimit.next({
                totalNetDeposit: 25,
                limitType: 'MONTHLY',
                totalLossLimit: 100,
            });

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'LoadedEvent.component.PositionEvent': 'test',
                },
                'LoadedEvent',
            );
            expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                'component.PositionEvent': 'negative value',
            });
            expect(component.model).toEqual({
                totalLossLimit: 100,
                totalNetDeposit: 25,
                arrowClass: 'arrow-value--down',
                percentageElapsed: 25,
                limitText: '25 EUR 100 EUR',
                remainingDeposit: 75,
                limitReachedText: '',
                limitNotReachedText: '75 EUR',
                description: 'monthly desc',
            });
            expect(component.item.text).toBe('MONTHLY 100 EUR');
            expect(component.hideSkeleton).toBeTrue();
        });

        it('monthly limit reached', () => {
            accountMenuResourceServiceMock.getLossLimit.next({
                totalNetDeposit: 100,
                limitType: 'MONTHLY',
                totalLossLimit: 100,
            });

            expect(component.model).toEqual({
                totalLossLimit: 100,
                totalNetDeposit: 100,
                arrowClass: 'arrow-value--down',
                percentageElapsed: 100,
                limitText: '100 EUR 100 EUR',
                remainingDeposit: 0,
                limitReachedText: 'monthly limit reached',
                limitNotReachedText: '',
                description: 'monthly desc',
            });
        });

        it('yearly limit reached', () => {
            accountMenuResourceServiceMock.getLossLimit.next({
                totalNetDeposit: 100,
                limitType: 'YEARLY',
                totalLossLimit: 100,
            });

            expect(component.item.parameters['order']).toBe('1');
            expect(accountMenuDataServiceMock.refreshWidgets).toHaveBeenCalled();
            expect(component.model).toEqual({
                totalLossLimit: 100,
                totalNetDeposit: 100,
                arrowClass: 'arrow-value--down',
                percentageElapsed: 100,
                limitText: '100 EUR 100 EUR',
                remainingDeposit: 0,
                limitReachedText: 'yearly limit reached',
                limitNotReachedText: '',
                description: 'yearly desc',
            });
            expect(component.item.text).toBe('YEARLY 100 EUR');
        });
    });

    describe('net deposit lower then 0', () => {
        it('not reached limit', () => {
            accountMenuResourceServiceMock.getLossLimit.next({
                totalNetDeposit: -25,
                limitType: 'MONTHLY',
                totalLossLimit: 100,
            });

            expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                'component.PositionEvent': 'positive value',
            });

            expect(component.model).toEqual({
                totalLossLimit: 100,
                totalNetDeposit: 25,
                arrowClass: 'arrow-value--up',
                percentageElapsed: 0,
                limitText: '0 EUR 100 EUR',
                remainingDeposit: 125,
                limitReachedText: '',
                limitNotReachedText: '125 EUR',
                description: 'monthly desc',
            });
            expect(component.item.text).toBe('MONTHLY 100 EUR');
        });
    });

    describe('net deposit equals 0', () => {
        it('not reached limit', () => {
            accountMenuResourceServiceMock.getLossLimit.next({
                totalNetDeposit: 0,
                limitType: 'MONTHLY',
                totalLossLimit: 100,
            });

            expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                'component.PositionEvent': 'zero value',
            });

            expect(component.model).toEqual({
                totalLossLimit: 100,
                totalNetDeposit: 0,
                arrowClass: null,
                percentageElapsed: 0,
                limitText: '0 EUR 100 EUR',
                remainingDeposit: 100,
                limitReachedText: '',
                limitNotReachedText: '100 EUR',
                description: 'monthly desc',
            });
            expect(component.item.text).toBe('MONTHLY 100 EUR');
        });
    });
});
