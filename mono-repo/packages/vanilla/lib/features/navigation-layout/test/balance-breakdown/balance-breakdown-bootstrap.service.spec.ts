import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { TooltipsServiceMock } from '../../../../shared/tooltips/test/tooltips-service.mock';
import { AccountMenuDataServiceMock } from '../../../account-menu/test/account-menu-data.mock';
import { PublicAccountMenuServiceMock as AccountMenuServiceMock } from '../../../account-menu/test/account-menu.mock';
import { BalanceBreakdownBootstrapService } from '../../../balance-breakdown/src/balance-breakdown-bootstrap.service';
import { AvailableBalanceLayoutComponent } from '../../../balance-breakdown/src/sub-components/available-balance-layout.component';
import { BalanceItemsLayoutComponent } from '../../../balance-breakdown/src/sub-components/balance-items-layout.component';
import { BalanceLayoutComponent } from '../../../balance-breakdown/src/sub-components/balance-layout.component';
import { BonusBalanceItemsLayoutComponent } from '../../../balance-breakdown/src/sub-components/bonus-balance-items-layout.component';
import { BonusBalanceLayoutComponent } from '../../../balance-breakdown/src/sub-components/bonus-balance-layout.component';
import { BalanceCtaComponent } from '../../../balance-breakdown/src/sub-components/cta.component';
import { TourneyTokenBalanceLayoutComponent } from '../../../balance-breakdown/src/sub-components/tourney-token-balance-layout.component';
import { BalanceBreakdownServiceMock } from '../../../balance-breakdown/test/balance-breakdown.service.mock';
import { BalanceBreakdownContentMock } from './balance-breakdown-content.mock';

describe('BalanceBreakdownBootstrapService', () => {
    let service: BalanceBreakdownBootstrapService;
    let balanceBreakdownServiceMock: BalanceBreakdownServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let configMock: BalanceBreakdownContentMock;

    beforeEach(() => {
        configMock = MockContext.useMock(BalanceBreakdownContentMock);
        balanceBreakdownServiceMock = MockContext.useMock(BalanceBreakdownServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(TooltipsServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BalanceBreakdownBootstrapService],
        });

        service = TestBed.inject(BalanceBreakdownBootstrapService);

        accountMenuDataServiceMock.version = 2;
    });

    describe('run()', () => {
        it('should setup balance breakdown templates', fakeAsync(() => {
            service.onFeatureInit();
            configMock.whenReady.next();
            tick();

            expect(menuActionsServiceMock.register).toHaveBeenCalledTimes(2);
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith('items', BalanceItemsLayoutComponent);
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith('balance', BalanceLayoutComponent);
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith(
                'available-balance',
                AvailableBalanceLayoutComponent,
            );
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith('cta', BalanceCtaComponent);
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith('bonus-balance', BonusBalanceItemsLayoutComponent);
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith('bonus-balance-item', BonusBalanceLayoutComponent);
            expect(balanceBreakdownServiceMock.setBalanceBreakdownComponent).toHaveBeenCalledWith(
                'tourney-token-balance',
                TourneyTokenBalanceLayoutComponent,
            );
        }));
    });
});
