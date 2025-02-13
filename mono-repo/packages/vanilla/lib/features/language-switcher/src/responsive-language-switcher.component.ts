import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation, inject } from '@angular/core';

import { CommonMessages, DeviceService, LanguageInfo, Page } from '@frontend/vanilla/core';
import { FlagsService } from '@frontend/vanilla/features/flags';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { firstValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';

import { LanguageItemComponent } from './language-item.component';
import { LanguageSwitcherOverlayService } from './language-switcher-overlay.service';
import { LanguageSwitcherRadioMenuComponent } from './language-switcher-radio-menu.component';
import { LanguageSwitcherTrackingService } from './language-switcher-tracking.service';
import { LanguageSwitcherConfig } from './language-switcher.client-config';
import { LanguageSwitcherItem } from './language-switcher.models';
import { SeoLanguageLinksComponent } from './seo-language-links.component';

/**
 * @whatItDoes Displays the language switcher.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, SeoLanguageLinksComponent, LanguageItemComponent, LanguageSwitcherRadioMenuComponent, IconCustomComponent],
    selector: 'vn-responsive-language-switcher',
    templateUrl: 'responsive-language-switcher.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/language-switcher/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ResponsiveLanguageSwitcherComponent implements OnInit {
    currentLanguage: LanguageSwitcherItem;
    version: number;
    showV2: boolean;

    private readonly _doc = inject(DOCUMENT);

    constructor(
        public commonMessages: CommonMessages,
        public deviceService: DeviceService,
        private page: Page,
        private elementRef: ElementRef,
        private languageSwitcherOverlayService: LanguageSwitcherOverlayService,
        private flagsService: FlagsService,
        private trackingService: LanguageSwitcherTrackingService,
        private changeDetectorRef: ChangeDetectorRef,
        private config: LanguageSwitcherConfig,
    ) {}

    async ngOnInit() {
        const currentUiLanguage = this.page.uiLanguages.find((l: LanguageInfo) => l.routeValue == this.page.lang)!;

        this.flagsService
            .find(this.page.lang)
            .pipe(first())
            .subscribe((image: string | null) => {
                this.currentLanguage = Object.assign({ image: image, isActive: true, url: '' }, currentUiLanguage);
                this.changeDetectorRef.detectChanges();
            });

        await firstValueFrom(this.config.whenReady);

        this.version = this.config.version;
    }

    openMenu() {
        this.trackingService.trackOpenLanguageSwitcherMenu();
        this.languageSwitcherOverlayService.openMenu(this.elementRef);
    }

    openRadioMenu() {
        this.trackingService.trackOpenLanguageSwitcherMenu();
        this.showV2 = !this.showV2;
        const toggleDiv = this._doc.querySelector('[menu-toggle=closed]');

        if (toggleDiv) {
            if (this.showV2) {
                toggleDiv.classList.remove('current');
                toggleDiv.classList.add('language-switcher-open');
            } else {
                toggleDiv.classList.remove('language-switcher-open');
                toggleDiv.classList.add('current');
            }
        }
    }
}
