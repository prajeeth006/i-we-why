import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SlotType, UserAutologoutEvent, UserLogoutEvent } from '@frontend/vanilla/core';
import { CashbackType } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { TopLevelCookiesConfigMock } from '../../../core/test/browser/cookie.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { UserDocumentsConfigMock } from '../../user-documents/test/user-documents-config.mock';
import { AccountMenuBootstrapService } from '../src/account-menu-bootstrap.service';
import { AccountMenuHotspotComponent } from '../src/onboarding/account-menu-hotspot.component';
import { AvailableBalanceComponent } from '../src/sub-components/available-balance.component';
import { AccountMenuBalanceHeaderItemComponent } from '../src/sub-components/balance-header-item.component';
import { BalanceItemComponent } from '../src/sub-components/balance-item.component';
import { BonusBalanceItemComponent } from '../src/sub-components/bonus-balance-item.component';
import { BonusBalanceComponent } from '../src/sub-components/bonus-balance.component';
import { CashierBoxComponent } from '../src/sub-components/cashier-box.component';
import { CashierItemComponent } from '../src/sub-components/cashier-item.component';
import { CasinoCashbackInfoComponent } from '../src/sub-components/casino-cashback-info.component';
import { ContentMessagesComponent } from '../src/sub-components/content-messages.component';
import { CoralCashbackInfoComponent } from '../src/sub-components/coral-cashback-info.component';
import { CoralCashbackComponent } from '../src/sub-components/coral-cashback.component';
import { CtaComponent, CtaV3Component } from '../src/sub-components/cta.component';
import { HeaderAvatarComponent } from '../src/sub-components/header-avatar.component';
import { HeaderCloseComponent } from '../src/sub-components/header-close.component';
import { HeaderInboxComponent } from '../src/sub-components/header-inbox.component';
import { HeaderComponent } from '../src/sub-components/header.component';
import { IconMenuComponent } from '../src/sub-components/icon-menu.component';
import { ItemsLayoutComponent } from '../src/sub-components/items-layout.component';
import { LabelSwitcherItemComponent } from '../src/sub-components/label-switcher-item.component';
import { LabelSwitcherMenuComponent } from '../src/sub-components/label-switcher-menu.component';
import { LastLoginComponent } from '../src/sub-components/last-login.component';
import { ListLayoutComponent } from '../src/sub-components/list-layout.component';
import { LogoutComponent } from '../src/sub-components/logout.component';
import { LoyaltyCashbackComponent } from '../src/sub-components/loyalty-cashback.component';
import { MainLayoutComponent } from '../src/sub-components/main-layout.component';
import { MenuItemComponent } from '../src/sub-components/menu-item.component';
import { MLifeRewardsComponent } from '../src/sub-components/mlife-rewards.component';
import { PokerCashbackInfoComponent } from '../src/sub-components/poker-cashback-info.component';
import { PokerCashbackComponent } from '../src/sub-components/poker-cashback.component';
import { RowLayoutComponent } from '../src/sub-components/row-layout.component';
import { SideMenuItemComponent } from '../src/sub-components/side-menu-item.component';
import { CasinoCashbackTileComponent } from '../src/sub-components/slider-tiles/casino-cashback-tile.component';
import { CoralCashbackTileComponent } from '../src/sub-components/slider-tiles/coral-cashback-tile.component';
import { PokerCashbackTileComponent } from '../src/sub-components/slider-tiles/poker-cashback-tile.component';
import { SlotComponent } from '../src/sub-components/slot.component';
import { AdhocTaskComponent } from '../src/sub-components/tasks/adhoc-task.component';
import { DeadlineTaskComponent } from '../src/sub-components/tasks/deadline-task.component';
import { AccountMenuTasksComponent } from '../src/sub-components/tasks/tasks.component';
import { TextComponent } from '../src/sub-components/text.component';
import { VerificationStatusComponent } from '../src/sub-components/verification-status.component';
import { CashbackCasinoWidgetComponent } from '../src/sub-components/widgets/cashback-casino-widget.component';
import { CashbackCoralWidgetComponent } from '../src/sub-components/widgets/cashback-coral-widget.component';
import { LossLimitWidgetComponent } from '../src/sub-components/widgets/loss-limit-widget.component';
import { NetDepositWidgetComponent } from '../src/sub-components/widgets/net-deposit-widget.component';
import { OffersWidgetComponent } from '../src/sub-components/widgets/offers-widget.component';
import { ProfitLossWidgetComponent } from '../src/sub-components/widgets/profit-loss-widget.component';
import { TextWidgetComponent } from '../src/sub-components/widgets/text-widget.component';
import { AccountMenuWidgetsComponent } from '../src/sub-components/widgets/widgets.component';
import { AccountMenuDataServiceMock, AccountMenuOnboardingOverlayServiceMock } from './account-menu-data.mock';
import { AccountMenuServiceMock } from './account-menu.mock';
import { AccountMenuConfigMock } from './menu-content.mock';

