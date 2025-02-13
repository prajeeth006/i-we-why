import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DsSwitch } from '@frontend/ui/switch';
import { LoginConfig } from '@frontend/vanilla/shared/login';

import { LoginContentService } from './login-content.service';
import { LoginTrackingService } from './login-tracking.service';

@Component({
    standalone: true,
    selector: 'lh-prefill-username-toggle',
    templateUrl: 'prefill-username-toggle.component.html',
    imports: [CommonModule, DsSwitch],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: PrefillUsernameToggleComponent,
            multi: true,
        },
    ],
})
export class PrefillUsernameToggleComponent implements ControlValueAccessor, OnInit {
    get v2() {
        return this.loginConfig.v2;
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
    isDisabled: boolean = false;
    private innerValue: boolean;
    constructor(
        public loginContentService: LoginContentService,
        public loginConfig: LoginConfig,
        private trackingService: LoginTrackingService,
    ) {}

    ngOnInit(): void {
        this.trackingService.trackPrefillUsernameLoaded();
    }

    onChange: (_: any) => void = () => {};
    onTouched = () => {};

    writeValue(value: boolean): void {
        if (value !== this.value) {
            this.value = value;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onValueChange(value: boolean) {
        this.value = value;
        this.trackingService.trackPrefillUsernameClicked(value);
    }
}
