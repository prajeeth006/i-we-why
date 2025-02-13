import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import {
    CommonMessages,
    ConnectCardLoginEvent,
    DeviceService,
    DynamicHtmlDirective,
    FormElementTemplateForClient,
    MenuContentItem,
    RememberMeConfig,
    TrackingDirective,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { ReCaptchaComponent, ReCaptchaValueAccessorDirective } from '@frontend/vanilla/features/recaptcha';
import { FormFieldComponent, NumberOnlyDirective, ValidationHelperService } from '@frontend/vanilla/shared/forms';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginTrackingService } from '../login-tracking.service';
import { LoginConfig } from '../login.client-config';
import { FormFieldTracking } from '../login.models';
import { LoginService } from '../login.service';
import { RememberMeComponent } from '../remember-me/remember-me.component';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormFieldComponent,
        ReCaptchaComponent,
        RememberMeComponent,
        ReCaptchaValueAccessorDirective,
        DynamicHtmlDirective,
        TrackingDirective,
        NumberOnlyDirective,
        ImageComponent,
    ],
    selector: 'vn-connect-card-login',
    templateUrl: 'connect-card-login.component.html',
    styles: [
        `
            input:-webkit-autofill {
                transition: 0.01s;
            }
        `,
    ],
})
export class ConnectCardLoginComponent implements OnInit, OnDestroy {
    @Input() content: MenuContentItem;
    @Output() onSubmit = new EventEmitter<ConnectCardLoginEvent>();
    @Output() onBack = new EventEmitter<void>();

    @ViewChild(ReCaptchaComponent) reCaptcha: ReCaptchaComponent;
    @ViewChild('connectCardNumber') connectCardNumberElement: ElementRef<HTMLInputElement>;
    @ViewChild('pin') pinElement: ElementRef<HTMLInputElement>;

    form: FormGroup;
    showPin: boolean;
    text: string; // Initialize

    private loginButton: FormElementTemplateForClient | undefined;
    private destroySubject = new Subject();
    private readonly _doc = inject(DOCUMENT);

    constructor(
        public commonMessages: CommonMessages,
        public loginConfig: LoginConfig,
        public rememberMeConfig: RememberMeConfig,
        public deviceService: DeviceService,
        private formBuilder: FormBuilder,
        private formGroupDirective: FormGroupDirective,
        private validationHelperService: ValidationHelperService,
        private loginService: LoginService,
        private loginTrackingService: LoginTrackingService,
        private webWorkerService: WebWorkerService,
    ) {}

    get v2(): boolean {
        return this.loginConfig.connectCardVersion === 2;
    }

    get loginButtonText(): string | undefined {
        if (this.form.disabled) {
            return this.commonMessages.PleaseWait;
        }

        return this.v2 ? this.loginButton?.label : this.content.resources.loginButtonText;
    }

    get connectCardNumberForm(): FormElementTemplateForClient | undefined {
        return this.content.children.find((item: FormElementTemplateForClient) => item.id === 'connectcardnumber');
    }

    get connectCardPinForm(): FormElementTemplateForClient | undefined {
        return this.content.children.find((item: FormElementTemplateForClient) => item.id === 'connectcardpin');
    }

    get connectCardLoginButtonForm(): FormElementTemplateForClient | undefined {
        return this.content.children.find((item: FormElementTemplateForClient) => item.id === 'connectcardloginbutton');
    }

    get useCredentialsButton(): FormElementTemplateForClient | undefined {
        return this.content.children.find((item: FormElementTemplateForClient) => item.id === 'usecredentialsbutton');
    }

    ngOnInit() {
        this.form = this.formGroupDirective.form;

        this.form.addControl(
            'connectCardNumber',
            this.formBuilder.control('', [...this.validationHelperService.createValidators('connectcardnumber')]),
        );
        this.form.addControl('pin', this.formBuilder.control('', [...this.validationHelperService.createValidators('pin')]));
        this.form.addControl('captcharesponse', this.formBuilder.control(''));
        this.form.addControl('rememberme', this.formBuilder.control(false));

        this.loginTrackingService.trackTabbedLoginAction({
            actionEvent: 'load',
            locationEvent: 'connect card login screen',
            eventDetails: 'connect card login screen',
        });

        this.loginButton = this.content.children.find((item: FormElementTemplateForClient) => item.id === 'connectcardloginbutton');

        this.loginService.loginFailed.pipe(takeUntil(this.destroySubject)).subscribe(async () => await this.handleLoginFailed());
    }

    ngOnDestroy() {
        this.destroySubject.next(null);
        this.webWorkerService.removeWorker(WorkerType.ConnectCardCheckInterval);
        this.webWorkerService.removeWorker(WorkerType.PinCheckInterval);
    }

    async login(event: Event) {
        event.preventDefault();

        if (this.loginConfig.isReCaptchaEnabled) {
            await this.reCaptcha.execute();
        }

        this.onSubmit.emit(this.form.value);
    }

    onBackClick() {
        this.onBack.emit();
        this.loginTrackingService.trackConnectCardBackClick();
    }

    togglePin() {
        this.showPin = !this.showPin;
    }

    connectCardBlur() {
        if (this.deviceService.isiOS) {
            if (this.connectCardNumberElement && this.pinElement) {
                const connectCardNumber = this.form.controls[this.connectCardNumberElement.nativeElement.name]!.value;
                const pin = this.form.controls[this.pinElement.nativeElement.name]!.value;

                if (!connectCardNumber) {
                    this.webWorkerService.createWorker(WorkerType.ConnectCardCheckInterval, { interval: 500 }, () =>
                        this.triggerInputValueChange(this.connectCardNumberElement.nativeElement, WorkerType.ConnectCardCheckInterval),
                    );
                }

                if (!pin) {
                    this.webWorkerService.createWorker(WorkerType.PinCheckInterval, { interval: 500 }, () =>
                        this.triggerInputValueChange(this.connectCardNumberElement.nativeElement, WorkerType.PinCheckInterval),
                    );
                }
            }
        }
    }

    private triggerInputValueChange(htmlElement: HTMLInputElement, workerType: WorkerType) {
        if (htmlElement.value?.length > 0 && !this.form.controls[htmlElement.name]?.value) {
            const event = this._doc.createEvent('TextEvent');

            event.initEvent('textInput', true, true);
            htmlElement.dispatchEvent(event);

            this.form.controls[htmlElement.name]?.setValue(htmlElement.value);
            this.webWorkerService.removeWorker(workerType);
        }
    }

    private async handleLoginFailed() {
        this.form.get('connectCardNumber')?.markAsTouched();
        this.form.get('pin')?.markAsTouched();

        await this.reCaptcha.reload();

        if (this.reCaptcha.isEnabled()) {
            this.loginTrackingService.trackRecaptchaShown();
        }

        const trackFormFields: FormFieldTracking[] = [
            { formField: this.form.get('connectCardNumber'), trackFieldName: 'Valid Card Number' },
            { formField: this.form.get('pin'), trackFieldName: '4 digit PIN' },
        ];

        this.loginTrackingService.trackTabbedLoginFailed(trackFormFields, this.content.name);
    }
}
