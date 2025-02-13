import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { CommonMessages, WindowEvent } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subscription } from 'rxjs';

import { Tooltip } from './custom-tooltip-messages.models';
import { ValidationConfig } from './validation.client-config';

/**
 * @whatItDoes Provides a way to display custom tooltip messages
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, IconCustomComponent],
    selector: 'lh-custom-tooltip-messages',
    templateUrl: 'custom-tooltip-messages.component.html',
})
export class CustomTooltipMessagesComponent implements OnChanges, OnDestroy {
    @Input() addInfoTooltips: string[] = [];
    @Input() messages: { [key: string]: string };
    @Input() formElement: AbstractControl;
    @Input() formElementRef: any;

    infoTooltips: Tooltip[] | null;
    tooltips: Tooltip[] | null;

    private focusListener: Function;
    private blurListener: Function;
    private valueChangesSub: Subscription | undefined;
    private errorMessages: Record<string, string>;

    constructor(
        public commonMessages: CommonMessages,
        private renderer: Renderer2,
        private validationConfig: ValidationConfig,
    ) {}

    get isVisible(): boolean {
        if (!this.tooltips?.length) {
            return false;
        }

        return this.tooltips.some((tooltip: Tooltip) => !tooltip.isValid);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.messages?.currentValue) {
            this.errorMessages = this.getMessages(changes.messages.currentValue);
        }

        if (changes.formElementRef?.currentValue) {
            this.listenToFocusBlurEvents();
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

    private getInfoTooltipsFromMessages(): Tooltip[] | null {
        if (this.errorMessages) {
            return this.sortValidations(this.createInfoTooltip(this.addInfoTooltips).concat(this.createInfoTooltip(this.errorMessages)));
        }

        return null;
    }

    private createInfoTooltip(tooltipKeys: string[] | Record<string, string>): Tooltip[] {
        return Object.keys(tooltipKeys)
            .filter((name: string) => name.includes('_infotooltip'))
            .map((name: string) => ({
                isValid: null,
                text: this.errorMessages[name] || '',
                order: this.getOrderNumber(name),
            }));
    }

    private getTooltips(): Tooltip[] {
        let displayValidations: Record<string, Tooltip> = {};

        if (!this.formElement?.valid) {
            const tooltipErrorMessages = this.getTooltipErrorsFromMessages();
            displayValidations = this.getDisplayValidations(tooltipErrorMessages);
        }

        let orderedValidations = new Array<Tooltip>();

        for (const key in displayValidations) {
            const tooltip = displayValidations[key];

            if (tooltip) {
                orderedValidations.push(tooltip);
            }
        }

        orderedValidations = this.sortValidations(orderedValidations);

        return orderedValidations;
    }

    private getDisplayValidations(tooltipErrorMessages: string[]): Record<string, Tooltip> {
        const displayValidations: Record<string, Tooltip> = {};

        for (const message of tooltipErrorMessages) {
            const validatorName = message.toLocaleLowerCase();
            const errorKey = this.getValidationConfigKey(validatorName) || validatorName;
            const tooltipKey = Object.keys(this.errorMessages).filter((k: string) => k.indexOf(validatorName + '_tooltip') > -1);

            if (tooltipKey?.length === 1 && tooltipKey[0] && this.errorMessages[tooltipKey[0]]) {
                const isValid = this.keyIsValid(errorKey);

                if (!displayValidations.hasOwnProperty(errorKey) || !isValid) {
                    // update message with same key only if is invalid
                    displayValidations[errorKey] = {
                        isValid,
                        text: this.errorMessages[tooltipKey[0]] || '',
                        order: this.getOrderNumber(tooltipKey[0]),
                    };
                }
            }
        }

        return displayValidations;
    }

    private getTooltipErrorsFromMessages(): string[] {
        return Object.keys(this.errorMessages || [])
            .filter((k: string) => k.indexOf('_tooltip') > -1)
            .map((t: string) => t.substring(0, t.indexOf('_tooltip')));
    }

    private getValidationConfigKey(validatorName: string): string | null {
        for (const key in this.validationConfig.errorMapping) {
            if (validatorName === this.validationConfig.errorMapping[key]) {
                return key;
            }
        }

        return null;
    }

    private sortValidations(tooltips: Tooltip[]): Tooltip[] {
        return tooltips.sort((a: Tooltip, b: Tooltip) => a.order - b.order);
    }

    private keyIsValid(errorKey: string): boolean | null {
        return !this.formElement?.value ? null : !(this.formElement?.errors && errorKey in this.formElement.errors);
    }

    private getOrderNumber(tooltipKey: string): number {
        const array = tooltipKey.split('tooltip_');

        return array.length === 2 && array[1] ? +array[1] : 0;
    }

    private getMessages(messages: { [key: string]: string }): Record<string, string> {
        const errMessages: Record<string, string> = {};

        for (const key in messages) {
            const message = messages[key];

            if (message) {
                errMessages[key.toLowerCase()] = message;
            }
        }

        return errMessages;
    }

    private listenToFocusBlurEvents() {
        if (this.formElementRef?.addEventListener) {
            this.focusListener = this.renderer.listen(this.formElementRef, WindowEvent.Focus, () => {
                this.setTooltips();
                this.valueChangesSub = this.formElement.valueChanges.subscribe(() => this.setTooltips());
            });

            this.blurListener = this.renderer.listen(this.formElementRef, WindowEvent.Blur, () => {
                this.valueChangesSub?.unsubscribe();
                this.tooltips = null;
                this.infoTooltips = null;
            });
        }
    }

    private setTooltips() {
        this.tooltips = this.getTooltips();
        this.infoTooltips = this.getInfoTooltipsFromMessages();
    }
}
