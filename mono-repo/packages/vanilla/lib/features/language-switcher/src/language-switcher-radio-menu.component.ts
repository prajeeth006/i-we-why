import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CommonMessages, NativeAppService, NativeEventType, NavigationService, Page, trackByProp } from '@frontend/vanilla/core';

import { LanguageItemComponent } from './language-item.component';
import { LanguageSwitcherTrackingService } from './language-switcher-tracking.service';
import { LanguageSwitcherItem } from './language-switcher.models';
import { LanguageSwitcherService } from './language-switcher.service';

@Component({
    standalone: true,
    imports: [CommonModule, LanguageItemComponent],
    selector: 'vn-language-switcher-radio-menu',
    templateUrl: 'language-switcher-radio-menu.html',
})
export class LanguageSwitcherRadioMenuComponent implements OnInit {
    readonly trackByNativeName = trackByProp<LanguageSwitcherItem>('nativeName');

    constructor(
        public languageSwitcherService: LanguageSwitcherService,
        public commonMessages: CommonMessages,
        private page: Page,
        private languageSwitcherTrackingService: LanguageSwitcherTrackingService,
        private nativeAppService: NativeAppService,
        private navigationService: NavigationService,
    ) {}

    ngOnInit() {
        this.languageSwitcherTrackingService.trackDisplay(true);
    }

    change(lang: LanguageSwitcherItem) {
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.LANGUAGEUPDATED,
            parameters: { newLanguage: lang.culture, routeValue: lang.routeValue },
        });

        this.languageSwitcherTrackingService.trackChangeLanguage(true, this.page.lang, lang.routeValue).then(() => {
            this.navigationService.goTo(lang.url);
        });
    }
}
