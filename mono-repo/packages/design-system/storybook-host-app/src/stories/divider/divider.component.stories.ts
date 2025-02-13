import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DS_DIVIDER_VARIANT_ARRAY, DsDivider } from '@frontend/ui/divider';
import { type Meta, type StoryObj } from '@storybook/angular';

const meta: Meta<DsDivider> = {
    title: 'Components/Divider',
    parameters: {
        status: generateStatusBadges('UX-2387', ['stable']),
    },
    component: DsDivider,
    excludeStories: /.*Data$/,
    argTypes: {
        vertical: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The direction of component is optional',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the divider',
        },
        variant: {
            options: DS_DIVIDER_VARIANT_ARRAY,
            table: {
                defaultValue: { summary: 'on-surface-lowest' },
                category: 'Styling',
                type: { summary: 'on-surface-lowest, on-surface-low, on-surface-high, on-surface-highest' },
            },
            control: { type: 'select' },
            description: 'The type of the divider',
        },
    },
    args: {
        vertical: false,
        inverse: false,
        variant: 'on-surface-low',
    },
    render: ({ ...args }) => ({
        props: {
            ...args,
        },
    }),
};

export default meta;
type Story = StoryObj<DsDivider>;

export const Divider: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=6243-186360&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
    },
    render: (divider) => ({
        props: divider,
        template: `
        <div style="width:359px; height: 100px; display: flex; align-items: center; justify-content: center">
            <ds-divider vertical="${divider.vertical}" [inverse]="${divider.inverse}" variant="${divider.variant}"/>
        </div>
    `,
    }),
};

export const DividerVertical: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (divider) => ({
        props: divider,
        template: `
        <div style="width:359px; height: 100px; display: flex; justify-content: center; justify-content: center">
            <ds-divider vertical variant="${divider.variant}"/>
        </div>
    `,
    }),
};

export const Inverse: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (divider) => ({
        props: divider,
        template: `
        <div style="width:359px;height: 100px; display: flex; align-items: center; justify-content: center">
            <ds-divider vertical="${divider.vertical}" [inverse]="${divider.inverse}" variant="${divider.variant}"></ds-divider>
        </div>
    `,
    }),
};
