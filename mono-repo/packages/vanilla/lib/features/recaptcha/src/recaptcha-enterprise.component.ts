import { Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { first } from 'rxjs';

import { RecaptchaEnterpriseService } from './recaptcha-enterprise.service';

@Component({
    standalone: true,
    selector: 'vn-recaptcha-enterprise',
    templateUrl: 'recaptcha-enterprise.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // eslint-disable-next-line @angular-eslint/no-forward-ref
            useExisting: forwardRef(() => RecaptchaEnterpriseComponent),
            multi: true,
        },
    ],
})
export class RecaptchaEnterpriseComponent implements ControlValueAccessor, OnInit {
    @Input() action: string;
    @Output() success = new EventEmitter<string>();

    @ViewChild('captchaWrapperElem', { static: true }) reCaptchaContainer: ElementRef;

    onChange: (val: string) => void;
    onTouched: () => void;

    private readonly reCaptchaEnterpriseService = inject(RecaptchaEnterpriseService);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.reCaptchaEnterpriseService.action = this.action;

        this.reCaptchaEnterpriseService.initReCaptchaAPI();

        this.reCaptchaEnterpriseService.scriptLoaded.pipe(first((ready: boolean) => ready)).subscribe(() => {
            this.reCaptchaEnterpriseService.renderRecaptcha(this.reCaptchaContainer.nativeElement);
        });

        this.reCaptchaEnterpriseService.success.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((token: string) => {
            this.success.next(token);
        });
    }

    registerOnChange(fn: (val: string) => void) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeValue(_obj: any) {
        // This is intentional
    }

    execute() {
        this.reCaptchaEnterpriseService.executeRecaptcha(this.action);
    }

    reset() {
        this.reCaptchaEnterpriseService.resetCaptcha();
    }
}
