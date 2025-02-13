import { FocusMonitor } from '@angular/cdk/a11y';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    ViewEncapsulation,
    forwardRef,
    inject,
    input,
    model,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { rxHostPressedListener } from '@frontend/ui/rx-host-listener';

@Component({
    selector: 'ds-switch',
    template: `
        <label class="ds-switch-label-wrapper">
            <ng-content select="[slot=labelOff]" />
            <input
                #dsSwitch
                class="ds-switch-custom-input"
                tabindex="-1"
                role="switch"
                type="checkbox"
                [checked]="checked()"
                [disabled]="disabled()"
                [attr.aria-checked]="checked()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledby()"
                [attr.aria-describedby]="ariaDescribedby()"
                [attr.aria-required]="required() || null" />
            <span class="ds-switch-lever">
                <span class="ds-switch-knob"></span>
            </span>
            <ng-content select="[slot=labelOn]" />
        </label>
    `,
    host: {
        'class': 'ds-switch',
        '[class.ds-switch-disabled]': 'disabled()',
        '[class]': '[elTouched ? checked() ? "animate-check" : "animate-uncheck" : ""]',
        '[class.ds-switch-checked]': 'checked()',
        '[tabindex]': 'disabled() ? -1 : 0',
        '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
        '[attr.data-focus-visible]': 'focusVisible()',
        '[attr.data-focus]': 'focused()',
        '[attr.data-disabled]': 'disabled()',
        '[attr.aria-labelledby]': 'null',
        '[attr.aria-label]': 'null',
        '[attr.aria-describedby]': 'null',
    },
    styleUrl: 'switch.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DsSwitch),
            multi: true,
        },
    ],
})
export class DsSwitch implements ControlValueAccessor, AfterContentInit, OnDestroy {
    private _elementRef = inject(ElementRef);
    private _focusMonitor = inject(FocusMonitor);
    private _cdr = inject(ChangeDetectorRef);

    elTouched = false;

    protected focusVisible = signal(false);
    protected focused = signal(false);

    readonly checked = model(false);
    readonly disabled = model(false);
    readonly required = input(false);
    readonly ariaLabel = input<string | null>(null);
    readonly ariaLabelledby = input<string | null>(null);
    readonly ariaDescribedby = input<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars,,@typescript-eslint/no-explicit-any
    protected _onChange = (_: any) => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _onTouched = () => {};

    readonly dsSwitchEl = viewChild<ElementRef<HTMLInputElement>>('dsSwitch');

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rxHostPressedListener()
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.handleChange());
    }

    ngAfterContentInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
            if (focusOrigin) this.focused.set(true);
            if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                this.focusVisible.set(true);
                this._cdr.markForCheck();
            }
            if (!focusOrigin) {
                // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                // Angular does not expect events to be raised during change detection, so any state
                // change (such as a form control's ng-touched) will cause a changed-after-checked error.
                // See https://github.com/angular/angular/issues/17793. To work around this, we defer
                // telling the form control it has been touched until the next tick.
                // eslint-disable-next-line
                Promise.resolve().then(() => {
                    this.focusVisible.set(false);
                    this.focused.set(false);
                    this._onTouched();
                    this._cdr.markForCheck();
                });
            }
        });

        if (!this.dsSwitchEl()) return;
        this.dsSwitchEl()?.nativeElement.dispatchEvent(new Event('change'));
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    handleChange() {
        if (this.disabled()) return;
        if (!this.dsSwitchEl()?.nativeElement) return;

        if (this.focused() && !this.elTouched) {
            this.elTouched = true;
        }

        this.checked.update((x: any) => !x);
        this._onChange(this.checked());
    }

    writeValue(value: boolean): void {
        this.checked.set(!!value);
        this._onChange(value);
    }

    registerOnChange(fn: (params: boolean) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn; /* eslint-disable-line @typescript-eslint/no-unsafe-assignment*/
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
        this._cdr.markForCheck();
    }
}
