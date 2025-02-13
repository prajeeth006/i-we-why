import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { CommonMessages, DeviceService, NativeAppService, NativeEventType, NavigationService, Page, trackByProp } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LanguageItemComponent } from './language-item.component';
import { LanguageSwitcherTrackingService } from './language-switcher-tracking.service';
import { LanguageSwitcherItem, LanguageSwitcherMenuData } from './language-switcher.models';
import { LanguageSwitcherService } from './language-switcher.service';
import { LANGUAGE_SWITCHER_MENU_DATA } from './language-switcher.tokens';

@Component({
    standalone: true,
    imports: [CommonModule, HeaderBarComponent, LanguageItemComponent],
    selector: 'vn-language-switcher-menu',
    templateUrl: 'language-switcher-menu.html',
})
export class LanguageSwitcherMenuComponent implements OnInit, OnDestroy {
    languages: LanguageSwitcherItem[];
    gridRows: number;
    readonly trackByNativeName = trackByProp<LanguageSwitcherItem>('nativeName');

    private unsubscribe = new Subject<void>();

    constructor(
        public commonMessages: CommonMessages,
        public languageSwitcherService: LanguageSwitcherService,
        private overlayRef: OverlayRef,
        private page: Page,
        private trackingService: LanguageSwitcherTrackingService,
        private navigation: NavigationService,
        private nativeAppService: NativeAppService,
        private deviceService: DeviceService,
        @Inject(LANGUAGE_SWITCHER_MENU_DATA) private languageSwitcherMenuData: LanguageSwitcherMenuData,
    ) {}

    ngOnInit() {
        this.trackingService.trackDisplay(this.languageSwitcherMenuData.openedByLanguageSelector);

        this.languageSwitcherService
            .getLanguageSwitcherData()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((languages: LanguageSwitcherItem[]) => {
                this.languages = languages;
            });

        this.gridRows = this.setGridRows();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    close() {
        this.overlayRef.detach();
    }

    change(lang: LanguageSwitcherItem) {
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.LANGUAGEUPDATED,
            parameters: { newLanguage: lang.culture, routeValue: lang.routeValue },
        });

        this.trackingService.trackChangeLanguage(this.languageSwitcherMenuData.openedByLanguageSelector, this.page.lang, lang.routeValue).then(() => {
            this.navigation.goTo(lang.url);
        });
    }

    private setGridRows(): number {
        if (this.languages?.length === 6) {
            return 3;
        }

        if ([7, 8].includes(this.languages?.length)) {
            return 4;
        }

        const denominator = this.deviceService.isMobile || this.deviceService.isTablet ? 2 : 3;

        if (denominator === 3 && [11, 12].includes(this.languages?.length)) {
            return 4;
        }

        return Math.ceil(this.languages?.length / denominator) > 5 ? Math.ceil(this.languages?.length / denominator) : 5;
    }
}
