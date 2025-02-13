import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import {
    CommonMessages,
    DeviceFingerPrint,
    DeviceFingerprintService,
    LoginType,
    UserEvent,
    UserLoginEvent,
    UserService,
    trackByItem,
} from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { ValidationHelperService } from '@frontend/vanilla/shared/forms';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { Subject, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LoginContentService } from '../login-content.service';
import { LoginFailedEvent } from '../login.models';
import { LoginService } from '../login.service';
import { BetstationLoginTrackingService } from './betstation-login-tracking.service';
import { CARD_NUMBER } from './betstation-login.models';
import { BetstationLoginService } from './betstation-login.service';

@Component({
    standalone: true,
    imports: [CommonModule, LhHeaderBarComponent, ReactiveFormsModule, ImageComponent],
    selector: 'vn-betstation-login-card-pin',
    templateUrl: 'betstation-login-card-pin.html',
})
export class BetstationLoginCardPinComponent implements OnInit, OnDestroy {
    formGroup: UntypedFormGroup;
    digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0];
    errorMessage: string;
    readonly trackByItem = trackByItem;

    private deviceFingerPrint: DeviceFingerPrint;
    private destroySubject = new Subject<any>();

    constructor(
        public loginConfig: LoginConfig,
        public loginContentService: LoginContentService,
        public commonMessages: CommonMessages,
        private loginService: LoginService,
        private betstationLoginService: BetstationLoginService,
        private deviceFingerprintService: DeviceFingerprintService,
        private formBuilder: UntypedFormBuilder,
        private user: UserService,
        private overlayRef: OverlayRef,
        private validation: ValidationHelperService,
        private trackingService: BetstationLoginTrackingService,
        @Inject(CARD_NUMBER) public cardNumber: String,
    ) {}

    ngOnInit() {
        this.trackingService.trackLoginPinShown();

        this.deviceFingerPrint = this.deviceFingerprintService.get();

        this.formGroup = this.formBuilder.group({
            connectCardNumber: this.formBuilder.control(this.cardNumber, [Validators.required]),
            pin: this.formBuilder.control('', [...this.validation.createValidators('pin')]),
        });

        merge(
            this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)),
            this.loginService.onLoginFailed.pipe(
                filter((e: LoginFailedEvent) => !e.reason?.errorValues?.some((x: any) => x.key === 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK')),
            ),
        )
            .pipe(takeUntil(this.destroySubject))
            .subscribe(() => {
                this.close();
            });

        this.betstationLoginService.onIncorrectPin.subscribe((message: string) => {
            this.errorMessage = message;
        });
    }

    ngOnDestroy() {
        this.destroySubject.next(null);
    }

    digitClick(digit: number) {
        const newValue: string = this.formGroup.controls.pin?.value + digit;

        if (digit < 0) {
            this.formGroup.controls.pin?.setValue('');
        } else {
            if (newValue.length > 4) return;
            this.formGroup.controls.pin?.setValue(newValue);
        }
    }

    login(evt: Event) {
        evt.preventDefault();
        this.formGroup.disable();
        const model = this.formGroup.value;
        model.fingerprint = this.deviceFingerPrint;
        model.loginType = LoginType.ConnectCard;

        this.betstationLoginService.gridConnectLogin(model, () => {
            this.formGroup.enable();
            this.formGroup.controls.pin?.setValue('');
            this.formGroup.controls.pin?.markAsUntouched();
        });
    }

    close() {
        this.overlayRef.detach();
    }
}
