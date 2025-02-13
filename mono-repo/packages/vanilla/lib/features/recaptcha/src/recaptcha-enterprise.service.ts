import { Injectable, NgZone, inject } from '@angular/core';

import { Logger, Page, WINDOW } from '@frontend/vanilla/core';
import { BehaviorSubject, Subject, first } from 'rxjs';

import { ReCaptchaConfig } from './recaptcha.client-config';
import { RecaptchaProperties } from './recaptcha.models';

export const CALLBACK = 'reCaptchaLoadCallback';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RecaptchaEnterpriseService {
    action: string;

    readonly scriptLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    readonly success: Subject<string> = new Subject();
    readonly recaptchaToken: Subject<string> = new Subject();
    readonly #window = inject(WINDOW);

    private reCaptchaApi: any;
    private activeRecaptchaId: any;

    constructor(
        private zone: NgZone,
        private page: Page,
        private recaptchaConfig: ReCaptchaConfig,
        private logger: Logger,
    ) {}

    initReCaptchaAPI() {
        if (!this.reCaptchaApi) {
            this.addGlobalFunction();
            this.addScript();
        }
    }

    /**
     * Executes the reCaptcha client api with siteKey when using automatic rendering or elementId on explicit rendering.
     */
    executeRecaptcha(action: string, key?: string) {
        this.zone.runOutsideAngular(() => {
            const normalizedAction = `${action}_${this.page.domain.replace(/\./g, '').trim()}`;

            this.scriptLoaded.pipe(first((ready: boolean) => ready)).subscribe(() => {
                this.reCaptchaApi
                    .execute(key ?? this.activeRecaptchaId, { action: normalizedAction })
                    .then((token: string) => {
                        this.logger.info(`Recaptcha token received from client api for action [${normalizedAction}]: `, token);
                        this.recaptchaToken.next(token);
                    })
                    .catch((error: any) => {
                        this.logger.errorRemote(
                            `RecaptchaEnterprise script api failed to execute on client for action [${normalizedAction}]: `,
                            error,
                        );
                    });
            });
        });
    }

    renderRecaptcha(containerElement: any): any {
        try {
            this.activeRecaptchaId = this.reCaptchaApi.render(containerElement, this.getCaptchaProperties());

            return this.activeRecaptchaId;
        } catch (error: any) {
            this.logger.errorRemote('Failed rendering reCAPTCHA.', error);
        }
    }

    resetCaptcha() {
        this.zone.runOutsideAngular(() => {
            this.reCaptchaApi.reset(this.activeRecaptchaId);
        });
    }

    private addGlobalFunction() {
        (<any>window)[CALLBACK] = () => {
            this.reCaptchaApi = (<any>window).grecaptcha.enterprise;
            this.reCaptchaApi.ready(() => {
                this.scriptLoaded.next(true);
            });
        };
    }

    private addScript() {
        const elementId = 'recaptcha-enterprise';

        if (this.#window.document.getElementById(elementId)) {
            return;
        }

        const script = this.#window.document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?onload=${CALLBACK}&render=${this.recaptchaConfig.enterpriseSiteKey}&hl=${this.page.lang}`;
        script.id = 'recaptcha-enterprise';
        script.async = true;
        script.defer = true;
        this.#window.document.head.appendChild(script);
    }

    private onError(error: string) {
        this.logger.error(
            'Error while loading reCaptcha. This is usually due to wrong or not configured EnterpriseSiteKey on Dynacon and Google console.',
            error,
        );
    }

    private onExpired() {
        this.logger.info('Recaptcha expired, reloading...');
        this.resetCaptcha();
    }

    private onSuccess(token: string) {
        this.success.next(token);
    }

    private getCaptchaProperties(): RecaptchaProperties {
        return {
            'sitekey': this.recaptchaConfig.enterpriseSiteKey,
            'theme': this.recaptchaConfig.theme,
            'size': 'invisible',
            'callback': this.onSuccess.bind(this),
            'error-callback': this.onError.bind(this),
            'expired-callback': this.onExpired.bind(this),
        };
    }
}
