import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { IntlServiceMock } from '../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { ClaimsServiceMock } from '../../../../core/test/user/claims.mock';
import { CoralCashbackComponent } from '../../src/sub-components/coral-cashback.component';
import { AccountMenuRouterMock } from '../account-menu-router.mock';
import { AccountMenuVipServiceMock } from '../account-menu-vip.mock';
import { AccountMenuServiceMock } from '../account-menu.mock';
import { AccountMenuConfigMock } from '../menu-content.mock';

describe('CoralCashbackComponent', () => {
    let fixture: ComponentFixture<CoralCashbackComponent>;
    let component: CoralCashbackComponent;
    let intlServiceMock: IntlServiceMock;
    let accountMenuServiceMock: AccountMenuServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let menuContentMock: AccountMenuConfigMock;
    let accountMenuVipServiceMock: AccountMenuVipServiceMock;

    beforeEach(() => {
        MockContext.useMock(MenuActionsServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        accountMenuServiceMock = MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(AccountMenuRouterMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        accountMenuVipServiceMock = MockContext.useMock(AccountMenuVipServiceMock);

        TestBed.overrideComponent(CoralCashbackComponent, {
            set: {
                imports: [CommonModule, TrustAsHtmlPipe],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        accountMenuServiceMock.resources = {
            messages: {
                CoralCashbackTitle: 'Comp Points',
                CoralCashbackCashValue: '{AMOUNT} Cash Value',
                CoralCashbackCurrentPoints: '{POINTS} Pts',
                CoralCashbackMinRequiredPoints: 'Min. required for collection: {MIN_POINTS} Pts.',
                CoralCashbackNonVipMessage: 'Message for non vip user',
            },
        };

        intlServiceMock.formatCurrency.and.returnValue('1.00 BAM');
        menuContentMock.account.vipLevels = ['clubs', 'hearts', 'aces'];
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoralCashbackComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit()', () => {
        it('should show message for when vip level claim missing', () => {
            fixture.detectChanges();

            expect(component.nonVipMessage).toBe('Message for non vip user');
        });
        it('should show message for non vip level user', () => {
            claimsServiceMock.get.withArgs('vipLevel').and.returnValue('level');
            fixture.detectChanges();

            expect(component.nonVipMessage).toBe('Message for non vip user');
        });
        it('should setup model', () => {
            accountMenuVipServiceMock.isVip = true;
            claimsServiceMock.get.withArgs('vipLevel').and.returnValue('hearts');
            fixture.detectChanges();

            accountMenuServiceMock.coralCashbackEvents.next({
                optinStatus: true,
                claimedAmount: 9,
                claimedAmountCurrency: 'BAM',
                eligibleForClaim: true,
                lifeTimePoints: 7,
                pointsBalanceAfterClaim: 6,
                cashbackAmount: 100,
                cashbackCurrency: 'BAM',
                currentPoints: 5,
                minPointsReqForRedeem: 100,
            });
            expect(component.model).toEqual({
                title: 'Comp Points',
                currentPoints: '5 Pts',
                cashValue: '1.00 BAM Cash Value',
                minRequiredPointsForRedeem: 'Min. required for collection: 100 Pts.',
            });
            expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(1.0, 'BAM');
            expect(accountMenuServiceMock.updateCoralCashback).toHaveBeenCalled();
        });
    });
});
