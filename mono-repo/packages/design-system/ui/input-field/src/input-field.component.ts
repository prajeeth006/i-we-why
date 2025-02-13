import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
    booleanAttribute,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import { DsInputDirective } from './input.directive';

export const DS_INPUT_FIELDS_SIZE_ARRAY = ['small', 'medium'] as const;
export type DsInputFieldsSize = (typeof DS_INPUT_FIELDS_SIZE_ARRAY)[number];

// eslint-disable-next-line @nx/workspace-component-tests-present
@Component({
    selector: 'ds-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss'],
    host: {
        'class': 'ds-input-field',
        '[class.ds-input-field-enabled]': '!isDisabled && !isLocked && !focused()',
        '[class.ds-input-field-focused]': '(!isDisabled && !isLocked && focused()) || (focusVisible() && isLocked)',
        '[class.ds-input-field-disabled]': 'isDisabled',
        '[class.ds-input-field-locked]': 'isLocked',
        '[class.ds-input-field-required]': 'isRequired',
        '[class.ds-input-field-floating-label]': 'isFloating()',
        '[class.ds-input-field-inverse]': 'inverse',
        '[class.ds-input-field-invalid]': 'isInvalid',
        '[class.ds-input-field-text-input]': 'isInput',
        '[class.ds-input-field-textarea]': 'isTextarea',
        '[class.ds-input-field-right-align]': 'isRightAligned && isInput',
        '[class]': `hostClass`,
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class DsInputField implements AfterContentInit {
    @Input() labelFor = '';
    @Input() labelText = '';
    @Input() set value(value: string) {
        this.valueSignal.set(value);
    }
    @Input() size: DsInputFieldsSize = 'medium';
    @Input({ transform: booleanAttribute }) isRightAligned = false;
    @Input({ transform: booleanAttribute }) isFieldRequired = true;
    @Input({ transform: booleanAttribute }) floatingLabel = false;
    @Input({ transform: booleanAttribute }) inverse? = false;

    showCharCount = signal(false);
    valueSignal = signal('');
    focusVisible = signal(false);
    focused = signal(false);
    isAutofilled = signal(false);
    isInputValuePresent = signal(false);

    private _destroyRef = inject(DestroyRef);
    public isInput: boolean | undefined;
    public isTextarea: boolean | undefined;

    public get isLocked(): boolean {
        const nativeElement = this.dsInput?.elementRef.nativeElement as HTMLElement;
        return nativeElement?.hasAttribute('readonly') ?? false;
    }

    public get isInvalid(): boolean {
        return (this.dsInput?.control?.status === 'INVALID' && this.dsInput?.control.touched) ?? false;
    }

    public get isDisabled(): boolean {
        return this.dsInput?.control?.disabled ?? false;
    }

    public get isRequired(): boolean {
        const validator = this.dsInput?.control?.control?.validator;
        const requiredValidator = validator ? validator(new FormControl()) : null;
        return requiredValidator?.['required'] === true && this.isFieldRequired;
    }

    get hostClass() {
        return this.isInput ? `ds-input-field-${this.size}` : '';
    }

    //TODO convert to contentChild.required
    @ContentChild(DsInputDirective, { descendants: true }) dsInput?: DsInputDirective;

    @Output() focusChange = new EventEmitter<boolean>();

    ngAfterContentInit(): void {
        this.isInput = this.checkElementType('INPUT');
        this.isTextarea = this.checkElementType('TEXTAREA');

        if (!this.dsInput) {
            throw new Error(' DsInputField needs a dsInput as a child');
        }

        this.labelFor = this.dsInput.getInputId() || this.labelFor;
        this.focused = this.dsInput.focused;
        this.focusVisible = this.dsInput.focusVisible;
        this.isAutofilled = this.dsInput.isAutofilled;

        this.updateValueSignal();

        // Combine subscriptions to valueChanges and statusChanges
        this.dsInput.control?.valueChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value) => {
            this.valueSignal.set(value);

            this.updateValueSignal();
            this.focusChange.emit(this.focused());
        });

        this.dsInput.control?.statusChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            this.focusChange.emit(this.focused());
        });

        const hasValue = this.dsInput?.control?.value != null && String(this.dsInput?.control?.value).length > 0;
        this.isInputValuePresent.set(hasValue);

        // Unsubscribe from floatingStateChange
        this.dsInput.floatingStateChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((isFloating) => {
            this.isInputValuePresent.set(isFloating);
        });

        this.updateValueSignal();
    }

    private checkElementType(type: string): boolean {
        return this.dsInput?.elementRef.nativeElement.tagName === type;
    }

    isFloating(): boolean {
        return this.floatingLabel || this.focused() || this.isInputValuePresent() || this.isAutofilled();
    }

    updateValueSignal(): void {
        const value = typeof this.dsInput?.control?.value === 'string' ? this.dsInput.control.value : '';
        this.valueSignal.set(value);
    }

    isFocusedAndHasContent(): boolean {
        return this.focused() || this.valueSignal().length > 0;
    }

    focusInputField(): void {
        if (!this.focused() && !this.isLocked) {
            const inputElement = this.dsInput?.elementRef.nativeElement as HTMLElement;
            inputElement?.focus();
        }
    }
}
