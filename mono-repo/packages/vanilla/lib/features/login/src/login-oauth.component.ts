import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
    CommonMessages,
    CookieName,
    CookieService,
    DeviceFingerPrint,
    DeviceFingerprintService,
    DynamicHtmlDirective,
    LoginOAuthDialogData,
    LoginRedirectInfo,
    LoginResponseHandlerService,
    LoginStoreService,
    MessageLifetime,
    MessageQueueService,
    MessageScope,
    NavigationService,
    ToastrQueueService,
    ToastrSchedule,
    ToastrType,
    TrackingDirective,
    UserEvent,
    UserLoggingInEvent,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';
import { ReCaptchaComponent, ReCaptchaValueAccessorDirective } from '@frontend/vanilla/features/recaptcha';
import { FormFieldComponent, ValidationHelperService, Validators } from '@frontend/vanilla/shared/forms';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { Subject, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LoginContentService } from './login-content.service';
import { LoginResourceService } from './login-resource.service';
import { LoginTrackingService } from './login-tracking.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ReCaptchaComponent,
        LhHeaderBarComponent,
        MessagePanelComponent,
        ReCaptchaValueAccessorDirective,
        DynamicHtmlDirective,
        TrackingDirective,
        FormFieldComponent,
        IconCustomComponent,
    ],
    selector: 'lh-login-oauth',
    templateUrl: 'login-oauth.html',
})
export class LoginOAuthComponent implements OnInit, OnDestroy {
    formGroup: UntypedFormGroup;
    showPassword = false;

    private deviceFingerPrint: DeviceFingerPrint;
    private unsubscribe = new Subject<void>();

    constructor(
        public loginContentService: LoginContentService,
        public loginConfig: LoginConfig,
        public user: UserService,
        public commonMessages: CommonMessages,
        public navigation: NavigationService,
        private loginResource: LoginResourceService,
        private loginStore: LoginStoreService,
        private formBuilder: UntypedFormBuilder,
        private loginResponseHandlerService: LoginResponseHandlerService,
        private validationHelper: ValidationHelperService,
        private messageQueue: MessageQueueService,
        private toastrQueueService: ToastrQueueService,
        private deviceFingerprintService: DeviceFingerprintService,
        private dialogRef: MatDialogRef<LoginOAuthComponent>,
        private trackingService: LoginTrackingService,
        private cookieService: CookieService,
        @Inject(MAT_DIALOG_DATA) private data: LoginOAuthDialogData,
    ) {}

    get disabled(): boolean {
        return this.formGroup.disabled;
    }

    get reCaptchaControl(): UntypedFormControl | null {
        return this.formGroup ? (this.formGroup.get('captcharesponse') as UntypedFormControl) : null;
    }

    ngOnInit() {
        const isPostLogin = this.cookieService.get(CookieName.LoginHint);
        this.trackingService.trackLoginWithProvider(this.data.oAuthProvider, {
            actionEvent: 'Displayed',
            positionEvent: 'link/login screen',
            eventDetails: `User is detected as existing and is asked to link the account with ${this.data.oAuthProvider} login`,
        });
        this.trackingService.trackLoginWithProvider(this.data.oAuthProvider, {
            actionEvent: 'Message Displayed',
            positionEvent: isPostLogin ? 'Post Login' : 'link/login screen',
            eventDetails: this.loginContentService.content.messages?.OAuthIdInfoText || '',
        });
        this.formGroup = this.formBuilder.group({
            username: this.formBuilder.control(this.loginStore.LastVisitor || '', this.validationHelper.createValidators('usernameLogin')),
            password: this.formBuilder.control('', [Validators.required]),
            captcharesponse: this.formBuilder.control(''),
        });

        this.deviceFingerPrint = this.deviceFingerprintService.get();
        this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.Login });
        this.messageQueue.addInfo(this.loginContentService.content.messages?.OAuthIdInfoText || '', MessageLifetime.Single, MessageScope.Login);

        merge(this.navigation.locationChange, this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => this.closeDialog());
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    close() {
        this.trackingService.trackLoginWithProvider(this.data.oAuthProvider, {
            actionEvent: 'Close (x) - Clicked',
            positionEvent: 'link/login screen',
            eventDetails: 'User is detected as existing clicks on Close(x) on Link/Login Screen',
        });
        this.closeDialog();
        this.navigation.goToLastKnownProduct();
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    login() {
        if (!this.formGroup) {
            return;
        }

        this.trackingService.trackLoginWithProvider(this.data.oAuthProvider, {
            actionEvent: 'Link  Accounts and Login CTA - Clicked',
            positionEvent: 'link/login screen',
            eventDetails: 'User is detected as existing clicks on Link accounts and Login CTA on Link/Login Screen',
        });

        this.formGroup.disable();
        this.user.triggerEvent(new UserLoggingInEvent());
        const model = this.formGroup.value;
        Object.assign(model, { fingerprint: this.deviceFingerPrint }, this.data);

        this.loginResource.login(model, { showSpinner: false, messageQueueScope: MessageScope.Login }).subscribe({
            next: (data) => {
                this.loginResponseHandlerService.handle(data).then((redirectInfo: LoginRedirectInfo) => {
                    this.toastrQueueService.add(ToastrType.LinkAccount, { schedule: ToastrSchedule.AfterNextNavigation });
                    this.dialogRef.close();
                    redirectInfo.goTo();
                });
            },
            error: (rejected) => {
                this.trackingService.trackLoginWithProvider(this.data.oAuthProvider, {
                    actionEvent: 'Error Message Displayed',
                    positionEvent: 'link/login screen',
                    eventDetails: rejected?.posApiErrorMessage || '',
                });
                this.formGroup.get('password')?.setValue('');
                this.formGroup.get('password')?.markAsTouched();
                this.formGroup.enable();
            },
        });
    }

    private closeDialog() {
        this.dialogRef.close();
        this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.Login });
    }
}
