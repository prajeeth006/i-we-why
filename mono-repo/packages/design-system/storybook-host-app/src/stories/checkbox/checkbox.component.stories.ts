import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DS_CHECKBOX_SIZE_ARRAY, DsCheckbox } from '@frontend/ui/checkbox';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type DsCheckboxStoryType = DsCheckbox & { label: string };

const meta: Meta<DsCheckboxStoryType> = {
    title: 'Components/Checkbox',
    parameters: {
        status: generateStatusBadges('UX-2391', ['a11y', 'integration ready']),
    },
    component: DsCheckbox,
    argTypes: {
        checked: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The checked state of the checkbox',
            if: { arg: 'indeterminate', truthy: false },
        },

        indeterminate: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The indeterminate state of the checkbox',
        },
        disabled: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The disabled state of the checkbox',
        },

        size: {
            options: DS_CHECKBOX_SIZE_ARRAY,
            control: { type: 'select' },
            description: 'The size of the checkbox',
        },
        ariaLabel: {
            type: 'string',
            description: 'The aria-label for the checkbox',
            table: {
                disable: true,
            },
        },
        ariaLabelledby: {
            type: 'string',
            description: 'ID of the element that labels the checkbox',
            table: {
                disable: true,
            },
        },
        ariaDescribedby: {
            type: 'string',
            description: 'ID of the element that describes the checkbox',
            table: {
                disable: true,
            },
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The inverse state of the Segmented Control',
        },
    },
    args: {
        checked: false,
        indeterminate: false,
        size: 'large',
        disabled: false,
        ariaLabel: 'Checkbox',
        ariaLabelledby: '',
        ariaDescribedby: '',
        inverse: false,
    },
    decorators: [
        moduleMetadata({
            imports: [ReactiveFormsModule, FormsModule, DsCheckbox],
        }),
    ],
};

export default meta;
type Story = StoryObj<DsCheckboxStoryType>;

export const WithLabel: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: args,
        template: `
     <ds-checkbox
        [checked]="${args.checked}"
        [indeterminate]="${args.checked ? false : args.indeterminate}"
        [disabled]="${args.disabled}"
        size="${args.size}"
        [inverse]="${args.inverse}"
    >label</ds-checkbox>
    `,
    }),
};

export const Checked: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
        checked: true,
    },
    render: (args) => ({
        props: args,
        template: `
      <ds-checkbox
        [checked]="${args.checked}"
        [disabled]="${args.disabled}"
        size="${args.size}"
        [inverse]="${args.inverse}"
      ></ds-checkbox>
    `,
    }),
};

export const Indeterminate: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
        indeterminate: true,
    },
    render: (args) => ({
        props: args,
        template: `
      <ds-checkbox
        [disabled]="${args.disabled}"
        [indeterminate]="${args.indeterminate}"
        size="${args.size}"
        [inverse]="${args.inverse}"
      ></ds-checkbox>
    `,
    }),
};

export const WithoutLabel: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: args,
        template: `
     <ds-checkbox
        [checked]="${args.checked}"
        [indeterminate]="${args.checked ? false : args.indeterminate}"
        [disabled]="${args.disabled}"
        size="${args.size}"
        [inverse]="${args.inverse}"
    ></ds-checkbox>
    `,
    }),
};

// FormsModule with ngModel story
export const NgModelExample: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
        },
        template: `
      <form>
       <ds-checkbox [(ngModel)]="value" name="checkBox" 
        [checked]="${args.checked}"
        [indeterminate]="${args.checked ? false : args.indeterminate}"
        [disabled]="${args.disabled}"
        size="${args.size}"
    >label</ds-checkbox>
      </form>
    `,
    }),
};

// ReactiveFormsModule example story
export const ReactiveFormsExample: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args1) => ({
        props: {
            ...args1,
            form: new FormBuilder().group({
                confirm: [false, Validators.requiredTrue],
            }),
        },
        template: `
            <form [formGroup]="form">
                <ds-checkbox formControlName="confirm"> label 1 </ds-checkbox>
            </form>`,
    }),
};
