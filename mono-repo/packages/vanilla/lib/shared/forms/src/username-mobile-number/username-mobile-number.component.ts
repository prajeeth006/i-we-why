import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

import { CommonMessages, TimerService, TrackingDirective, UserService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { FormFieldComponent } from '../forms/form-field.component';
import { CountryCodeValidatorDirective } from '../validation/countrycode-validator-directive';
import { ValidationMessagesComponent } from '../validation/validation-messages.component';
import { UsernameMobileNumberResourceService } from './username-mobile-resource.service';

/**
 * @experimental
 */
export class MobileNumber {
    countryCode: string | undefined;
    userId: string | undefined;
}

/**
 * @experimental
 */
export class Country {
    predial: string;
    id: string;
}

/**
 * @whatItDoes Provides a custom username and mobile number component.
 *
 * @experimental
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TrackingDirective,
        FormFieldComponent,
        CountryCodeValidatorDirective,
        ValidationMessagesComponent,
        IconCustomComponent,
    ],
    selector: 'vn-username-mobile-number',
    templateUrl: 'username-mobile-number.component.html',
    providers: [
        { provide: NG_VALIDATORS, useExisting: UsernameMobileNumberComponent, multi: true },
        { provide: NG_VALUE_ACCESSOR, useExisting: UsernameMobileNumberComponent, multi: true },
    ],
})
export class UsernameMobileNumberComponent implements OnInit, ControlValueAccessor, Validator {
    @Input() validationMessages: { [key: string]: string } = {};
    @Input() usernameLabel: string;
    @Output() isMobileEvent = new EventEmitter<boolean>();
    @Output() onBlurUserId = new EventEmitter<void>();
    @Output() onFocusUserId = new EventEmitter<void>();
    @Output() modelChanged = new EventEmitter<Event>();

    model: MobileNumber = { countryCode: undefined, userId: undefined };
    isMobileNumber: boolean = false;
    control: AbstractControl;
    currentCountryCode: string | undefined;
    mobileNumberText: string;
    countryCodeText: string;
    isDisabled: boolean;

    private isMobileNumberChanged: Subject<boolean> = new Subject();
    private countries: Country[] = [];
    private readonly _doc = inject(DOCUMENT);

    constructor(
        private mobileNumberResourceService: UsernameMobileNumberResourceService,
        private commonMessages: CommonMessages,
        private user: UserService,
        private timerService: TimerService,
    ) {}

    ngOnInit() {
        this.countryCodeText = this.commonMessages['MobileCountryCodeLabel']!;
        this.mobileNumberText = this.commonMessages['MobileNumberLabel']!;

        this.isMobileNumberChanged.pipe(distinctUntilChanged()).subscribe((isMobile) => this.isMobileEvent.next(isMobile));

        this.mobileNumberResourceService.countries.subscribe((c: Country[]) => {
            this.countries = c;
            this.currentCountryCode = c.find((x) => x.id == this.user.geoCountry)?.predial;
        });
    }

    onChange: (value: any) => void = () => {};

    onTouched = () => {};

    writeValue(value: string) {
        if (value.match(/([+]\d+)?-(\d+)/)) {
            const mobileNumber = value.split('-');
            this.model.countryCode = mobileNumber[0];
            this.model.userId = mobileNumber[1];
            this.changeState(this.model.userId);
        } else {
            this.changeState(value);
            this.model.userId = value;
        }

        this.onTouched();
        this.setFocus();
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        this.control = control;

        if (this.isMobileNumber && this.countries.length > 0 && !this.countries.some((x: Country) => x.predial == this.model.countryCode)) {
            return { invalidCountryCode: true };
        }

        return null;
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled = isDisabled;
        this.onTouched();
    }

    onCountryChanged() {
        if (this.model.countryCode && this.model.countryCode.charAt(0) !== '+') {
            this.model.countryCode = `+${this.model.countryCode}`;
        }

        this.onChange(this.formatValue());
    }

    onModelChanged() {
        this.changeState(this.model.userId);
        this.onChange(this.formatValue());
        this.setFocus();
    }

    userIdBlur() {
        this.onBlurUserId.next();
        this.onTouched();
    }

    userIdFocus() {
        this.onFocusUserId.next();
    }

    userIdChanged(event: Event) {
        this.modelChanged.next(event);
    }

    private changeState(value: string | undefined) {
        if (!value || (isNaN(value as any) && !value.startsWith('+'))) {
            this.isMobileNumber = false;
            this.model.countryCode = undefined;
        } else {
            this.isMobileNumber = true;
            this.model.countryCode = this.model.countryCode ?? this.currentCountryCode;
        }

        this.isMobileNumberChanged.next(this.isMobileNumber);
    }

    private formatValue(): string | undefined {
        if (this.isMobileNumber) {
            return `${this.model.countryCode}-${this.model.userId}`;
        }

        return this.model.userId;
    }

    private setFocus() {
        this.timerService.setTimeout(() => this._doc.getElementById('userId')?.focus());
    }
}
