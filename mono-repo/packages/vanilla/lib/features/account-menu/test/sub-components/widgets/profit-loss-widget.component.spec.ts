import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../../core/src/tracking/test/tracking.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { ProfitLossWidgetComponent } from '../../../src/sub-components/widgets/profit-loss-widget.component';
import { AccountMenuResourceServiceMock } from '../../account-menu-resource.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('ProfitLossWidgetComponent', () => {
    let fixture: ComponentFixture<ProfitLossWidgetComponent>;
    let component: ProfitLossWidgetComponent;
    let accountMenuResourceServiceMock: AccountMenuResourceServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        accountMenuResourceServiceMock = MockContext.useMock(AccountMenuResourceServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(ProfitLossWidgetComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(ProfitLossWidgetComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {
                'order': '2',
                'range-in-days': '7',
            },
            resources: {
                RangeText: '_RANGE_',
                ErrorText: 'error text',
            },
            children: [],
            text: 'profit',
            trackEvent: {
                'LoadedEvent.component.PositionEvent': 'test',
            },
        };

        fixture.detectChanges();
    });

    describe('init', () => {
        it('total stake higher then total return', () => {
            accountMenuResourceServiceMock.getProfitLoss.next({
                totalStake: 25,
                totalReturn: 14,
            });

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'LoadedEvent.component.PositionEvent': 'test',
                },
                'LoadedEvent',
            );

            expect(component.model).toEqual({
                rangeText: '7',
                totalStake: 25,
                totalReturn: 14,
                arrowClass: 'arrow-value--down',
                balance: 11,
            });
            expect(component.hideSkeleton).toBeTrue();
        });

        it('total stake lower then total return', () => {
            accountMenuResourceServiceMock.getProfitLoss.next({
                totalStake: 25,
                totalReturn: 30,
            });

            expect(component.model).toEqual({
                rangeText: '7',
                totalStake: 25,
                totalReturn: 30,
                arrowClass: 'arrow-value--up',
                balance: 5,
            });
        });

        it('total stake equal to total return', () => {
            accountMenuResourceServiceMock.getProfitLoss.next({
                totalStake: 30,
                totalReturn: 30,
            });

            expect(component.model).toEqual({
                rangeText: '7',
                totalStake: 30,
                totalReturn: 30,
                arrowClass: null,
                balance: 0,
            });
        });

        it('should set error text when error', () => {
            accountMenuResourceServiceMock.getProfitLoss.error({
                code: 30,
            });

            expect(component.errorText).toBe('error text');
        });
    });
});
