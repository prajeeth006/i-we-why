import { Injectable } from '@angular/core';

import {
    AccountMenuService,
    MenuAction,
    MenuActionsService,
    NavigationService,
    OnFeatureInit,
    ToggleMenuOptions,
    UserService,
} from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { TooltipsService } from '@frontend/vanilla/shared/tooltips';
import { firstValueFrom } from 'rxjs';

import { BalanceBreakdownContent } from './balance-breakdown.client-config';
import { BalanceBreakdownService } from './balance-breakdown.service';
import { AvailableBalanceLayoutComponent } from './sub-components/available-balance-layout.component';
import { BalanceContainerComponent } from './sub-components/balance-container.component';
import { BalanceFilteredItemsLayoutComponent } from './sub-components/balance-filtered-items-layout.component';
import { BalanceItemsLayoutComponent } from './sub-components/balance-items-layout.component';
import { BalanceLayoutComponent } from './sub-components/balance-layout.component';
import { BonusBalanceItemsLayoutComponent } from './sub-components/bonus-balance-items-layout.component';
import { BonusBalanceLayoutComponent } from './sub-components/bonus-balance-layout.component';
import { BalanceCtaComponent } from './sub-components/cta.component';
import { ExpanderComponent } from './sub-components/expander.component';
import { BalanceSlideComponent } from './sub-components/slider-items/balance-slide.component';
import { BalanceBreakdownSliderComponent } from './sub-components/slider.component';
import { TourneyTokenBalanceLayoutComponent } from './sub-components/tourney-token-balance-layout.component';
import { BalanceBreakdownTutorialLayoutComponent } from './sub-components/tutorial-layout.component';

@Injectable()
export class BalanceBreakdownBootstrapService implements OnFeatureInit {
    constructor(
        private accountMenuService: AccountMenuService,
        private accountMenuDataService: AccountMenuDataService,
        private balanceBreakdownService: BalanceBreakdownService,
        private menuActionsService: MenuActionsService,
        private tooltipsService: TooltipsService,
        private navigationService: NavigationService,
        private user: UserService,
        private config: BalanceBreakdownContent,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.menuActionsService.register(
            'toggleBalanceBreakdown',
            (_origin: string, url: string, _target: string, parameters: { [key: string]: string }) => {
                if (this.user.realPlayer) {
                    if (this.accountMenuDataService.version > 1 && this.accountMenuDataService.version < 4) {
                        this.navigationService.goTo('/account/balancebreakdown');
                    } else {
                        const options: ToggleMenuOptions = {
                            singlePageMode: true,
                        };

                        if (parameters['breakdown-menu-route']) {
                            options.route = parameters['breakdown-menu-route'];
                        }

                        if (parameters['menu-anchor-element']) {
                            options.anchorElementKey = parameters['menu-anchor-element'];
                        }

                        this.accountMenuService.toggle(true, options);
                    }
                } else {
                    this.navigationService.goTo(url);
                }
            },
        );
        this.menuActionsService.register(MenuAction.SHOW_TUTORIAL, () => {
            this.tooltipsService.show();
        });
        this.balanceBreakdownService.setBalanceBreakdownComponent('items', BalanceItemsLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('balance', BalanceLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('available-balance', AvailableBalanceLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('cta', BalanceCtaComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('bonus-balance', BonusBalanceItemsLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('bonus-balance-item', BonusBalanceLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('slider', BalanceBreakdownSliderComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('balance-slide', BalanceSlideComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('expander', ExpanderComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('balance-filtered', BalanceFilteredItemsLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('balance-tutorial', BalanceBreakdownTutorialLayoutComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('container', BalanceContainerComponent);
        this.balanceBreakdownService.setBalanceBreakdownComponent('tourney-token-balance', TourneyTokenBalanceLayoutComponent);
    }
}
