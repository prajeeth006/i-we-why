import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';

import Keyboard from 'simple-keyboard';

import { VIRTUAL_KEYBOARD_OPTIONS_PROVIDER, VirtualKeyboardOptionsProvider } from './virtual-keyboard-options-provider';

/**
 * @whatItDoes Renders virtual keyboard.
 *
 * @howToUse
 * ``` <vn-virtual-keyboard [caretPosition]="number" providerId="numbers" (onInput)="onInput($event) (onChange)="onChange($event)" /> ```
 *
 * Provide in your module a provider with providerId
 * { provide: VIRTUAL_KEYBOARD_OPTIONS_PROVIDER, useClass: PlaygroundVirtualKeyboardNumbersOptionsProvider, multi: true },
 *
 * @experimental
 */
@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-virtual-keyboard',
    templateUrl: 'virtual-keyboard.html',
})
export class VirtualKeyboardComponent implements AfterViewInit {
    @Input() caretPosition: number;
    @Input() providerId: string;
    @Output() onInput = new EventEmitter<string>();
    @Output() onChange = new EventEmitter<string>();
    @ViewChild('container') input: ElementRef<HTMLDivElement>;

    private keyboard: Keyboard;

    constructor(@Inject(VIRTUAL_KEYBOARD_OPTIONS_PROVIDER) private optionsProviders: VirtualKeyboardOptionsProvider[]) {}

    ngAfterViewInit(): void {
        const optionsProvider = this.optionsProviders.find((p) => p.id === this.providerId);
        if (!optionsProvider) {
            throw new Error('Virtual-keyboard provider with id ' + this.providerId + ' does not exist.');
        }
        this.initKeyboard(this.input.nativeElement, optionsProvider);
    }

    setInput(input: string, inputName: string | undefined) {
        this.keyboard.setInput(input, inputName);
    }

    private initKeyboard(element: HTMLDivElement, provider: VirtualKeyboardOptionsProvider) {
        if (this.keyboard) return;

        const options = provider.get();
        const defaultOptions = {
            onKeyPress: (key: string) => this.onKeyPress(key),
            onChange: (input: string) => this.onChange.next(input),
            theme: 'simple-keyboard hg-theme-default',
            ...options,
        };

        this.keyboard = new Keyboard(element, defaultOptions);
        if (this.caretPosition) {
            this.keyboard.setCaretPosition(this.caretPosition);
        }
    }

    private onKeyPress(key: string) {
        if (key === '{shift}') {
            this.toggleLayout();
        }
        this.onInput.next(key);
    }

    private toggleLayout() {
        const currentLayout = this.keyboard.options.layoutName;
        const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

        this.keyboard.setOptions({
            layoutName: shiftToggle,
        });
    }
}
