import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DsSegmentedControlModule } from '@frontend/ui/segmented-control';
import { DsSwitch } from '@frontend/ui/switch';
import { DeviceService, FastLoginField, FastLoginValue } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { NgxFloatUiModule } from 'ngx-float-ui';

import { LoginContentService } from './login-content.service';
import { LoginTrackingService } from './login-tracking.service';
import { LoginService } from './login.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormatPipe, PopperContentComponent, NgxFloatUiModule, IconCustomComponent, DsSwitch, DsSegmentedControlModule],
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
    isDisabled: boolean;
    fields: FastLoginField[] = [];
    fastLoginValues = FastLoginValue;
    fastLoginIconClasses: Record<string, string> = {
        IsTouchIDEnabled: 'theme-fingerprint',
        IsFaceIDEnabled: 'theme-face-id',
    };

    private innerValue: FastLoginValue;

    constructor(
        public loginConfig: LoginConfig,
        public loginContentService: LoginContentService,
        public loginService: LoginService,
        private deviceService: DeviceService,
        private trackingService: LoginTrackingService,
    ) {}

    private get value(): FastLoginValue {
        return this.innerValue;
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    private set value(value: FastLoginValue) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.onChange(value);
        }
    }

    onTouched = () => {};

    ngOnInit() {
        const toggleFields = [
            {
                text: this.loginContentService.content.form.fastlogindisabled?.label,
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

    private onChange = (value: FastLoginValue) => {
        this.setCheckedItem(value);
    };

    private setCheckedItem(val: FastLoginValue) {
        if (this.fields) {
            this.fields.forEach((element: FastLoginField) => {
                element.checked = element.value === val;
            });
        }
    }

    private addToggleFields(toggleFields: Array<{ text: string | undefined; value: any }>) {
        if (this.loginService.keepMeSignedInToggleVisible) {
            toggleFields.unshift({
                text: this.loginContentService.content.form.autologinenabled?.label,
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

    private addFaceIdField(toggleFields: Array<{ text: string | undefined; value: any }>) {
        toggleFields.unshift({
            text: this.loginContentService.content.form.faceid?.label,
            value: FastLoginValue.IsFaceIDEnabled,
        });
    }

    private addTouchIdField(toggleFields: Array<{ text: string | undefined; value: any }>) {
        toggleFields.unshift({
            text: this.loginContentService.content.form.touchid?.label || this.loginContentService.content.form.fingerprint?.label,
            value: FastLoginValue.IsTouchIDEnabled,
        });
    }
}
