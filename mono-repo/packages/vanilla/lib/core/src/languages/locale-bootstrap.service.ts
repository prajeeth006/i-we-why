import { Inject, Injectable, LOCALE_ID } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { DeviceService } from '../browser/device/device.service';
import { DynamicScriptsService } from '../browser/dynamic-scripts.service';
import { AppInfoConfig } from '../client-config/app-info.client-config';
import { Page } from '../client-config/page.client-config';
import { Logger } from '../logging/logger';

@Injectable()
export class LocaleBootstrapService implements OnAppInit {
    constructor(
        @Inject(LOCALE_ID) private localeId: string,
        private log: Logger,
        private page: Page,
        private dynamicScriptsService: DynamicScriptsService,
        private deviceService: DeviceService,
        private appConfig: AppInfoConfig,
    ) {}

    onAppInit(): Promise<void> {
        return new Promise((resolve) => {
            //'en' which is equivalent to 'en-US' is already imported by default on Angular.
            if (['en', 'en-US'].includes(this.localeId) || !this.page.useBrowserLanguage) {
                resolve();
            } else {
                this.localeFile(this.localeId).then(
                    () => resolve(),
                    () => {
                        //Try to import with default parent locale as Angular does not include regions for most used languages. Eg. `es-ES` equivalent module in Angular is `es`;
                        let fallbackLocale = this.localeId;
                        if (this.localeId.includes('-')) {
                            fallbackLocale = this.localeId?.split('-')[0] || 'en';
                        }
                        this.localeFile(fallbackLocale).then(
                            () => resolve(),
                            (err: any) => {
                                this.log.errorRemote(
                                    `Failed loading angular localization data for locale ${this.localeId}. Falling back to en.`,
                                    err,
                                );
                                const defaultLocale = 'en';
                                this.localeFile(defaultLocale).then(() => resolve());
                            },
                        );
                    },
                );
            }
        });
    }

    localeFile(localeId: string) {
        //TODO: Remove hacky lcg solution when they get rid of custom path.
        const result = new RegExp(/ladbrokeuk|coral/).exec(this.appConfig.brand.toLowerCase());
        if (result && this.page.product === 'sports') {
            const path = `${result[0] == 'ladbrokeuk' ? 'ladbrokes' : result[0]}-${this.deviceService.isMobile ? 'mobile' : 'desktop'}-app`;
            return this.dynamicScriptsService.load(`/ClientDist/${path}/locales/${localeId}.js`);
        }
        return this.dynamicScriptsService.load(`/ClientDist/locales/${localeId}.js`);
    }
}
