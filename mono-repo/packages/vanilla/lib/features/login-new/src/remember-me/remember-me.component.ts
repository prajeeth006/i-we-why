import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DsSwitch } from '@frontend/ui/switch';
import { FormElementTemplateForClient } from '@frontend/vanilla/core';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { NgxFloatUiModule } from 'ngx-float-ui';

import { LoginTrackingService } from '../login-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, DsSwitch],
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
    @Input() content: FormElementTemplateForClient;

    get value(): boolean {
        return this.innerValue;
    }

    set value(value: boolean) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.onChange(this.innerValue);
        }
    }

    isDisabled: boolean;

    private innerValue: boolean;

    constructor(
        public config: LoginConfig,
        private trackingService: LoginTrackingService,
    ) {}

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
