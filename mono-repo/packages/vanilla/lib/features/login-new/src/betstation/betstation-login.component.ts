import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';

import {
    CommonMessages,
    DeviceFingerPrint,
    DeviceFingerprintService,
    FormElementTemplateForClient,
    LoginType,
    UserLoginEvent,
    UserService,
    trackByItem,
} from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { NumberOnlyDirective, ValidationHelperService } from '@frontend/vanilla/shared/forms';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { Subject, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LoginTrackingService } from '../login-tracking.service';
import { LoginConfig } from '../login.client-config';
import { CARD_NUMBER, LoginFailedEvent } from '../login.models';
import { LoginService } from '../login.service';

@Component({
    standalone: true,
    imports: [CommonModule, LhHeaderBarComponent, ReactiveFormsModule, NumberOnlyDirective, ImageComponent],
    selector: 'vn-betstation-login',
    templateUrl: 'betstation-login.html',
})
export class BetstationLoginCardPinComponent implements OnInit, OnDestroy {
    form: FormGroup;
    digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0];
    readonly trackByItem = trackByItem;
    private deviceFingerPrint: DeviceFingerPrint;
    private destroySubject = new Subject<void>();
    errorMessage: string;

    get betstationPinForm(): FormElementTemplateForClient | undefined {
        return this.loginConfig.betstation.children.find((item: FormElementTemplateForClient) => item.id === 'betstationpin');
    }

    get betstationLoginButtonForm(): FormElementTemplateForClient | undefined {
        return this.loginConfig.betstation.children.find((item: FormElementTemplateForClient) => item.id === 'betstationloginbutton');
    }

    constructor(
        public loginConfig: LoginConfig,
        private formGroupDirective: FormGroupDirective,
        public commonMessages: CommonMessages,
        public loginService: LoginService,
        private deviceFingerprintService: DeviceFingerprintService,
        private formBuilder: UntypedFormBuilder,
        private user: UserService,
        private overlayRef: OverlayRef,
        private validationHelperService: ValidationHelperService,
        private trackingService: LoginTrackingService,
        @Inject(CARD_NUMBER) public cardNumber: string,
    ) {}

    ngOnInit() {
        this.form = this.formGroupDirective.form;
        this.deviceFingerPrint = this.deviceFingerprintService.get();

        this.trackingService.trackLoginPinShown();

        this.form.addControl('connectCardNumber', this.formBuilder.control(this.cardNumber, [Validators.required]));
        this.form.addControl('pin', this.formBuilder.control('', [...this.validationHelperService.createValidators('pin')]));

        merge(
            this.user.events.pipe(filter((e) => e instanceof UserLoginEvent)),
            this.loginService.loginFailed.pipe(
                filter(
                    (event: LoginFailedEvent) =>
                        !event.reason['errorValues']?.some((x: any) => x.key === 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK'),
                ),
            ),
        )
            .pipe(takeUntil(this.destroySubject))
            .subscribe(() => {
                this.close();
            });
    }

    ngOnDestroy() {
        this.destroySubject.next();
    }

    digitClick(digit: number) {
        const newValue: string = this.form.controls['pin']!.value + digit;

        if (digit < 0) {
            this.form.controls['pin']!.setValue('');
        } else if (newValue.length < 5) {
            this.form.controls['pin']!.setValue(newValue);
        }
    }

    login(event: Event) {
        event.preventDefault();

        this.form.disable();
        this.form.value.fingerprint = this.deviceFingerPrint;
        this.form.value.loginType = LoginType.ConnectCard;

        this.loginService.gridConnectLogin(this.form.value, () => {
            this.form.enable();
            this.form.controls['pin']!.setValue('');
            this.form.controls['pin']!.markAsUntouched();
        });
    }

    close() {
        this.overlayRef.detach();
    }
}
