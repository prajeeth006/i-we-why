import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Logger, Page, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';

import { RecaptchaEnterpriseComponent } from './recaptcha-enterprise.component';
import { ReCaptchaConfig } from './recaptcha.client-config';

/**
 * @whatItDoes Renders google reCaptcha.
 *
 * @howToUse
 * ### NEW - Basic reCAPTCHA Enterprise usage
 *
 * ```
 * <form #form="ngForm" novalidate (submit)="submit()">
 *
 *     <vn-re-captcha [(ngModel)]="model.captchaResponse" area="Test" name="reCaptcha" />
 *     <button type="submit" [disabled]="!form.valid">Submit<button>
 * </form>
 * ```
 *
 * ```
 * @Component()
 * export class SomeFormComponent {
 *     @ViewChild(ReCaptchaComponent, { static: false }) reCaptcha: ReCaptchaComponent;
 *
 *     async submit() {
 *         await this.reCaptcha.execute();
 *
 *         // submit the form and evaluate result
 *     }
 * }
 * ```
 *
 * ### Basic reCaptcha usage with validation message
 *
 * ```
 * <form #form="ngForm" novalidate (submit)="submit()">
 *     <vn-re-captcha [noValidate]="true" area="Test" [(ngModel)]="model.captchaResponse" name="reCaptcha" #reCaptcha="ngModel" />
 *     <div id="reCaptchaMessage" *ngIf="(form.submitted || reCaptcha.touched) && reCaptcha.errors">
 *         <div *ngIf="reCaptcha.errors.verification">{{reCaptcha.errors.verification.message}}</div>
 *     </div>
 *     <button type="submit" [disabled]="!form.valid">Submit<button>
 * </form>
 * ```
 *
 * ```
 * @Component()
 * export class SomeFormComponent {
 *     @ViewChild(ReCaptchaComponent, { static: false }) reCaptcha: ReCaptchaComponent;
 *
 *     submit() {
 *         this.submitFormToApi().subscribe(data => {
 *             // success!
 *         }, data => {
 *             // error
 *             if(data.reCaptchaError) {
 *                 // reCaptcha was enabled on the server after form was rendered, but before it was submitted
 *                 this.reCaptcha.reload();
 *             } else {
 *                 // other form errors or unexpected error
 *                 this.reCaptcha.reset();
 *             }
 *         })
 *     }
 *
 *     private submitFormToApi() {
 *         // submit the form
 *     }
 * }
 * ```
 *
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [RecaptchaEnterpriseComponent, CommonModule, FormsModule],
    selector: 'vn-re-captcha',
    templateUrl: 'recaptcha.html',
})
export class ReCaptchaComponent implements OnInit {
    @Input() area: string;
    @Input() tabIndex: number;

    @Output() resolved = new EventEmitter<string | null>();

    @ViewChild(RecaptchaEnterpriseComponent) set componentInstance(instance: RecaptchaEnterpriseComponent) {
        if (instance) {
            this.recaptchaEnterpriseComponent = instance;
            this.initialized.next(true);
        }
    }

    isEnabled = signal<boolean>(false);
    initialized = new BehaviorSubject<boolean>(false);
    model: any;
    enabled: boolean;
    recaptchaEnterpriseComponent: RecaptchaEnterpriseComponent;

    constructor(
        public config: ReCaptchaConfig,
        public page: Page,
        private apiService: SharedFeaturesApiService,
        private logger: Logger,
    ) {}

    async ngOnInit() {
        await firstValueFrom(this.config.whenReady);

        this.enabled = await this.getIsEnabled();
        this.isEnabled.set(this.enabled);
    }

    /**
     * Resets the reCaptcha.
     */
    reset() {
        if (this.recaptchaEnterpriseComponent) {
            this.recaptchaEnterpriseComponent.reset();
        }

        this.resolved.next(null);
    }

    /**
     * Executes reCaptcha. This method returns a promise that resolves when reCaptcha response is received.
     */
    async execute(): Promise<string | null> {
        await firstValueFrom(this.config.whenReady);

        if (!this.enabled) {
            this.enabled = await this.getIsEnabled();
        }

        if (this.enabled) {
            await firstValueFrom(
                this.initialized.pipe(
                    timeout(2000),
                    filter((ready: boolean) => ready),
                ),
            ).catch((error: unknown) => {
                this.logger.errorRemote('RecaptchaEnterprise initialization failed.', error);
            });

            if (this.recaptchaEnterpriseComponent) {
                this.recaptchaEnterpriseComponent.execute();

                return await firstValueFrom(this.resolved);
            }

            this.logger.errorRemote('RecaptchaEnterprise is enabled but component was not ready to execute.', null);
        }

        return Promise.resolve(null);
    }

    /**
     * Rechecks whether the reCaptcha should be enabled and shows/hides it based on the result.
     * It will also reset the reCaptcha.
     */
    async reload() {
        const newValue = await this.getIsEnabled();

        if (this.isEnabled() === newValue) {
            this.reset();
        }

        this.isEnabled.set(newValue);
    }

    onResolved(response: string) {
        this.resolved.next(response);
    }

    private async getIsEnabled(): Promise<boolean> {
        return firstValueFrom<boolean>(this.apiService.get('recaptcha/enabled', { area: this.area }).pipe(map((data: any) => data.enabled)));
    }
}
