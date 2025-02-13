import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { UntypedFormControl, ValidatorFn } from '@angular/forms';

import { Validators } from '@frontend/vanilla/shared/forms';

describe('Validators', () => {
    const control = new UntypedFormControl();
    const depControl = new UntypedFormControl();
    let validator: ValidatorFn;
    registerLocaleData(localeEs, 'es');

    afterEach(() => {
        depControl.setValue(null);
    });

    it('Validators.minDate', () => {
        const date = new Date(2017, 5, 10);
        validator = Validators.minDate(date);

        expectValidation(undefined, null);
        expectValidation(null, null);
        expectValidation('', null);

        expectValidation(new Date(2017, 5, 15), null);

        expectValidation(new Date(2017, 5, 1), { mindate: true });

        validator = Validators.minDate('2017-04-11');

        expectValidation('2017-06-11', null);

        expectValidation('2017-02-11', { mindate: true });
    });

    it('Validators.maxDate', () => {
        const date = new Date(2017, 5, 10);
        validator = Validators.maxDate(date);

        expectValidation(undefined, null);
        expectValidation(null, null);
        expectValidation('', null);

        expectValidation(new Date(2017, 5, 5), null);

        expectValidation(new Date(2017, 5, 20), { maxdate: true });

        validator = Validators.maxDate('2016-04-11');

        expectValidation('2015-04-11', null);

        expectValidation('2017-04-11', { maxdate: true });
    });

    it('Validators.youngerThan', () => {
        const today = new Date();
        validator = Validators.youngerThan(18); // this actually should be olderThan to make more sense, but there are already strings in sitecore for this

        expectValidation(undefined, null);
        expectValidation(null, null);
        expectValidation('', null);

        expectValidation(new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()), null);
        expectValidation(new Date(today.getFullYear() - 25, 4, 10), null);

        expectValidation(new Date(today.getFullYear() - 10, 5, 20), { youngerthan: true });
        expectValidation(new Date(today.getFullYear() - 18, today.getMonth() + 1, 20), { youngerthan: true });
        expectValidation(new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1), { youngerthan: true });

        expectValidation(`${today.getFullYear() - 26}-04-11`, null);

        expectValidation(`${today.getFullYear() - 12}-04-11`, { youngerthan: true });
    });

    it('Validators.olderThan', () => {
        const today = new Date();
        validator = Validators.olderThan(100); // this actually should be youngerThan to make more sense

        expectValidation(undefined, null);
        expectValidation(null, null);
        expectValidation('', null);

        expectValidation(new Date(today.getFullYear() - 99, today.getMonth(), today.getDate()), null);
        expectValidation(new Date(today.getFullYear() - 10, 4, 10), null);

        expectValidation(new Date(today.getFullYear() - 120, 5, 20), { olderthan: true });
        expectValidation(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()), { olderthan: true });

        expectValidation(`${today.getFullYear() - 26}-04-11`, null);

        expectValidation(`${today.getFullYear() - 120}-04-11`, { olderthan: true });
    });

    it('Validators.customPattern', () => {
        const options = {
            key: 'myCustomPattern',
            pattern: '[a-z][0-9]',
            valid: 'a1',
            invalid: ' a1 ',
            useRegExp: false,
        };

        validator = Validators.customPattern(options.pattern, options.key);
        expectCustomPatternValidation(options);

        options.useRegExp = true;
        validator = Validators.customPattern(new RegExp('^' + options.pattern + '$'), options.key);
        expectCustomPatternValidation(options);
    });

    function expectCustomPatternValidation(options: { key: string; pattern: string; valid: string; invalid: string; useRegExp?: boolean }) {
        expectValidation(undefined, null);
        expectValidation(null, null);
        expectValidation('', null);

        expectValidation(options.valid, null);

        const result: Record<string, {}> = {};
        const requiredPattern = options.useRegExp ? `/^${options.pattern}$/` : `^${options.pattern}$`;
        result[options.key] = { requiredPattern: requiredPattern, actualValue: options.invalid };

        expectValidation(options.invalid, result);
    }

    function expectValidation(value: any, result: any, v?: ValidatorFn) {
        v = v || validator;

        control.setValue(value);
        expect(v(control)).toEqual(result);
    }
});
