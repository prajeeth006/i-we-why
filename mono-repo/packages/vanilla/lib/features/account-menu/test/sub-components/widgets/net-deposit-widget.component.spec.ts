import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../../core/src/tracking/test/tracking.mock';
import { FakeCurrencyPipe } from '../../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { NetDepositWidgetComponent } from '../../../src/sub-components/widgets/net-deposit-widget.component';
import { AccountMenuResourceServiceMock } from '../../account-menu-resource.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('NetDepositWidgetComponent', () => {
    let fixture: ComponentFixture<NetDepositWidgetComponent>;
    let component: NetDepositWidgetComponent;
    let accountMenuResourceServiceMock: AccountMenuResourceServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        accountMenuResourceServiceMock = MockContext.useMock(AccountMenuResourceServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(NetDepositWidgetComponent, {
            set: {
                imports: [CommonModule, FakeCurrencyPipe],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(NetDepositWidgetComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {
                'order': '2',
                'range-in-days': '7',
                'level': 'user_level',
                'show-footer-text': 'true',
            },
            resources: {
                RangeText: '_RANGE_',
            },
            trackEvent: {
                'LoadedEvent.component.PositionEvent': 'test',
            },
            children: [],
        };

        fixture.detectChanges();
    });

    describe('init', () => {
        it('net loss higher then 0', () => {
            accountMenuResourceServiceMock.getNetDeposit.next({
                netDeposit: 25,
                netWithdrawal: 14,
                netLoss: 11,
            });

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'LoadedEvent.component.PositionEvent': 'test',
                },
                'LoadedEvent',
            );
            expect(component.model).toEqual({
                rangeText: '7',
                totalDeposit: 25,
                totalWithdrawals: 14,
                arrowClass: 'arrow-value--down',
                balance: 11,
            });
            expect(component.showFooterText).toBeTrue();
            expect(component.hideSkeleton).toBeTrue();
        });

        it('net loss lower then 0', () => {
            accountMenuResourceServiceMock.getNetDeposit.next({
                netDeposit: 25,
                netWithdrawal: 30,
                netLoss: -5,
            });

            expect(component.model).toEqual({
                rangeText: '7',
                totalDeposit: 25,
                totalWithdrawals: 30,
                arrowClass: 'arrow-value--up',
                balance: 5,
            });
        });

        it('net loss equal to 0', () => {
            accountMenuResourceServiceMock.getNetDeposit.next({
                netDeposit: 30,
                netWithdrawal: 30,
                netLoss: 0,
            });

            expect(component.model).toEqual({
                rangeText: '7',
                totalDeposit: 30,
                totalWithdrawals: 30,
                arrowClass: null,
                balance: 0,
            });
        });
    });
});