describe('AccountMenuBootstrapService', () => {
    let service: AccountMenuBootstrapService;
    let menuContentMock: AccountMenuConfigMock;
    let userDocumentsConfigMock: UserDocumentsConfigMock;
    let accountMenuServiceMock: AccountMenuServiceMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let userServiceMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;

    beforeEach(() => {
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        userDocumentsConfigMock = MockContext.useMock(UserDocumentsConfigMock);
        accountMenuServiceMock = MockContext.useMock(AccountMenuServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(AccountMenuOnboardingOverlayServiceMock);
        MockContext.useMock(TopLevelCookiesConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuBootstrapService],
        });

        service = TestBed.inject(AccountMenuBootstrapService);
    });

    describe('run()', () => {
        it('should setup responsive account menu templates', fakeAsync(() => {
            accountMenuDataServiceMock.version = 3;
            service.onFeatureInit();
            menuContentMock.whenReady.next();
            userDocumentsConfigMock.whenReady.next();
            tick();

            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('adhoc-task', AdhocTaskComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('available-balance', AvailableBalanceComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('balance-header-item', AccountMenuBalanceHeaderItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('balance', BalanceItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('bonus-balance-item', BonusBalanceItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('bonus-balance', BonusBalanceComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashier-box', CashierBoxComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashier-item', CashierItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('content-messages', ContentMessagesComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cta-v3', CtaV3Component);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cta', CtaComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('deadline-task', DeadlineTaskComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('default', MenuItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('header-avatar', HeaderAvatarComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('header-close', HeaderCloseComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('header-inbox', HeaderInboxComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('header', HeaderComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('items', ItemsLayoutComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('label-switcher-item', LabelSwitcherItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('label-switcher-menu', LabelSwitcherMenuComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('last-login', LastLoginComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('list', ListLayoutComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('logout', LogoutComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('loss-limit-widget', LossLimitWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('main', MainLayoutComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('menu', IconMenuComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('mlife-rewards', MLifeRewardsComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('net-deposit-widget', NetDepositWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('offers-widget', OffersWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('onboarding-hotspot', AccountMenuHotspotComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('profit-loss-widget', ProfitLossWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('row', RowLayoutComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('side-menu-item', SideMenuItemComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('slot', SlotComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('tasks', AccountMenuTasksComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('text', TextComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('text', TextComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('text-widget', TextWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('verification-status', VerificationStatusComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('widgets', AccountMenuWidgetsComponent);
            expect(menuActionsServiceMock.register).toHaveBeenCalledTimes(4);
        }));

        it('should register slot', fakeAsync(() => {
            service.onFeatureInit();
            menuContentMock.whenReady.next();
            userDocumentsConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith('account_menu_header_left', SlotType.Single);
        }));

        it('should register poker cashback tile and info', fakeAsync(() => {
            menuContentMock.account.cashbackType = CashbackType.Poker;
            userServiceMock.isAuthenticated = true;
            service.onFeatureInit();
            menuContentMock.whenReady.next();
            userDocumentsConfigMock.whenReady.next();
            tick();

            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-tile', PokerCashbackTileComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-info', PokerCashbackInfoComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('poker-cashback', PokerCashbackComponent);
            expect(accountMenuServiceMock.updatePokerCashback).toHaveBeenCalled();
        }));

        it('should register casino cashback tile and info', fakeAsync(() => {
            menuContentMock.account.cashbackType = CashbackType.Casino;
            userServiceMock.isAuthenticated = true;
            service.onFeatureInit();
            menuContentMock.whenReady.next();
            userDocumentsConfigMock.whenReady.next();
            tick();

            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-tile', CasinoCashbackTileComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-info', CasinoCashbackInfoComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-widget', CashbackCasinoWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('loyalty-cashback', LoyaltyCashbackComponent);
            expect(accountMenuServiceMock.updateLoyaltyCashback).toHaveBeenCalled();
        }));

        it('should register coral cashback tile and info', fakeAsync(() => {
            menuContentMock.account.cashbackType = CashbackType.Coral;
            userServiceMock.isAuthenticated = true;
            service.onFeatureInit();
            menuContentMock.whenReady.next();
            userDocumentsConfigMock.whenReady.next();
            tick();

            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-tile', CoralCashbackTileComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-info', CoralCashbackInfoComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('cashback-widget', CashbackCoralWidgetComponent);
            expect(accountMenuServiceMock.setAccountMenuComponent).toHaveBeenCalledWith('coral-cashback', CoralCashbackComponent);
            expect(accountMenuServiceMock.updateCoralCashback).toHaveBeenCalled();
        }));

        it('should toggle off menu if visible on attempted navigation', fakeAsync(() => {
            service.onFeatureInit();
            menuContentMock.whenReady.next();
            userDocumentsConfigMock.whenReady.next();
            tick();
            accountMenuServiceMock.visible.next(true);
            navigationServiceMock.attemptedNavigation.next(<any>{});

            expect(accountMenuServiceMock.toggle).toHaveBeenCalledWith(false);
        }));

        describe('should remove return url cookie on', () => {
            beforeEach(fakeAsync(() => {
                service.onFeatureInit();
                menuContentMock.whenReady.next();
                userDocumentsConfigMock.whenReady.next();
                tick();
            }));

            it('UserLogoutEvent', fakeAsync(() => {
                userServiceMock.triggerEvent(new UserLogoutEvent());
                tick();

                expect(accountMenuServiceMock.removeReturnUrlCookie).toHaveBeenCalled();
            }));

            it('UserAutologoutEvent', fakeAsync(() => {
                userServiceMock.triggerEvent(new UserAutologoutEvent());
                tick();

                expect(accountMenuServiceMock.removeReturnUrlCookie).toHaveBeenCalled();
            }));
        });
    });
});
