import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { ValidationConfig } from '../validation/validation.client-config';
import { ServerFieldValidationViolation, ValidationRuleSet } from '../validation/validation.models';
import { Validators } from '../validation/validators';
import { PortalFormGroup } from './portal-form-group';

/**
 * @stable
 */
export interface ValidationRuleSetTyped {
    required?: boolean;
    regex?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

/**
 * @stable
 */
export interface ValidationFactories {
    required: (param: boolean) => ValidatorFn | null;
    regex: (param: string) => ValidatorFn | null;
    minLength: (param: number) => ValidatorFn | null;
    maxLength: (param: number) => ValidatorFn | null;
    min: (param: number) => ValidatorFn | null;
    max: (param: number) => ValidatorFn | null;
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ValidationHelperService {
    private defaultValidatorFactories: ValidationFactories;

    constructor(private validationConfig: ValidationConfig) {
        this.defaultValidatorFactories = {
            required: (required: boolean) => (required ? Validators.required : null),
            regex: (regex: string) => Validators.pattern(regex),
            minLength: (len: number) => Validators.minLength(len),
            maxLength: (len: number) => Validators.maxLength(len),
            min: (n: number) => Validators.min(n),
            max: (n: number) => Validators.max(n),
        };
    }

    createValidators(
        formControlName: string,
        options?: {
            overrides?: ValidationRuleSetTyped;
            validationFactoryOverrides?: Partial<ValidationFactories>;
            baseOverrides?: ValidationRuleSet;
            [propName: string]: any;
        },
    ): ValidatorFn[] {
        options = options || {};
        const overrides = options.overrides || {};
        const rules = this.parseRules(options.baseOverrides || this.getRawRules(formControlName) || ({} as any));
        const factories = Object.assign({}, this.defaultValidatorFactories, options.validationFactoryOverrides);

        return [
            this.createValidator(rules.required, overrides.required, (required) => factories.required(required)),
            this.createValidator(rules.minLength, overrides.minLength, (len) => factories.minLength(len)),
            this.createValidator(rules.maxLength, overrides.maxLength, (len) => factories.maxLength(len)),
            this.createValidator(rules.min, overrides.min, (n) => factories.min(n)),
            this.createValidator(rules.max, overrides.max, (n) => factories.max(n)),
            this.createValidator(rules.regex, overrides.regex, (regex) => factories.regex(regex)),
        ].filter((v) => v) as ValidatorFn[];
    }

    createPasswordValidators(): ValidatorFn[] {
        return [
            Validators.customPattern(new RegExp(this.validationConfig.regexList['containsDigits']!), 'digit'),
            Validators.customPattern(new RegExp(this.validationConfig.regexList['containsLetters']!), 'letter'),
            Validators.customPattern(new RegExp(this.validationConfig.regexList['specialCharacters']!), 'specialcharacters'),
        ];
    }

    getRules(formControlName: string): ValidationRuleSetTyped | null {
        const rawRules = this.getRawRules(formControlName);
        if (!rawRules) {
            return null;
        }

        return this.parseRules(rawRules);
    }

    getRawRules(formControlName: string) {
        const foundFormControlName = Object.keys(this.validationConfig.rules).find((c) => c.toLowerCase() === formControlName.toLowerCase());
        if (!foundFormControlName) {
            return null;
        }

        return this.validationConfig.rules[foundFormControlName];
    }

    applyViolations(form: UntypedFormGroup, violations: ServerFieldValidationViolation[]) {
        if (!violations) {
            return [];
        }

        const fields: string[] = [];

        violations
            .filter((v) => v.fieldName)
            .forEach((v) => {
                let control: AbstractControl | null;
                if (form instanceof PortalFormGroup) {
                    control = form.getFlat(v.fieldName!);
                } else {
                    control = form.get(v.fieldName!);
                }

                if (control) {
                    const error = v.validationError || 'server-violation';
                    const errors: Record<string, boolean> = {};
                    errors[error] = true;

                    control.setErrors(errors);

                    fields.push(v.fieldName!);
                }
            });

        return fields;
    }

    private parseRules(rawRules: ValidationRuleSet): ValidationRuleSetTyped {
        return {
            required: this.convertValidationProperty(rawRules.required, Boolean),
            min: this.convertValidationProperty(rawRules.min, Number),
            max: this.convertValidationProperty(rawRules.max, Number),
            regex: this.convertValidationProperty(rawRules.regex, String),
            minLength: this.convertValidationProperty(rawRules.minLength, Number),
            maxLength: this.convertValidationProperty(rawRules.maxLength, Number),
        };
    }

    private createValidator<T>(source: T, override: T, createFn: (value: NonNullable<T>) => ValidatorFn | null) {
        let value: T;
        if (override !== undefined) {
            value = override;
        } else {
            value = source;
        }

        if (value != null) {
            return createFn(value);
        }

        return null;
    }

    private convertValidationProperty(source: string | boolean, sourceType: typeof Number | typeof String | typeof Boolean) {
        if (typeof source === 'string') {
            source = this.removeDynamicValidation(source);
        }

        let value: any;
        if (sourceType === Number) {
            value = parseInt(source as string);
        } else if (sourceType === Boolean) {
            value = source === true || (typeof source === 'string' && source.toLowerCase() === 'true');
        } else if (sourceType === String) {
            value = source;
        }

        return value;
    }

    private removeDynamicValidation(originalValue: string) {
        const regexResult = /\[DEFAULT\]=val\((.+?)\)/.exec(originalValue);
        return regexResult ? regexResult[1]! : originalValue;
    }
}
