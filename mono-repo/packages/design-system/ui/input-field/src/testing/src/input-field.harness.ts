import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, TestElement } from '@angular/cdk/testing';

import { DsInputFieldsSize } from '@frontend/ui/input-field';

export type DsInputFieldHarnessFilters = {
    disabled?: boolean;
    focused?: boolean;
    value?: string;
    isFloating?: boolean;
    size?: DsInputFieldsSize;
    isRightAligned?: boolean;
} & BaseHarnessFilters;

export class DsInputFieldHarness extends ComponentHarness {
    static hostSelector = 'ds-input-field';

    static with(options: DsInputFieldHarnessFilters = {}): HarnessPredicate<DsInputFieldHarness> {
        return new HarnessPredicate(DsInputFieldHarness, options)
            .addOption('value', options.value, async (harness, value) => (await harness.getValue()) === value)
            .addOption('size', options.size, (harness, size) => harness.hasSize(size))
            .addOption('isRightAligned', options.isRightAligned, (harness, isRightAligned) =>
                harness.isRightAligned().then((result) => result === isRightAligned),
            );
    }

    private _input = this.locatorFor('input[dsInput]');
    private _textarea = this.locatorFor('textarea[dsInput]');
    private _labelText = this.locatorFor('label');

    private async _getElement(): Promise<TestElement> {
        try {
            return await this._input();
        } catch {
            return await this._textarea();
        }
    }

    // Method to get the applied classes from the host element
    async getHostClasses(): Promise<string | null> {
        return await (await this.host()).getAttribute('class');
    }

    async focus(): Promise<void> {
        const inputElement = await this._getElement(); // Get the input element
        await inputElement.focus(); // Focus the input element
    }

    async getValue(): Promise<string> {
        const element = await this._getElement();
        return (await element.getProperty<string>('value')) || '';
    }

    // Add the setValue method
    async setValue(value: string): Promise<void> {
        const element = await this._getElement(); // Get the input or textarea element
        await element.setInputValue(value); // Use TestElement's setInputValue method to set the value
    }

    async getLabelText(): Promise<string> {
        const label = await this._labelText();
        return await label.text();
    }

    // Add a public method to expose the textarea
    async getTextarea(): Promise<TestElement> {
        return this._textarea();
    }

    /** Gets a boolean promise indicating if the form-field is inversed. */
    async isInverse(): Promise<boolean> {
        const host = await this.host();
        return await host.hasClass('ds-input-field-inverse');
    }

    // Method to check if textarea is focused and has content
    async isFocusedAndHasContent(): Promise<boolean> {
        const element = await this._getElement(); // Check either input or textarea
        const isFocused = await element.isFocused();

        /*eslint-disable @typescript-eslint/no-unsafe-assignment */
        const content = await element.getProperty('value');
        return isFocused && !!content;
    }

    // Method to check if the label is floating
    async isFloating(): Promise<boolean> {
        const label = await this._labelText();
        const input = await this._getElement(); // Check input or textarea

        const isInputEmpty = !(await input.getProperty('value'));
        const isFloatingClass = await label.hasClass('floating'); // Make sure this is the correct CSS class used for floating behavior

        // Label should float if the input has a value or the floating class is applied
        return !isInputEmpty || isFloatingClass;
    }

    // Checks if the input field is right-aligned
    async isRightAligned(): Promise<boolean> {
        const classList = await this.getHostClasses(); // Await the result of getHostClasses
        return classList?.split(' ').includes('ds-input-field-right-align') ?? false;
    }

    // Checks if a specific size is applied
    async hasSize(size: DsInputFieldsSize): Promise<boolean> {
        const classList = (await this.getHostClasses())?.split(' ');
        return classList?.includes(`ds-input-field-${size}`) ?? false;
    }
}
