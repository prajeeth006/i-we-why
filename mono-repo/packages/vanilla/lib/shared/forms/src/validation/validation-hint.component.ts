import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { trackByProp } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type ValidationHint = {
    className: string;
    message: string;
    hintIconClass: string;
    hintTextClass: string;
};

/**
 * @whatItDoes Displays hints mapped from errors to validation messages with the key `Hint.[error-name]` e.q. `Hint.Digit` or `Hint.Letter` or 'Hint.MinLength'
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, IconCustomComponent],
    selector: 'lh-validation-hint',
    templateUrl: 'validation-hint.component.html',
})
export class ValidationHintComponent implements OnInit, OnDestroy {
    @Input() title: string;
    @Input() control: AbstractControl;
    @Input() messages: { value: string; text: string }[];
    validationsHints: ValidationHint[] = [];
    private destroySubject = new Subject();
    validationClass: string;
    readonly trackByMessage = trackByProp<ValidationHint>('message');
    readonly trackByClassName = trackByProp<ValidationHint>('className');

    ngOnInit() {
        if (this.messages && Array.isArray(this.messages)) {
            this.validationsHints = this.messages
                .filter((k) => k.value.startsWith('Hint.'))
                .map((x) => {
                    return {
                        className: x.value.replace(/^Hint\./, '').toLowerCase(),
                        message: x.text,
                        hintIconClass: 'theme-info-i',
                        hintTextClass: 'text-info',
                    };
                });
        }

        this.validationClass = 'theme-info-i';
        this.control.statusChanges.pipe(takeUntil(this.destroySubject)).subscribe(() => {
            this.updateValidationHints();
        });
    }

    ngOnDestroy(): void {
        this.destroySubject.next(null);
    }

    private updateValidationHints() {
        this.validationsHints = this.validationsHints.map((hint) => {
            return {
                ...hint,
                hintTextClass: this.control.pristine
                    ? 'text-info'
                    : !this.control.value || (this.control.errors && this.control.errors[hint.className])
                      ? 'text-danger'
                      : 'text-success',
                hintIconClass: this.control.pristine
                    ? 'theme-info-i'
                    : !this.control.value || (this.control.errors && this.control.errors[hint.className])
                      ? 'theme-error-i'
                      : 'theme-check',
            };
        });
    }
}
