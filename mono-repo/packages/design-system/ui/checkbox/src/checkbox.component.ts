import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule, NgStyle } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    forwardRef,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { rxHostPressedListener } from '@frontend/ui/rx-host-listener';

export const DS_CHECKBOX_SIZE_ARRAY = ['small', 'large'] as const;
export type DsCheckboxSize = (typeof DS_CHECKBOX_SIZE_ARRAY)[number];

@Component({
    selector: 'ds-checkbox',
    standalone: true,
    imports: [CommonModule, NgStyle],
    templateUrl: 'checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    host: {
        'class': 'ds-checkbox',
        '[tabindex]': 'isDisabled() ? -1 : 0',
        '[class]': '"ds-checkbox-"+size',
        '[class.ds-checkbox-checked]': 'isChecked()',
        '[class.ds-checkbox-indeterminate]': 'isIndeterminate()',
        '[class.ds-checkbox-disabled]': 'isDisabled()',
        '[attr.aria-labelledby]': 'null',
        '[attr.aria-label]': 'null',
        '[attr.aria-describedby]': 'null',
        '[class.ds-checkbox-inverse]': 'inverse',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DsCheckbox),
            multi: true,
        },
    ],
})
export class DsCheckbox implements AfterViewInit, OnDestroy, ControlValueAccessor {
    @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;

    @Input() size: DsCheckboxSize = 'large';
    @Input() ariaLabel = 'checkbox';
    @Input() ariaLabelledby: string | null = null;
    @Input() ariaDescribedby: string | null = null;
    @Input() name?: string;
    @Input() id?: string;
    @Input({ transform: booleanAttribute }) inverse = false;

    @Input() set checked(value: boolean) {
        if (this.checkedSignal() !== value) {
            this.checkedSignal.set(value);
            this.indeterminateSignal.set(false);
            this.updateCheckboxState();
            this.checkedChange.emit(value);
            this.onChange(value);
        }
    }

    @Input() set indeterminate(value: boolean) {
        if (this.indeterminateSignal() !== value) {
            this.indeterminateSignal.set(value);
            if (value) {
                this.checkedSignal.set(false);
            }
            this.updateCheckboxState();
        }
    }

    @Input() set disabled(value: boolean) {
        if (this.disabledSignal() !== value) {
            this.disabledSignal.set(value);
            this.updateCheckboxState();
        }
    }

    @Output() checkedChange = new EventEmitter<boolean>();

    private checkedSignal = signal(false);
    private indeterminateSignal = signal(false);
    private disabledSignal = signal(false);

    isChecked = computed(() => this.checkedSignal());
    isIndeterminate = computed(() => this.indeterminateSignal());
    isDisabled = computed(() => this.disabledSignal());

    private onChange: (value: any) => void = () => {};
    private onTouched: () => void = () => {};

    constructor(
        private elementRef: ElementRef,
        private focusMonitor: FocusMonitor,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rxHostPressedListener()
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.toggle());
    }

    ngAfterViewInit() {
        this.focusMonitor.monitor(this.elementRef, true).subscribe((focusOrigin) => {
            if (!focusOrigin) {
                this.onTouched();
            }
        });

        this.updateCheckboxState();
    }

    ngOnDestroy() {
        this.focusMonitor.stopMonitoring(this.elementRef);
    }

    toggle() {
        if (this.isDisabled()) {
            return;
        }
        if (this.isIndeterminate()) {
            this.indeterminate = false;
            this.checked = true;
        } else {
            this.checked = !this.isChecked();
        }
    }

    private updateCheckboxState() {
        if (this.checkbox) {
            Object.assign(this.checkbox.nativeElement, {
                indeterminate: this.isIndeterminate(),
                checked: this.isChecked(),
                disabled: this.isDisabled(),
            });
        }
    }

    /* eslint-disable-line @typescript-eslint/no-unsafe-assignment*/
    writeValue(value: any): void {
        this.checkedSignal.set(!!value);
        this.indeterminateSignal.set(false);
        this.updateCheckboxState();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn; /* eslint-disable-line @typescript-eslint/no-unsafe-assignment*/
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn; /* eslint-disable-line @typescript-eslint/no-unsafe-assignment*/
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
