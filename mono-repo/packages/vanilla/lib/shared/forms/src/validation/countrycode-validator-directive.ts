import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { Country } from '../username-mobile-number/username-mobile-number.component';
import { UsernameMobileNumberResourceService } from '../username-mobile-number/username-mobile-resource.service';

/**
 * @whatItDoes Provides min validator
 *
 * @stable
 */
@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[countrycode][FormControl],[countrycode][ngModel]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: CountryCodeValidatorDirective, multi: true }],
})
export class CountryCodeValidatorDirective implements AsyncValidator, OnChanges {
    @Input() countrycode: string;

    private onChange: () => void;

    constructor(private mobileNumberResourceService: UsernameMobileNumberResourceService) {}

    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'countrycode') {
                if (this.onChange) this.onChange();
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(_control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.mobileNumberResourceService.countries.pipe(
            map((countries: Country[]) => {
                if (!countries.some((x) => x.predial == this.countrycode)) {
                    return { invalidCountryCode: true };
                }
                return null;
            }),
        );
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }
}
