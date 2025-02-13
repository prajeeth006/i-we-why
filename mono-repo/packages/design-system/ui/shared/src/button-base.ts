import { FocusMonitor } from '@angular/cdk/a11y';
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, booleanAttribute, inject, signal } from '@angular/core';

@Directive({
    standalone: true,
    host: {
        '[attr.disabled]': 'disabled ? true : null',
        '[attr.aria-disabled]': 'disabled ? true : null',
        '[attr.data-focus]': 'focused',
        '[attr.data-focus-visible]': 'focusVisible',
        '[class.ds-btn-inverse]': 'inverse',
        '[attr.tabindex]': 'disabled ? -1 : 0',
    },
})
export abstract class DsButtonBase implements AfterViewInit, OnDestroy {
    private _focusMonitor = inject(FocusMonitor);
    private _elementRef = inject(ElementRef);

    private _disabled = signal(false);
    private _inverse = signal(false);
    private _focused = signal(false);
    private _focusVisible = signal(false);

    get focused(): boolean {
        return this._focused();
    }
    get focusVisible() {
        return this._focusVisible();
    }
    @Input({ transform: booleanAttribute }) set disabled(value: boolean) {
        this._disabled.set(value);
    }
    get disabled() {
        return this._disabled();
    }

    @Input({ transform: booleanAttribute }) set inverse(value: boolean) {
        this._inverse.set(value);
    }
    get inverse() {
        return this._inverse();
    }

    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
            if (focusOrigin) {
                this._focused.set(true);
            }
            if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                this._focusVisible.set(true);
            }
            if (!focusOrigin && !this._disabled()) {
                this._focusVisible.set(false);
                this._focused.set(false);
            }
        });
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
}
