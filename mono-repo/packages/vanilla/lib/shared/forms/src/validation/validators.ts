import { AbstractControl, Validators as AngularValidators, ValidationErrors } from '@angular/forms';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}

/**
 * @whatItDoes Provides custom angular validators
 *
 * @stable
 */
// @dynamic
export class Validators extends AngularValidators {
    static minDate(date: Date | string): (control: AbstractControl) => ValidationErrors | null {
        date = normalizeDate(date);

        return (control: AbstractControl) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }

            if (date && normalizeDate(control.value) < date) {
                return { mindate: true };
            }

            return null;
        };
    }

    static maxDate(date: Date | string): (control: AbstractControl) => ValidationErrors | null {
        date = normalizeDate(date);

        return (control: AbstractControl) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }

            if (date && normalizeDate(control.value) > date) {
                return { maxdate: true };
            }

            return null;
        };
    }

    static youngerThan(age: number) {
        return (control: AbstractControl) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }

            if (calculateAge(control.value) < age) {
                return { youngerthan: true };
            }

            return null;
        };
    }

    static olderThan(age: number) {
        return (control: AbstractControl) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }

            if (calculateAge(control.value) >= age) {
                return { olderthan: true };
            }

            return null;
        };
    }

    static customPattern(pattern: string | RegExp, validationKey: string) {
        if (!pattern) return Validators.nullValidator;
        let regex: RegExp;
        let regexStr: string;
        if (typeof pattern === 'string') {
            regexStr = `^${pattern}$`;
            regex = new RegExp(regexStr);
        } else {
            regexStr = pattern.toString();
            regex = pattern;
        }
        return (control: AbstractControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }

            const value: string = control.value;
            if (regex.test(value)) {
                return null;
            } else {
                const validationError: Record<string, {}> = {};
                validationError[validationKey] = { requiredPattern: regexStr, actualValue: value };
                return validationError;
            }
        };
    }
}

function normalizeDate(date: string | Date): Date {
    if (typeof date === 'string') {
        return new Date(date);
    }

    return date;
}

function calculateAge(date: Date | string) {
    const today = new Date();
    date = normalizeDate(date);
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
    }
    return age;
}
