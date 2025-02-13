import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';

import { WindowEvent } from '@frontend/vanilla/core';

import { CustomTooltipMessagesComponent } from '../validation/custom-tooltip-messages.component';
import { ValidationMessagesComponent } from '../validation/validation-messages.component';
import { ValidationHelperService } from './validation-helper.service';

/**
 * @beta
 */
@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, CustomTooltipMessagesComponent, ValidationMessagesComponent],
    selector: 'lh-form-field',
    templateUrl: 'form-field.component.html',
    host: {
        '[class.form-group]': 'layout == null',
        '[class.form-group-col]': 'layout === "col"',
    },
    styles: [':host { display: block; }'],
})
export class FormFieldComponent implements AfterContentInit, OnDestroy {
    @Input() labelText: string;
    @Input() floatedLabelText: string;
    @Input() validationMessages: any;
    @Input() showTooltips: boolean | string[];
    @Input() showSuccessValidation: boolean = false;
    @Input() layout: string;
    @Input() ignoreMaxLength: boolean;
    @Input() elementClass: string;
    @ContentChild(NgControl) control: NgControl;
    @ContentChild(NgControl, { read: ElementRef }) elementRef: ElementRef;

    get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    get additionalTooltips(): any[] {
        return this.showTooltips instanceof Array ? this.showTooltips : [];
    }

    get isFloating(): string | boolean | null {
        return this.hasFocus || this.hasValue || this.element.getAttribute('placeholder');
    }

    private get isSelect(): boolean {
        return this.element.tagName === 'SELECT';
    }

    private get isInput(): boolean {
        return this.element.tagName === 'INPUT';
    }

    private get isTextarea(): boolean {
        return this.element.tagName === 'TEXTAREA';
    }

    private eventListeners: any[] = [];
    private hasValue: boolean;
    private hasFocus: boolean;

    constructor(private validationHelper: ValidationHelperService) {}

    ngAfterContentInit() {
        this.setValueState();

        this.control.valueChanges!.subscribe(() => {
            this.setValueState();
        });

        this.eventListeners = [];
        this.addEventListener(this.element, WindowEvent.Focus, () => (this.hasFocus = true));
        this.addEventListener(this.element, WindowEvent.Blur, () => (this.hasFocus = false));
        /*Hack to avoid label overlapping when input autofilled*/
        this.addEventListener(this.element, WindowEvent.TransitionEnd, () => this.autoFillTransitionEnded());

        if (this.isSelect || this.isInput || this.isTextarea) {
            this.element.classList.add('form-control');
            this.element.classList.add('form-control-f-w');
        }

        if (this.isSelect) {
            this.element.classList.add('form-control-select');
        }

        if (this.isInput && !this.ignoreMaxLength) {
            const input = this.element as HTMLInputElement;
            const rules = this.validationHelper.getRules(input.name);

            if (rules?.maxLength) {
                input.maxLength = rules.maxLength;
            }
        }
    }

    ngOnDestroy() {
        this.eventListeners.forEach((listener: any) => listener.removeEventListener());
    }

    private addEventListener(target: HTMLElement, name: string, fn: any) {
        target.addEventListener(name, fn);

        this.eventListeners.push({
            removeEventListener: () => target.removeEventListener(name, fn),
        });
    }

    private autoFillTransitionEnded() {
        if (this.isInput && this.element.parentElement!.querySelector(`input[name=${(<HTMLInputElement>this.element).name}]:-webkit-autofill`)) {
            this.hasValue = true;
        }
    }

    private setValueState() {
        this.hasValue = this.control.value != undefined && this.control.value.toString().length > 0;

        if (this.hasValue) {
            this.element.classList.add('ng-not-empty');
            if (this.isSelect) {
                this.element.classList.add('selected');
                this.element.classList.remove('please-select');
            }
        } else {
            this.element.classList.remove('ng-not-empty');
            if (this.isSelect) {
                this.element.classList.add('please-select');
                this.element.classList.remove('selected');
            }
        }
    }
}
