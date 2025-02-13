import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DS_RADIO_SIZE_ARRAY, DsRadioButton, DsRadioGroup } from '@frontend/ui/radio-button';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsRadioGroup> = {
    title: 'Components/Radio Button',
    parameters: {
        status: generateStatusBadges('UX-2390', ['a11y', 'integration ready']),
    },
    component: DsRadioGroup,
    decorators: [
        moduleMetadata({
            imports: [FormsModule, ReactiveFormsModule, DsRadioGroup, DsRadioButton],
        }),
    ],
    argTypes: {
        value: {
            control: 'text',
            description: 'Selected value of the radio group',
        },
        size: {
            options: DS_RADIO_SIZE_ARRAY,
            table: { defaultValue: { summary: 'large' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The size of the Radio button',
        },
        disabled: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The disabled state of the pill',
        },
    },
    args: {
        value: '1',
        size: 'large',
        disabled: false,
    },
};

export default meta;

type Story = StoryObj<DsRadioGroup>;

export const Default: Story = {
    args: {
        value: '1',
        size: 'large',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `
      <ds-radio-group size="${args.size}" [value]="value" (valueChange)="value = $event">
        <ds-radio-button value="1" name="options">Option 1</ds-radio-button>
        <ds-radio-button value="2" name="options">Option 2</ds-radio-button>
        <ds-radio-button value="3" name="options" [disabled]="disabled">Option 3</ds-radio-button>
      </ds-radio-group>
    `,
    }),
};

export const WithLabel: Story = {
    args: {
        value: '1',
        size: 'large',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `
      <ds-radio-group size="${args.size}" [value]="value" (valueChange)="value = $event">
        <ds-radio-button value="1" name="options" [disabled]="disabled">Label</ds-radio-button>
      </ds-radio-group>
    `,
    }),
};

export const WithoutLabel: Story = {
    args: {
        value: '1',
        size: 'large',
        disabled: false,
    },
    render: (args) => ({
        props: args,
        template: `
      <ds-radio-group size="${args.size}" [value]="value" (valueChange)="value = $event">
        <ds-radio-button value="1" name="options" [disabled]="disabled">
            <span class="sr-only">Label</span>
        </ds-radio-button>
      </ds-radio-group>
    `,
    }),
};

// FormsModule with ngModel story
export const NgModelExample: Story = {
    args: {
        value: '1',
        size: 'large',
        disabled: false,
    },
    render: (args) => ({
        props: {
            ...args,
            value: args.value,
        },
        template: `
      <form>
        <ds-radio-group [(ngModel)]="value" name="radioGroup" size="${args.size}">
          <ds-radio-button value="1" name="options">Option 1</ds-radio-button>
          <ds-radio-button value="2" name="options">Option 2</ds-radio-button>
          <ds-radio-button value="3" name="options" [disabled]="disabled">Option 3</ds-radio-button>
        </ds-radio-group>
        <p>Selected Value: {{ value }}</p>
      </form>
    `,
    }),
};

// ReactiveFormsModule example story
export const ReactiveFormsExample: Story = {
    args: {
        value: '1',
        size: 'large',
        disabled: false,
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormGroup({
                radioGroup: new FormControl(args.value),
            }),
        },
        template: `
      <form [formGroup]="form">
        <ds-radio-group [value]="value" (valueChange)="value = $event" formControlName="radioGroup" size="${args.size}">
          <ds-radio-button value="1" name="options">Option 1</ds-radio-button>
          <ds-radio-button value="2" name="options">Option 2</ds-radio-button>
          <ds-radio-button value="3" name="options" [disabled]="disabled">Option 3</ds-radio-button>
        </ds-radio-group>
      </form>
    `,
    }),
};
