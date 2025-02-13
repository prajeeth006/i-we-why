import { Injectable } from '@angular/core';

import { LocationChangeEvent, NavigationService, OnFeatureInit } from '@frontend/vanilla/core';
import { first, firstValueFrom } from 'rxjs';

import { RecaptchaEnterpriseService } from './recaptcha-enterprise.service';
import { ReCaptchaConfig } from './recaptcha.client-config';
import { RecaptchaAction } from './recaptcha.models';

@Injectable()
export class RecaptchaEnterpriseBootstrapService implements OnFeatureInit {
    constructor(
        private recaptchaConfig: ReCaptchaConfig,
        private recaptchaEnterpriseService: RecaptchaEnterpriseService,
        private navigationService: NavigationService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.recaptchaConfig.whenReady);

        if (this.recaptchaConfig.instrumentationOnPageLoad) {
            this.recaptchaEnterpriseService.initReCaptchaAPI();

            this.recaptchaEnterpriseService.scriptLoaded.pipe(first((ready: boolean) => ready)).subscribe(() => {
                this.recaptchaEnterpriseService.executeRecaptcha(RecaptchaAction.PageLoad, this.recaptchaConfig.enterpriseSiteKey);
            });

            this.navigationService.locationChange.subscribe((event: LocationChangeEvent) => {
                if (event.previousUrl !== event.nextUrl) {
                    this.recaptchaEnterpriseService.executeRecaptcha(RecaptchaAction.PageLoad, this.recaptchaConfig.enterpriseSiteKey);
                }
            });
        }
    }
}
