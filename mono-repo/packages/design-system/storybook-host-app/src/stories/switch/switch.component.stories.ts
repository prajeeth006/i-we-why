import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DsSwitch } from '@frontend/ui/switch';
import { type Meta, type StoryObj } from '@storybook/angular';

const meta: Meta<DsSwitch> = {
    title: 'Components/Switch',
    parameters: {
        status: generateStatusBadges('UX-2395', ['integration ready']),
    },
    component: DsSwitch,
    excludeStories: /.*Data$/,
    argTypes: {
        disabled: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The disabled state of the switch',
        },
        checked: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The checked state of the switch',
        },
    },
    args: {
        disabled: false,
        checked: true,
    },
    render: ({ ...args }) => ({
        props: {
            ...args,
        },
    }),
};

export default meta;
type Story = StoryObj<DsSwitch>;

export const WithLabel: Story = {
    parameters: {
        name: 'WithLabel',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=8081-300444&&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
    },
    render: (dsSwitch) => ({
        props: dsSwitch,
        template: `
            <ds-switch [checked]="${dsSwitch.checked}" [disabled]="${dsSwitch.disabled}">
                <span slot="labelOff">Label 1</span>
                <span slot="labelOn">Label 2</span>
            </ds-switch>
    `,
    }),
};

export const WithoutLabel: Story = {
    parameters: {
        name: 'WithLabel',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=8081-300444&&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
    },
    render: (dsSwitch) => ({
        props: dsSwitch,
        template: `
            <ds-switch [checked]="${dsSwitch.checked}" [disabled]="${dsSwitch.disabled}">
                <span slot="labelOff" class="sr-only">>Label 1</span>
                <span slot="labelOn" class="sr-only">>Label 2</span>
            </ds-switch>
    `,
    }),
};
