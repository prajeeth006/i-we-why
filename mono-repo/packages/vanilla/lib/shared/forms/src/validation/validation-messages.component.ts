import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { CommonMessages, WindowEvent } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { ValidationConfig } from './validation.client-config';

/**
 * @whatItDoes Provides a way to display form element's validation messages
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'lh-validation-messages',
    templateUrl: 'validation-messages.component.html',
})
export class ValidationMessagesComponent implements OnChanges, OnDestroy {
    @Input() showOnPristine: boolean;
    @Input() showOnEdit: boolean;
    @Input() showOnSuccess: boolean = false;
    @Input() messages: any;
    @Input() formElement: AbstractControl;
    @Input() formElementRef: any;

    focusListener: Function;
    blurListener: Function;

    private errorMessages: { [key: string]: string };
    private focused: boolean;

    constructor(
        private commonMessages: CommonMessages,
        private validationConfig: ValidationConfig,
        private renderer: Renderer2,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.messages?.currentValue) {
            this.setMessages(changes.messages.currentValue);
        }

        if (changes.formElementRef?.currentValue?.addEventListener) {
            this.focusListener = this.renderer.listen(this.formElementRef, WindowEvent.Focus, () => this.setFocused(true));
            this.blurListener = this.renderer.listen(this.formElementRef, WindowEvent.Blur, () => this.setFocused(false));
        }
    }

    ngOnDestroy() {
        if (this.focusListener) {
            this.focusListener();
        }

        if (this.blurListener) {
            this.blurListener();
        }
    }

    showErrors(): boolean {
        if (!this.hasErrors()) {
            return false;
        }

        // showOnPristine (show always)
        if (this.showOnPristine) {
            return true;
        }

        // showOnEdit
        if (this.showOnEdit && this.formElement.dirty) {
            return true;
        }

        // default mode (blurred and touched)
        return !this.showOnEdit && !this.focused && this.formElement.touched;
    }

    showSuccess(): boolean {
        return this.showOnSuccess && this.formElement && this.formElement.valid && this.formElement.touched;
    }

    getMessage(): string | null {
        if (this.formElement && !this.formElement.valid) {
            if (this.errorMessages) {
                for (const key in this.formElement.errors) {
                    let mapping: string | null = null;

                    if ((this.formElement as any).errorMapping) {
                        mapping = (this.formElement as any).errorMapping[key];
                    }

                    const error = mapping || key;
                    mapping = this.validationConfig.errorMapping[error] || error;

                    const errorMessage = this.errorMessages[mapping.toLowerCase()];

                    if (errorMessage) {
                        return errorMessage;
                    }
                }

                if (this.errorMessages[CommonMessages.GeneralValidationErrorKey.toLowerCase()] !== undefined) {
                    return this.errorMessages[CommonMessages.GeneralValidationErrorKey.toLowerCase()] || null;
                }
            }

            return this.commonMessages[CommonMessages.GeneralValidationErrorKey] || null;
        }

        return null;
    }

    setFocused(isFocused: boolean) {
        this.focused = isFocused;
    }

    private hasErrors(): boolean {
        return this.formElement?.errors ? Object.keys(this.formElement.errors).length > 0 : false;
    }

    private setMessages(messages: any) {
        this.errorMessages = {};

        for (const key in messages) {
            this.errorMessages[key.toLowerCase()] = messages[key];
        }
    }
}
