import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable, inject } from '@angular/core';

import { DeviceService, WINDOW } from '@frontend/vanilla/core';

/**
 * @whatItDoes Represents service to interact with clipboard.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 *
 * @experimental
 */
@Injectable({ providedIn: 'root' })
export class ClipboardService {
    private clipboard = inject(Clipboard);
    private deviceService = inject(DeviceService);
    private textAreaElement: HTMLTextAreaElement | undefined;
    readonly #window = inject(WINDOW);

    private get document(): Document {
        return this.#window.document;
    }

    /**
     * @description Copy the provided text to clipboard.
     * @param text Text to copy to clipboard
     * @returns `boolean` indicating if the text was copied to clipboard
     *
     * @example
     * ```typescript
     * clipboardService.copyFromContent('content');
     * ```
     */
    copy(text: string): boolean {
        if (this.clipboard.copy(text)) {
            return true;
        }

        // Fallback for browsers that do not support clipboard API
        this.removeTextArea();

        this.textAreaElement = this.createTextArea();
        this.document.body.appendChild(this.textAreaElement);
        this.textAreaElement.value = text;

        try {
            this.selectTextArea(this.textAreaElement);
            const copied = this.document.execCommand('copy');
            this.clearSelection(this.textAreaElement);

            this.removeTextArea();

            return copied;
        } catch {
            this.removeTextArea();

            return false;
        }
    }

    // Create a temp Textarea element to copy from
    private createTextArea(): HTMLTextAreaElement {
        const isRtl = this.document.documentElement.getAttribute('dir') === 'rtl';
        const textArea = this.document.createElement('textarea');

        // Prevent zooming on iOS
        textArea.style.fontSize = '12pt';

        // Reset box model
        textArea.style.border = '0';
        textArea.style.padding = '0';
        textArea.style.margin = '0';

        // Move element out of screen horizontally
        textArea.style.position = 'absolute';
        textArea.style[isRtl ? 'right' : 'left'] = '-9999px';

        // Move element to the same position vertically
        const yPosition = this.#window.scrollY || this.document.documentElement.scrollTop;
        textArea.style.top = yPosition + 'px';
        textArea.setAttribute('readonly', '');

        return textArea;
    }

    private selectTextArea(element: HTMLTextAreaElement) {
        if (this.deviceService.isiOS) {
            const editable = element.contentEditable;
            const readOnly = element.readOnly;

            element.contentEditable = 'true';
            element.readOnly = true;

            const range = this.document.createRange();
            range.selectNodeContents(element);

            const selection = this.#window.getSelection();

            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            element.setSelectionRange(0, 999999);
            element.contentEditable = editable;
            element.readOnly = readOnly;
        } else {
            element.select();
        }
    }

    // Removes current selection and focus from target element.
    private clearSelection(element: HTMLTextAreaElement) {
        element?.blur();
        this.#window.getSelection()?.removeAllRanges();
    }

    private removeTextArea() {
        if (this.textAreaElement) {
            this.document.body.removeChild(this.textAreaElement);
            this.textAreaElement = undefined;
        }
    }
}
