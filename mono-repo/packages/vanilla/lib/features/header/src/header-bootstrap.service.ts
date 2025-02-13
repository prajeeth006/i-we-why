import { Inject, Injectable } from '@angular/core';

import {
    HeaderService as CoreHeaderService,
    DslService,
    DynamicLayoutService,
    HtmlNode,
    MENU_COUNTERS_PROVIDER,
    MenuAction,
    MenuActionsService,
    MenuCountersProvider,
    MenuCountersService,
    OnFeatureInit,
    SlotName,
} from '@frontend/vanilla/core';
import { AccountMenuOnboardingService } from '@frontend/vanilla/shared/account-menu';
import { HeaderSearchService } from '@frontend/vanilla/shared/header';
import { combineLatest, firstValueFrom } from 'rxjs';

import { HEADER_COMPONENTS_MAP } from './header-component-map';
import { HeaderMessagesService } from './header-messages.service';
import { HeaderMessagesComponent } from './header-messages/header-messages.component';
import { HeaderConfig } from './header.client-config';
import { HeaderComponent } from './header.component';
import { HeaderService } from './header.service';

@Injectable()
export class HeaderBootstrapService implements OnFeatureInit {
    constructor(
        private dynamicLayoutService: DynamicLayoutService,
        private headerService: HeaderService,
        private headerMessagesService: HeaderMessagesService,
        private dslService: DslService,
        private config: HeaderConfig,
        private htmlNode: HtmlNode,
        private accountMenuOnboardingService: AccountMenuOnboardingService,
        private menuActionsService: MenuActionsService,
        private headerSearchService: HeaderSearchService,
        private coreHeaderService: CoreHeaderService,
        private menuCountersService: MenuCountersService,
        @Inject(MENU_COUNTERS_PROVIDER) private avatarProviders: MenuCountersProvider[],
    ) {}

    async onFeatureInit() {
        this.headerMessagesService.init();
        this.dynamicLayoutService.addComponent(SlotName.Messages, HeaderMessagesComponent, null);
        this.dynamicLayoutService.setComponent(SlotName.Header, HeaderComponent, null);
        await firstValueFrom(this.config.whenReady);
        this.coreHeaderService.set(this.headerService);

        this.menuCountersService.registerProviders(this.avatarProviders);
        this.headerService.initProductHighlighting();
        this.headerService.initMenuItems();

        combineLatest([
            this.dslService.evaluateExpression<boolean>(this.config.isEnabledCondition),
            this.dslService.evaluateExpression<boolean>(this.config.disabledItems.disabled),
        ]).subscribe(([isEnabled, disableItems]) => {
            if (isEnabled) {
                this.htmlNode.toggleVisibilityClass('header', true);
                if (disableItems) {
                    this.config.disabledItems.sections.forEach((section) => this.htmlNode.setCssClass(`${section}-hidden`, true));
                }
                this.headerService.show(disableItems ? this.config.disabledItems.sections : []);
            } else {
                this.htmlNode.toggleVisibilityClass('header', false);
                this.headerService.hide();
            }
        });

        // register all components lazily
        for (const key of Object.keys(HEADER_COMPONENTS_MAP)) {
            this.headerService.registerLazyCmp(key, HEADER_COMPONENTS_MAP[key]!);
        }

        if (!this.headerService.currentHighlightedProductName) {
            this.headerService.setHighlightedProduct();
        }

        if (!this.headerService.itemDisabled(SlotName.HeaderTopItems)) {
            this.dslService.evaluateContent(this.config.elements.topSlotItems).subscribe((items) => {
                items.forEach((item) => {
                    this.headerService.getLazyComponent(item.type).then((componentType) => {
                        if (componentType) {
                            this.dynamicLayoutService.addComponent(SlotName.HeaderTopItems, componentType, null);
                        }
                    });
                });
            });
        }

        this.accountMenuOnboardingService.init(this.config.onboardingEnabled);
        this.menuActionsService.register(MenuAction.SEARCH_ICON_CLICK, () => {
            this.headerSearchService.click();
        });
    }
}
