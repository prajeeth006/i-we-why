import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DsSwitch } from '@frontend/ui/switch';
import { DeviceService, FastLoginValue } from '@frontend/vanilla/core';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { NgxFloatUiModule } from 'ngx-float-ui';

import { LoginContentService } from '../login-content.service';
import { LoginTrackingService } from '../login-tracking.service';
import { FastLoginField } from '../login.models';
import { LoginService } from '../login.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormatPipe, PopperContentComponent, NgxFloatUiModule, DsSwitch],
    selector: 'lh-fast-login',
    templateUrl: 'fast-login.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FastLoginComponent,
            multi: true,
        },
    ],
})
export class FastLoginComponent implements OnInit, ControlValueAccessor {
    get value(): FastLoginValue {
        return this.innerValue;
    }

    set value(value: FastLoginValue) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.onChange(value);
        }
    }

    isDisabled: boolean;
    fields: FastLoginField[] = [];
    fastLoginValues = FastLoginValue;
    fastLoginIconClasses: Record<string, string> = {
        isTouchIDEnabled: 'theme-fingerprint',
        isFaceIDEnabled: 'theme-face-id',
    };

    private innerValue: FastLoginValue;

    constructor(
        public loginConfig: LoginConfig,
        public loginService: LoginService,
        public loginContentService: LoginContentService,
        private deviceService: DeviceService,
        private trackingService: LoginTrackingService,
    ) {}

    onChange = (value: FastLoginValue) => {
        this.setCheckedItem(value);
    };

    onTouched = () => {};

    ngOnInit() {
        const toggleFields: FastLoginField[] = [
            {
                text: this.loginContentService.content.form.fastlogindisabled.label,
                value: FastLoginValue.FastLoginDisabled,
            },
        ];

        this.addToggleFields(toggleFields);
        this.fields = toggleFields;
    }

    writeValue(obj: FastLoginValue) {
        if (obj !== this.value) {
            this.value = obj;
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean) {
        this.isDisabled = isDisabled;
    }

    onValueChange(value: any) {
        this.value = value;

        if (this.loginConfig.v2) {
            this.trackingService.trackFastLoginToggle(value);
        }
    }

    private setCheckedItem(value: FastLoginValue) {
        if (this.fields) {
            this.fields.forEach((element: FastLoginField) => (element.checked = element.value === value));
        }
    }

    private addToggleFields(toggleFields: FastLoginField[]) {
        if (this.loginService.keepMeSignedInToggleVisible) {
            toggleFields.unshift({
                text: this.loginContentService.content.form.autologinenabled.label,
                value: FastLoginValue.KeepMeSignedInEnabled,
            });
        }
        if (this.loginService.faceIdToggleVisible && this.loginService.touchIdToggleVisible) {
            if (this.deviceService.isiOS) {
                this.addFaceIdField(toggleFields);
            } else {
                this.addTouchIdField(toggleFields);
            }
        } else if (this.loginService.touchIdToggleVisible) {
            this.addTouchIdField(toggleFields);
        } else if (this.loginService.faceIdToggleVisible) {
            this.addFaceIdField(toggleFields);
        }
    }

    private addFaceIdField(toggleFields: FastLoginField[]) {
        toggleFields.unshift({
            text: this.loginContentService.content.form.faceid.label,
            value: FastLoginValue.IsFaceIDEnabled,
        });
    }

    private addTouchIdField(toggleFields: FastLoginField[]) {
        toggleFields.unshift({
            text: this.loginContentService.content.form.touchid
                ? this.loginContentService.content.form.touchid.label
                : this.loginContentService.content.form.fingerprint.label,
            value: FastLoginValue.IsTouchIDEnabled,
        });
    }
}
