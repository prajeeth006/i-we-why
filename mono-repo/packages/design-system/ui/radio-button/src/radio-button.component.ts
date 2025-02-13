import { FocusMonitor } from '@angular/cdk/a11y';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
    forwardRef,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { rxHostPressedListener } from '@frontend/ui/rx-host-listener';

export const DS_RADIO_SIZE_ARRAY = ['small', 'large'] as const;
export type DsRadioSize = (typeof DS_RADIO_SIZE_ARRAY)[number];

@Component({
    selector: 'ds-radio-button',
    template: `
        <label class="ds-radio-button-label">
            <input
                #input
                type="radio"
                role="radio"
                [name]="name"
                [value]="value"
                [checked]="checkedSignal()"
                [disabled]="disabledSignal()"
                (change)="onInputChange($event)"
                (click)="onInputClick($event)"
                [attr.aria-checked]="checkedSignal()"
                [attr.aria-posinset]="position"
                [attr.aria-setsize]="setSize"
                class="ds-radio-button-input" />
            <span class="ds-radio-button-lever"></span>
            <ng-content />
        </label>
    `,
    styleUrls: ['./radio-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        '(focus)': 'onFocus()',
        '[class.ds-radio-selected]': 'checkedSignal()',
        '[class.ds-radio-focused]': 'focused()',
        '[class.ds-radio-unselected]': '!checkedSignal()',
        '[class.ds-radio-disabled]': 'disabledSignal()',
        '[attr.tabindex]': 'tabIndex()',
        '[attr.aria-labelledby]': 'ariaLabelledby',
        '[attr.aria-disabled]': 'disabledSignal()',
        '[attr.aria-label]': 'ariaLabel',
        '[attr.aria-describedby]': 'ariaDescribedby',
        '[attr.data-focus-visible]': 'focusVisible()',
        '[class.data-focus-visible]': 'focusVisible()',
        '[attr.data-focus]': 'focused()',
    },
})
export class DsRadioButton implements AfterContentInit, OnDestroy {
    @Input() value: any;
    @Input({ required: true }) name!: string;
    @Input() ariaLabel: string | null = null;
    @Input() ariaLabelledby: string | null = null;
    @Input() ariaDescribedby: string | null = null;
    position = 1;
    setSize = 1;

    @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

    private _focusMonitor = inject(FocusMonitor);
    private _elementRef = inject(ElementRef);
    private destroyRef = inject(DestroyRef);
    public radioGroup = inject(DsRadioGroup, { optional: true });

    checkedSignal = signal(false);
    disabledSignal = signal(false);
    focusVisible = signal(false);
    focused = signal(false);
    tabIndex = signal(-1);

    @Input() set disabled(value: boolean) {
        this.disabledSignal.set(value);
    }

    @Input() set checked(value: boolean) {
        this.checkedSignal.set(value);
    }

    updatePositionAndSize(position: number, size: number) {
        this.position = position;
        this.setSize = size;
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    ngAfterContentInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
            this.focused.set(!!focusOrigin);
            if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                this.focusVisible.set(true);
            } else if (!focusOrigin) {
                this.focusVisible.set(false);
                this.focused.set(false);
            }
        });
    }

    constructor() {
        rxHostPressedListener()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                if (event.target === this._inputElement.nativeElement) {
                    this.onInputChange();
                }
            });
    }

    onInputClick(event: Event) {
        event.stopPropagation();
    }

    onInputChange(event?: Event) {
        event?.stopPropagation();

        if (!this.checkedSignal() && !this.disabledSignal()) {
            const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.valueSignal();
            this.checkedSignal.set(true);

            if (this.radioGroup) {
                this.radioGroup.selectButton(this);
                if (groupValueChanged) {
                    this.radioGroup.emitChangeEvent();
                }
            }
        }
    }

    setTabIndex(value: number) {
        this.tabIndex.set(value);
    }

    focus() {
        this.focused.set(true);
        this.focusVisible.set(true);
        this._focusMonitor.focusVia(this._inputElement, 'keyboard');
    }

    registerOnInputChange(fn: () => void) {
        this.onInputChange = fn;
    }

    onFocus() {
        this._inputElement.nativeElement.focus();
    }
}

