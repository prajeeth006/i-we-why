import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DsSwitch } from '@frontend/ui/switch';
import { FormElementTemplateForClient } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { NgxFloatUiModule, NgxFloatUiPlacements } from 'ngx-float-ui';

import { LoginContentService } from './login-content.service';
import { LoginTrackingService } from './login-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, IconCustomComponent, DsSwitch],
    selector: 'lh-remember-me',
    templateUrl: 'remember-me.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: RememberMeComponent,
            multi: true,
        },
    ],
})
export class RememberMeComponent implements ControlValueAccessor {
    NgxFloatUiPlacements = NgxFloatUiPlacements;
    isDisabled: boolean;

    private innerValue: boolean;

    constructor(
        private loginContentService: LoginContentService,
        private loginConfig: LoginConfig,
        private trackingService: LoginTrackingService,
    ) {}

    get v2(): boolean {
        return this.loginConfig.v2;
    }

    get content(): FormElementTemplateForClient | undefined {
        return this.loginContentService.content.form.remembermeproxy ?? this.loginContentService.content.form.rememberme;
    }

    get value(): boolean {
        return this.innerValue;
    }

    set value(value: boolean) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.onChange(this.innerValue);
        }
    }

    onChange: (_: any) => void = () => {};
    onTouched = () => {};

    writeValue(value: boolean) {
        if (value !== this.value) {
            this.value = value;
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

    onValueChange(value: boolean) {
        this.value = value;
        this.trackingService.trackRememberMeClicked(this.value);
    }

    trackRememberMeTooltip() {
        this.trackingService.trackRememberMeTooltipClicked();
    }
}
