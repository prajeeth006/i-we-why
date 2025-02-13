import { Injectable } from '@angular/core';

import { CookieName, CookieService, DslService, MenuAction, MenuActionsService, OnFeatureInit } from '@frontend/vanilla/core';
import { first, firstValueFrom } from 'rxjs';

import { LanguageSwitcherOverlayService } from './language-switcher-overlay.service';
import { LanguageSwitcherConfig } from './language-switcher.client-config';

@Injectable()
export class LanguageSwitcherBootstrapService implements OnFeatureInit {
    constructor(
        private cookieService: CookieService,
        private languageSwitcherOverlayService: LanguageSwitcherOverlayService,
        private dslService: DslService,
        private config: LanguageSwitcherConfig,
        private menuActionsService: MenuActionsService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.menuActionsService.register(MenuAction.TOGGLE_LANGUAGE_SWITCHER, () => {
            this.languageSwitcherOverlayService.openMenu();
        });

        this.dslService
            .evaluateExpression<boolean>(this.config.openPopupDslExpression)
            .pipe(first())
            .subscribe((isEnabled: boolean) => {
                if (isEnabled) {
                    this.languageSwitcherOverlayService.openMenu();
                    this.cookieService.remove(CookieName.UnsupportedBrowserLanguage);
                }
            });
    }
}
