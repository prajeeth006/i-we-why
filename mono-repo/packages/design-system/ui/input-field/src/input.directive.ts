import { FocusMonitor } from '@angular/cdk/a11y';
import {
    AfterContentInit,
    DestroyRef,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    Signal,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControlStatus, NgControl } from '@angular/forms';

export const DS_INPUT_TYPES_ARRAY = ['text', 'password', 'email', 'number', 'date'] as const;
export type DsInputType = (typeof DS_INPUT_TYPES_ARRAY)[number];

let uniqueInputId = 0;
function generateUniqueInputId() {
    return `ds-input-id-${++uniqueInputId}`;
}

@Directive({
    selector: '[dsInput]',
    exportAs: 'dsInput',
    standalone: true,
    host: {
        'class': 'ds-input-field-input',
        '[attr.tabindex]': 'this.control.disabled ? -1 : 0',
        '[attr.id]': 'getInputId()',
    },
})
export class DsInputDirective implements AfterContentInit, OnDestroy {
    @Input() maxCharCount = 255;
    charCount = signal(0);
    control = inject(NgControl, { self: true, optional: true });
    elementRef = inject(ElementRef);
    private _focusMonitor = inject(FocusMonitor);
    private _destroyRef = inject(DestroyRef);
    private _id?: string;

    status!: Signal<FormControlStatus>;
    private hasValue = false;
    focused = signal(false);
    focusVisible = signal(false);
    isAutofilled = signal(false);

    private _elementRef = inject(ElementRef);
    @Output() focusChange = new EventEmitter<boolean>();
    @Output() floatingStateChange = new EventEmitter<boolean>();

    private eventListeners: (() => void)[] = [];

    constructor(private renderer: Renderer2) {
        if (!this.control) {
            throw new Error('For the moment ds-input can only be used with ngModel or formControlName');
        }

        this.status = this.control?.statusChanges ? toSignal(this.control?.statusChanges) : signal('VALID');
    }

    ngOnInit(): void {
        const initialValue = this.control?.value as string;
        if (initialValue) {
            this.updateCharCount(initialValue);
            this.limitCharacterCount();
        }

        this.control?.valueChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((value: string) => {
            this.updateCharCount(value ?? '');
            this.limitCharacterCount();
        });
    }

    ngAfterContentInit() {
        if (this.control) {
            this.control.valueChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
                this.setValueState();
            });
        }

        const nativeElement = this.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
        this.eventListeners.push(
            this.renderer.listen(nativeElement, 'input', () => {
                this.updateCharCount(nativeElement.value);
                this.limitCharacterCount();
            }),
            this.renderer.listen(nativeElement, 'animationstart', this.handleAutofillEvent.bind(this)),
        );

        this._focusMonitor
            .monitor(this._elementRef, true)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((focusOrigin) => {
                if (this.control?.disabled) return;

                this.focused.set(!!focusOrigin);
                this.focusChange.emit(this.focused());

                if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                    this.focusVisible.set(true);
                } else if (!focusOrigin) {
                    this.focusVisible.set(false);
                    this.focused.set(false);
                }
            });
    }

    ngOnDestroy(): void {
        this._focusMonitor.stopMonitoring(this._elementRef);
        this.eventListeners.forEach((unregister) => unregister());
    }

    getInputId(): string {
        if (this._id) {
            return this._id;
        }

        const element = this.elementRef.nativeElement as HTMLElement;
        let id = element.getAttribute('id');

        if (!id || !id.trim()) {
            id = generateUniqueInputId();
        }

        this._id = id;
        return id;
    }

    private setValueState() {
        if (this.control) {
            const value = this.control.value as string | number | undefined | null;
            this.hasValue = value !== undefined && value != null && value.toString().length > 0;
            this.floatingStateChange.emit(this.hasValue);
        }
    }

    updateCharCount(value: string): void {
        this.charCount.set(Math.min(value.length, this.maxCharCount));
    }

    limitCharacterCount(): void {
        const nativeElement = this.elementRef.nativeElement as HTMLInputElement | HTMLTextAreaElement;
        const currentValue = nativeElement.value || '';
        const maxCharCount = this.maxCharCount == null ? Infinity : this.maxCharCount;

        if (currentValue.length > maxCharCount) {
            nativeElement.value = currentValue.slice(0, maxCharCount);
        }
    }

    handleAutofillEvent(event: AnimationEvent) {
        if (event.animationName === 'autofill-start') {
            this.isAutofilled.set(true);
        } else if (event.animationName === 'autofill-end') {
            this.isAutofilled.set(false);
        }
    }
}