@Component({
    selector: 'ds-radio-group',
    template: ` <ng-content /> `,
    host: {
        '[class]': `hostClass`,
        '(keydown)': 'handleKeydown($event)',
        'role': 'radiogroup',
    },
    styleUrls: ['./radio-button.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DsRadioGroup),
            multi: true,
        },
    ],
})
export class DsRadioGroup implements OnChanges, AfterContentInit, AfterViewInit, ControlValueAccessor {
    @Input() size: DsRadioSize = 'large';
    valueSignal = signal<string>('');
    disabledSignal = signal(false);
    @Output() valueChange = new EventEmitter<any>();

    @Input() set value(value: string) {
        this.valueSignal.set(value);
    }

    @Input() set disabled(value: boolean) {
        this.disabledSignal.set(value);
    }

    @ContentChildren(DsRadioButton) radioButtons!: QueryList<DsRadioButton>;

    private onChange: (value: any) => void = () => {};
    private onTouched: () => void = () => {};

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value'] || changes['disabled']) {
            this.updateButtonsState();
        }
    }

    ngAfterViewInit() {
        if (this.radioButtons) {
            this.radioButtons.changes.subscribe(() => {
                this.updatePositionsAndSizes();
                this.updateButtonsState();
                this.radioButtons.forEach((button) => {
                    button.registerOnInputChange(() => {
                        this.selectButton(button);
                    });
                });
            });
        }
    }

    private updateButtonsState() {
        if (this.radioButtons) {
            this.radioButtons.forEach((btn) => {
                btn.checkedSignal.set(btn.value === this.valueSignal());
                btn.disabledSignal.set(this.disabledSignal() || btn.disabledSignal());
                btn.setTabIndex(btn.checkedSignal() ? 0 : -1);
            });
        }
    }

    private updatePositionsAndSizes() {
        this.radioButtons.forEach((button, index) => {
            button.updatePositionAndSize(index + 1, this.radioButtons.length);
        });
    }

    selectButton(selectedBtn: DsRadioButton) {
        if (!this.disabledSignal() && !selectedBtn.disabledSignal() && this.radioButtons) {
            this.radioButtons.forEach((btn) => {
                btn.checkedSignal.set(btn === selectedBtn);
                btn.setTabIndex(btn.checkedSignal() && !btn.disabledSignal() ? 0 : -1);
            });
            this.valueSignal.set(selectedBtn.value);
            this.emitChangeEvent();
            this.onChange(this.valueSignal());
            this.onTouched();
        }
    }

    ngAfterContentInit() {
        if (this.radioButtons) {
            this.updatePositionsAndSizes();
            this.updateButtonsState();
            this.radioButtons.forEach((button) => {
                button.registerOnInputChange(() => {
                    this.selectButton(button);
                });
            });
        }
    }

    emitChangeEvent() {
        this.valueChange.emit(this.valueSignal());
    }

    handleKeydown(event: KeyboardEvent) {
        const { key } = event;
        if (this.radioButtons) {
            const buttonsArray = this.radioButtons.toArray().filter((button) => !button.disabledSignal());
            const focusedIndex = buttonsArray.findIndex((button) => button.focused());
            let nextIndex = -1;

            if (buttonsArray.length === 0) {
                return;
            }
            if (key === 'ArrowRight' || key === 'ArrowDown') {
                nextIndex = focusedIndex < buttonsArray.length - 1 ? focusedIndex + 1 : 0;
            } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
                nextIndex = focusedIndex > 0 ? focusedIndex - 1 : buttonsArray.length - 1;
            }

            if (nextIndex !== -1) {
                buttonsArray.forEach((button) => {
                    button.focused.set(false);
                    button.focusVisible.set(false);
                });
                event.preventDefault();
                const nextButton = buttonsArray[nextIndex];
                nextButton.focus();
            }

            if ((key === 'Space' || key === 'Enter') && focusedIndex !== -1) {
                event.preventDefault();
                const focusedButton = buttonsArray[focusedIndex];
                if (!focusedButton.checkedSignal()) {
                    this.selectButton(focusedButton); // Ensure no redundant emits
                }
            }
        }
    }

    writeValue(value: string): void {
        this.valueSignal.set(value);
        this.updateButtonsState();
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabledSignal.set(isDisabled);
        this.updateButtonsState();
    }

    get hostClass() {
        const sizeClass = this.size === 'large' ? 'ds-radio-large' : 'ds-radio-small';
        return `ds-radio-group ${sizeClass}`;
    }
}
