import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import {
    CommonMessages,
    ConnectCardLoginEvent,
    DeviceService,
    DynamicHtmlDirective,
    ListItem,
    RememberMeConfig,
    TrackingDirective,
    ViewTemplateForClient,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ReCaptchaComponent, ReCaptchaValueAccessorDirective } from '@frontend/vanilla/features/recaptcha';
import { FormFieldComponent, NumberOnlyDirective, ValidationHelperService } from '@frontend/vanilla/shared/forms';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginTrackingService } from '../login-tracking.service';
import { LoginService } from '../login.service';
import { RememberMeComponent } from '../remember-me.component';

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
        IconCustomComponent,
    ],
    selector: 'lh-connect-card-login-option',
    templateUrl: 'connect-card-login-option.component.html',
    styles: [
        `
            input:-webkit-autofill {
                transition: 0.01s;
            }
        `,
    ],
})
export class ConnectCardLoginOptionComponent implements OnInit, OnDestroy {
    formGroup: UntypedFormGroup;
    showPin = false;
    text: string;

    @Input() content: ViewTemplateForClient;
    @Output() submit = new EventEmitter<ConnectCardLoginEvent>();
    @Output() onBack = new EventEmitter<void>();
    @ViewChild(ReCaptchaComponent) reCaptcha: ReCaptchaComponent;
    private destroySubject = new Subject();
    private readonly _doc = inject(DOCUMENT);

    constructor(
        public commonMessages: CommonMessages,
        public loginConfig: LoginConfig,
        public rememberMeConfig: RememberMeConfig,
        public deviceService: DeviceService,
        private formBuilder: UntypedFormBuilder,
        private validation: ValidationHelperService,
        private loginService: LoginService,
        private trackingService: LoginTrackingService,
        private webWorkerService: WebWorkerService,
    ) {}

    get v2(): boolean {
        return this.loginConfig.v2;
    }

    get reCaptchaControl(): UntypedFormControl | null {
        return this.formGroup ? (this.formGroup.get('captcharesponse') as UntypedFormControl) : null;
    }

    get loginButtonText(): string | undefined {
        if (this.formGroup.disabled) {
            return this.commonMessages.PleaseWait;
        }

        return this.loginConfig.connectCardVersion === 1 ? this.content.form.loginbutton?.label : this.content.form.connectloginbutton?.label;
    }

    ngOnInit() {
        this.text = this.content.form?.connectcardoption?.values?.find((e: ListItem) => e.value === 'text')?.text || '';
        this.formGroup = this.formBuilder.group({
            connectCardNumber: this.formBuilder.control('', [...this.validation.createValidators('connectcardnumber')]),
            pin: this.formBuilder.control('', [...this.validation.createValidators('pin')]),
            captcharesponse: this.formBuilder.control(''),
            rememberme: this.formBuilder.control(false),
        });

        this.trackingService.trackTabbedLoginAction({
            actionEvent: 'load',
            locationEvent: 'connect card login screen',
            eventDetails: 'connect card login screen',
        });
        this.loginService.onLoginFailed.pipe(takeUntil(this.destroySubject)).subscribe(() => this.handleLoginFailed());
    }

    ngOnDestroy() {
        this.destroySubject.next(null);
    }

    async login(evt: Event) {
        evt.preventDefault();

        if (this.loginConfig.recaptchaEnterpriseEnabled) {
            await this.reCaptcha.execute();
        }

        this.submit.emit(this.formGroup.value);
    }

    onBackClick() {
        this.trackingService.trackTabbedLoginAction({
            actionEvent: 'back',
            locationEvent: 'connect card login screen',
            eventDetails: 'connect card login screen',
        });
        this.onBack.emit();
    }

    togglePin() {
        this.showPin = !this.showPin;
    }

    connectCardBlur() {
        if (this.deviceService.isiOS) {
            const connectCardNumberElement = this._doc.getElementsByName('connectCardNumber')[0] as HTMLInputElement;
            const pinElement = this._doc.getElementsByName('pin')[0] as HTMLInputElement;

            if (connectCardNumberElement && pinElement) {
                this.createInputCheckInterval(connectCardNumberElement, pinElement);
            }
        }
    }

    private handleLoginFailed() {
        this.formGroup.get('connectCardNumber')?.markAsTouched();
        this.formGroup.get('pin')?.markAsTouched();
        this.reCaptcha.reload();

        if (this.reCaptcha.isEnabled()) {
            this.trackingService.trackRecaptchaShown();
        }

        this.trackTabbedConnectCardLoginFailed();
    }

    private createInputCheckInterval(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement) {
        const usernameControlValue = this.formGroup.controls[usernameInput.name]?.value;
        const passwordControlValue = this.formGroup.controls[passwordInput.name]?.value;

        if (!usernameControlValue && !this.webWorkerService.getWorker(WorkerType.ConnectCardLoginOptionInterval)) {
            this.webWorkerService.createWorker(WorkerType.ConnectCardLoginOptionInterval, { interval: 500 }, () =>
                this.triggerInputValueChange(usernameInput, WorkerType.ConnectCardLoginOptionInterval),
            );
        }

        if (!passwordControlValue && !this.webWorkerService.getWorker(WorkerType.PinLoginOptionInterval)) {
            this.webWorkerService.createWorker(WorkerType.PinLoginOptionInterval, { interval: 500 }, () =>
                this.triggerInputValueChange(passwordInput, WorkerType.PinLoginOptionInterval),
            );
        }
    }

    private triggerInputValueChange(htmlElement: HTMLInputElement, workerType: WorkerType) {
        const value = htmlElement.value;
        const formControlValue = this.formGroup.controls[htmlElement.name]?.value;

        if (value?.length > 0 && !formControlValue) {
            const event = this._doc.createEvent('TextEvent');
            event.initEvent('textInput', true, true);
            htmlElement.dispatchEvent(event);

            this.formGroup.controls[htmlElement.name]?.setValue(value);
            this.webWorkerService.removeWorker(workerType);
        }
    }

    private trackTabbedConnectCardLoginFailed() {
        const form = this.content.form;
        const trackFormFields = [
            { formField: this.formGroup.get('connectCardNumber'), trackFieldName: 'Valid Card Number' },
            { formField: this.formGroup.get('pin'), trackFieldName: '4 digit PIN' },
        ];
        this.trackingService.trackTabbedLoginFailed(trackFormFields, form && form.connectcardoption?.id);
    }
}
