import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { LanguageSwitcherMenuComponent } from './language-switcher-menu.component';
import { LanguageSwitcherMenuData } from './language-switcher.models';
import { LANGUAGE_SWITCHER_MENU_DATA } from './language-switcher.tokens';

@Injectable({
    providedIn: 'root',
})
export class LanguageSwitcherOverlayService {
    constructor(
        private overlay: OverlayFactory,
        private injector: Injector,
    ) {}

    openMenu(elementRef?: ElementRef) {
        const languageSwitcherMenuData: LanguageSwitcherMenuData = {
            openedByLanguageSelector: !!elementRef,
        };

        const overlayRef = this.overlay.create({
            panelClass: elementRef ? ['vn-language-switcher'] : ['vn-language-switcher', 'full-view'],
            positionStrategy: this.createPositionStrategy(elementRef),
        });
        overlayRef.backdropClick().subscribe(() => this.overlay.dispose(overlayRef));
        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
        });

        const portal = new ComponentPortal(
            LanguageSwitcherMenuComponent,
            null,
            Injector.create({
                providers: [
                    { provide: OverlayRef, useValue: overlayRef },
                    { provide: LANGUAGE_SWITCHER_MENU_DATA, useValue: languageSwitcherMenuData },
                ],
                parent: this.injector,
            }),
        );
        overlayRef.attach(portal);
    }

    private createPositionStrategy(elementRef?: ElementRef) {
        if (elementRef) {
            return this.overlay.position
                .flexibleConnectedTo(elementRef)
                .withPositions([
                    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
                    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
                ])
                .withPush(false)
                .withFlexibleDimensions(false);
        } else {
            return this.overlay.position.global().centerHorizontally().centerVertically();
        }
    }
}
