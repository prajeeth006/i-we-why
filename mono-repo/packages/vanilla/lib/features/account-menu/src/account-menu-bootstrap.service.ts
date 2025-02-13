import { Injectable } from '@angular/core';

import {
    AccountMenuService as CoreAccountMenuService,
    DynamicLayoutService,
    EventsService,
    MenuAction,
    MenuActionsService,
    NavigationService,
    OnFeatureInit,
    ParsedUrl,
    SlotName,
    SlotType,
    ToggleMenuOptions,
    UserAutologoutEvent,
    UserEvent,
    UserLoginEvent,
    UserLogoutEvent,
    UserService,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { UserDocumentsConfig } from '@frontend/vanilla/features/user-documents';
import { AccountMenuConfig, AccountMenuDataService, AccountMenuOnboardingService, CashbackType } from '@frontend/vanilla/shared/account-menu';
import { firstValueFrom } from 'rxjs';
import { first, map, withLatestFrom } from 'rxjs/operators';

import { AccountMenuService } from './account-menu.service';
import { AccountMenuHotspotComponent } from './onboarding/account-menu-hotspot.component';
import { AccountMenuOnboardingOverlayService } from './onboarding/account-menu-onboarding-overlay.service';
import { AvailableBalanceComponent } from './sub-components/available-balance.component';
import { AccountMenuBalanceHeaderItemComponent } from './sub-components/balance-header-item.component';
import { BalanceHeaderTitleComponent } from './sub-components/balance-header-title.component';
import { BalanceItemComponent } from './sub-components/balance-item.component';
import { BannerComponent } from './sub-components/banner.component';
import { BonusBalanceHeaderItemComponent } from './sub-components/bonus-balance-header-item.component';
import { BonusBalanceHeaderComponent } from './sub-components/bonus-balance-header.component';
import { BonusBalanceItemComponent } from './sub-components/bonus-balance-item.component';
import { BonusBalanceSubItemComponent } from './sub-components/bonus-balance-sub-item.component';
import { BonusBalanceComponent } from './sub-components/bonus-balance.component';
import { CashierBoxComponent } from './sub-components/cashier-box.component';
import { CashierItemComponent } from './sub-components/cashier-item.component';
import { CasinoCashbackInfoComponent } from './sub-components/casino-cashback-info.component';
import { ChatBubbleComponent } from './sub-components/chat-bubble.component';
import { ContentMessagesComponent } from './sub-components/content-messages.component';
import { CoralCashbackInfoComponent } from './sub-components/coral-cashback-info.component';
import { CoralCashbackComponent } from './sub-components/coral-cashback.component';
import { CtaComponent, CtaV3Component } from './sub-components/cta.component';
import { DarkModeToggleComponent } from './sub-components/dark-mode.component';
import { DepositFeedbackComponent } from './sub-components/feedback/deposit-feedback.component';
import { ProfitLossFeedbackComponent } from './sub-components/feedback/profit-loss-feedback.component';
import { HeaderAccountComponent } from './sub-components/header-account.component';
import { HeaderAvatarComponent } from './sub-components/header-avatar.component';
import { HeaderCloseComponent } from './sub-components/header-close.component';
import { HeaderInboxComponent } from './sub-components/header-inbox.component';
import { HeaderComponent } from './sub-components/header.component';
import { IconMenuComponent } from './sub-components/icon-menu.component';
import { InviteFriendsBannerComponent } from './sub-components/invite-friends-banner.component';
import { ItemsLayoutComponent } from './sub-components/items-layout.component';
import { LabelSwitcherItemComponent } from './sub-components/label-switcher-item.component';
import { LabelSwitcherMenuComponent } from './sub-components/label-switcher-menu.component';
import { LastLoginComponent } from './sub-components/last-login.component';
import { ListLayoutComponent } from './sub-components/list-layout.component';
import { LogoutComponent } from './sub-components/logout.component';
import { LoyaltyCashbackComponent } from './sub-components/loyalty-cashback.component';
import { MainLayoutComponent } from './sub-components/main-layout.component';
import { MenuItemComponent } from './sub-components/menu-item.component';
import { MLifeRewardsComponent } from './sub-components/mlife-rewards.component';
import { PokerCashbackInfoComponent } from './sub-components/poker-cashback-info.component';
import { PokerCashbackComponent } from './sub-components/poker-cashback.component';
import { RowLayoutComponent } from './sub-components/row-layout.component';
import { SideMenuItemComponent } from './sub-components/side-menu-item.component';
import { BalanceTileItemComponent } from './sub-components/slider-tiles/balance-tile-item.component';
import { BalanceTileComponent } from './sub-components/slider-tiles/balance-tile.component';
import { BonusesTileComponent } from './sub-components/slider-tiles/bonuses-tile.component';
import { CasinoCashbackTileComponent } from './sub-components/slider-tiles/casino-cashback-tile.component';
import { CoralCashbackTileComponent } from './sub-components/slider-tiles/coral-cashback-tile.component';
import { PokerCashbackTileComponent } from './sub-components/slider-tiles/poker-cashback-tile.component';
import { SliderComponent } from './sub-components/slider.component';
import { SlotComponent } from './sub-components/slot.component';
import { AdhocTaskComponent } from './sub-components/tasks/adhoc-task.component';
import { DeadlineTaskComponent } from './sub-components/tasks/deadline-task.component';
import { AccountMenuTasksComponent } from './sub-components/tasks/tasks.component';
import { TextComponent } from './sub-components/text.component';
import { TourneyTokenBalanceLayoutComponent } from './sub-components/tourney-token-balance-layout.component';
import { VerificationStatusComponent } from './sub-components/verification-status.component';
import { CashbackCasinoWidgetComponent } from './sub-components/widgets/cashback-casino-widget.component';
import { CashbackCoralWidgetComponent } from './sub-components/widgets/cashback-coral-widget.component';
import { CashbackPokerWidgetComponent } from './sub-components/widgets/cashback-poker-widget.component';
import { DocumentsWidgetComponent } from './sub-components/widgets/documents-widget.component';
import { LossLimitWidgetComponent } from './sub-components/widgets/loss-limit-widget.component';
import { NetDepositWidgetComponent } from './sub-components/widgets/net-deposit-widget.component';
import { OffersWidgetComponent } from './sub-components/widgets/offers-widget.component';
import { ProfitLossWidgetComponent } from './sub-components/widgets/profit-loss-widget.component';
import { TextWidgetComponent } from './sub-components/widgets/text-widget.component';
import { TimeSpentWidgetComponent } from './sub-components/widgets/time-spent-widget.component';
import { AccountMenuWidgetsComponent } from './sub-components/widgets/widgets.component';

@Injectable()
export class AccountMenuBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private accountMenuService: AccountMenuService,
        private config: AccountMenuConfig,
        private userDocumentsConfig: UserDocumentsConfig,
        private dynamicLayoutService: DynamicLayoutService,
        private navigationService: NavigationService,
        private menuActionsService: MenuActionsService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuOnboardingService: AccountMenuOnboardingService,
        private accountMenuOnboardingOverlayService: AccountMenuOnboardingOverlayService,
        private eventsService: EventsService,
        private navigation: NavigationService,
        private coreAccountMenuService: CoreAccountMenuService,
    ) {}

    async onFeatureInit() {
        await Promise.all([firstValueFrom(this.config.whenReady), firstValueFrom(this.userDocumentsConfig.whenReady)]);

        this.coreAccountMenuService.set(this.accountMenuService);
        this.accountMenuDataService.init();
        this.accountMenuOnboardingService.init(this.config.account.onboardingEnabled);

        let isMainMenuVisible: boolean;
        this.accountMenuService.visible.subscribe((v) => (isMainMenuVisible = v));

        this.menuActionsService.register(
            MenuAction.TOGGLE_ACCOUNT_MENU,
            (_origin: string, _url: string, _target: string, parameters: { [key: string]: string }) => {
                const anchorElementKey = parameters['menu-anchor-element'];

                if (this.accountMenuService.routerMode) {
                    this.accountMenuService.toggle(
                        !this.navigation.location.url().includes('/menu'),
                        anchorElementKey ? { anchorElementKey } : undefined,
                    );
                } else {
                    this.accountMenuService.toggle(!isMainMenuVisible, anchorElementKey ? { anchorElementKey } : undefined);
                }
            },
        );

        this.menuActionsService.register(
            MenuAction.TOGGLE_LABEL_SWITCHER,
            (_origin: string, _url: string, _target: string, parameters: { [key: string]: string }) => {
                const options: ToggleMenuOptions = {
                    singlePageMode: true,
                };

                if (parameters['labelswitcher-menu-route']) {
                    options.route = parameters['labelswitcher-menu-route'];
                }

                if (parameters['menu-anchor-element']) {
                    options.anchorElementKey = parameters['menu-anchor-element'];
                }

                this.accountMenuService.toggle(true, options);
            },
        );

        this.menuActionsService.register(MenuAction.GOTO_SETTINGS, () => {
            const item = this.accountMenuDataService.getItem('settings');

            if (!item) {
                throw new Error('Account menu does not have an item named settings.');
            }

            if (!item.children || !item.children.length) {
                throw new Error('Account menu settings item must have at lease one child item.');
            }

            if (item.children[0]?.url) {
                this.navigationService.goTo(item.children[0].url);
            }

            this.accountMenuService.toggle(false);
        });

        this.accountMenuService.setAccountMenuComponent('default', MenuItemComponent);
        this.accountMenuService.setAccountMenuComponent('menu', IconMenuComponent);
        this.accountMenuService.setAccountMenuComponent('cta', CtaComponent);
        this.accountMenuService.setAccountMenuComponent('logout', LogoutComponent);
        this.accountMenuService.setAccountMenuComponent('main', MainLayoutComponent);
        this.accountMenuService.setAccountMenuComponent('list', ListLayoutComponent);
        this.accountMenuService.setAccountMenuComponent('items', ItemsLayoutComponent);
        this.accountMenuService.setAccountMenuComponent('last-login', LastLoginComponent);
        this.accountMenuService.setAccountMenuComponent('balance', BalanceItemComponent);
        this.accountMenuService.setAccountMenuComponent('tourney-token-balance', TourneyTokenBalanceLayoutComponent);
        this.accountMenuService.setAccountMenuComponent('available-balance', AvailableBalanceComponent);
        this.accountMenuService.setAccountMenuComponent('cashier-box', CashierBoxComponent);
        this.accountMenuService.setAccountMenuComponent('cashier-item', CashierItemComponent);
        this.accountMenuService.setAccountMenuComponent('bonus-balance', BonusBalanceComponent);
        this.accountMenuService.setAccountMenuComponent('bonus-balance-item', BonusBalanceItemComponent);
        this.accountMenuService.setAccountMenuComponent('text', TextComponent);
        this.accountMenuService.setAccountMenuComponent('row', RowLayoutComponent);
        this.accountMenuService.setAccountMenuComponent('header', HeaderComponent);
        this.accountMenuService.setAccountMenuComponent('header-account', HeaderAccountComponent);
        this.accountMenuService.setAccountMenuComponent('header-avatar', HeaderAvatarComponent);
        this.accountMenuService.setAccountMenuComponent('header-inbox', HeaderInboxComponent);
        this.accountMenuService.setAccountMenuComponent('banner', BannerComponent);
        this.accountMenuService.setAccountMenuComponent('invite-friends-banner', InviteFriendsBannerComponent);

        if (this.accountMenuDataService.version === 2) {
            this.accountMenuService.setAccountMenuComponent('slider', SliderComponent);
            this.accountMenuService.setAccountMenuComponent('balance-tile-item', BalanceTileItemComponent);
            this.accountMenuService.setAccountMenuComponent('balance-tile', BalanceTileComponent);
            this.accountMenuService.setAccountMenuComponent('bonuses-tile', BonusesTileComponent);
            this.accountMenuService.setAccountMenuComponent('chat', ChatBubbleComponent);
        }

        this.accountMenuService.setAccountMenuComponent('loss-limit-widget', LossLimitWidgetComponent);
        this.accountMenuService.setAccountMenuComponent('profit-loss-widget', ProfitLossWidgetComponent);
        this.accountMenuService.setAccountMenuComponent('profit-loss-feedback', ProfitLossFeedbackComponent);
        this.accountMenuService.setAccountMenuComponent('net-deposit-widget', NetDepositWidgetComponent);
        this.accountMenuService.setAccountMenuComponent('deposit-feedback', DepositFeedbackComponent);
        this.accountMenuService.setAccountMenuComponent('time-spent-widget', TimeSpentWidgetComponent);
        this.accountMenuService.setAccountMenuComponent('offers-widget', OffersWidgetComponent);
        this.accountMenuService.setAccountMenuComponent('documents-widget', DocumentsWidgetComponent);
        this.accountMenuService.setAccountMenuComponent('text-widget', TextWidgetComponent);

        this.accountMenuService.setAccountMenuComponent('widgets', AccountMenuWidgetsComponent);
        this.accountMenuService.setAccountMenuComponent('tasks', AccountMenuTasksComponent);
        this.accountMenuService.setAccountMenuComponent('adhoc-task', AdhocTaskComponent);
        this.accountMenuService.setAccountMenuComponent('deadline-task', DeadlineTaskComponent);
        this.accountMenuService.setAccountMenuComponent('balance-header-item', AccountMenuBalanceHeaderItemComponent);
        this.accountMenuService.setAccountMenuComponent('bonus-balance-header', BonusBalanceHeaderComponent);
        this.accountMenuService.setAccountMenuComponent('bonus-balance-header-item', BonusBalanceHeaderItemComponent);
        this.accountMenuService.setAccountMenuComponent('bonus-balance-sub-item', BonusBalanceSubItemComponent);
        this.accountMenuService.setAccountMenuComponent('header-close', HeaderCloseComponent);
        this.accountMenuService.setAccountMenuComponent('cta-v3', CtaV3Component);
        this.accountMenuService.setAccountMenuComponent('slider-v3', SliderComponent);
        this.accountMenuService.setAccountMenuComponent('onboarding-hotspot', AccountMenuHotspotComponent);
        this.accountMenuService.setAccountMenuComponent('verification-status', VerificationStatusComponent);
        this.menuActionsService.register(MenuAction.OPEN_ACCOUNT_MENU_ONBOARDING_TOUR, () => this.openTour());

        this.accountMenuService.setAccountMenuComponent('slot', SlotComponent);
        this.accountMenuService.setAccountMenuComponent('content-messages', ContentMessagesComponent);
        this.accountMenuService.setAccountMenuComponent('side-menu-item', SideMenuItemComponent);
        this.accountMenuService.setAccountMenuComponent('mlife-rewards', MLifeRewardsComponent);
        this.accountMenuService.setAccountMenuComponent('label-switcher-item', LabelSwitcherItemComponent);
        this.accountMenuService.setAccountMenuComponent('label-switcher-menu', LabelSwitcherMenuComponent);
        this.accountMenuService.setAccountMenuComponent('balance-header-title', BalanceHeaderTitleComponent);
        this.accountMenuService.setAccountMenuComponent('dark-mode-toggle', DarkModeToggleComponent);

        this.dynamicLayoutService.registerSlot(SlotName.AccountMenuHeaderLeft, SlotType.Single);

        // cashback
        const cashbackType = this.config.account.cashbackType;

        if (cashbackType) {
            if (cashbackType === CashbackType.Poker) {
                this.accountMenuService.setAccountMenuComponent('cashback-info', PokerCashbackInfoComponent);
                this.accountMenuService.setAccountMenuComponent('cashback-tile', PokerCashbackTileComponent);
                this.accountMenuService.setAccountMenuComponent('cashback-widget', CashbackPokerWidgetComponent);
                this.accountMenuService.setAccountMenuComponent('poker-cashback', PokerCashbackComponent);
                this.runOnLogin(() => this.accountMenuService.updatePokerCashback());
            } else if (cashbackType === CashbackType.Casino) {
                this.accountMenuService.setAccountMenuComponent('cashback-info', CasinoCashbackInfoComponent);
                this.accountMenuService.setAccountMenuComponent('cashback-tile', CasinoCashbackTileComponent);
                this.accountMenuService.setAccountMenuComponent('cashback-widget', CashbackCasinoWidgetComponent);
                this.accountMenuService.setAccountMenuComponent('loyalty-cashback', LoyaltyCashbackComponent);
                this.runOnLogin(() => this.accountMenuService.updateLoyaltyCashback());
            } else if (cashbackType === CashbackType.Coral) {
                this.accountMenuService.setAccountMenuComponent('cashback-info', CoralCashbackInfoComponent);
                this.accountMenuService.setAccountMenuComponent('cashback-tile', CoralCashbackTileComponent);
                this.accountMenuService.setAccountMenuComponent('cashback-widget', CashbackCoralWidgetComponent);
                this.accountMenuService.setAccountMenuComponent('coral-cashback', CoralCashbackComponent);
                this.runOnLogin(() => this.accountMenuService.updateCoralCashback());
            }
        }

        this.navigationService.attemptedNavigation
            .pipe(
                withLatestFrom(this.accountMenuService.visible),
                map((params: [ParsedUrl, boolean]) => params[1]),
            )
            .subscribe((visible: boolean) => {
                if (visible) {
                    this.accountMenuService.toggle(false);
                }
            });

        // cleaning up after log out
        this.user.events.pipe(first((e: UserEvent) => e instanceof UserLogoutEvent || e instanceof UserAutologoutEvent)).subscribe(() => {
            this.accountMenuService.removeReturnUrlCookie();
        });
    }

    private runOnLogin(fn: () => void) {
        if (this.user.isAuthenticated) {
            fn();
        }

        this.user.events.pipe(first((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => fn());
    }

    private openTour() {
        if (this.accountMenuOnboardingService.enabled) {
            const count = this.accountMenuOnboardingService.tourStartedLoginCount ?? 0;
            this.accountMenuOnboardingService.saveTourStartedLoginCount(count);
            this.eventsService.raise({ eventName: VanillaEventNames.OpenOnboardingTour });
            this.accountMenuOnboardingOverlayService.show();
        }
    }
}
