import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DS_PROGRESS_BAR_FILLS_ARRAY, DS_PROGRESS_BAR_VARIANTS_ARRAY, DsProgressBar } from '@frontend/ui/progress-bar';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsProgressBar> = {
    title: 'Components/Progress bar',
    component: DsProgressBar,
    parameters: {
        status: generateStatusBadges('UX-2368', ['integration ready']),
    },
    excludeStories: /.*Data$/,
    argTypes: {
        variant: {
            options: DS_PROGRESS_BAR_VARIANTS_ARRAY,
            table: { defaultValue: { summary: 'primary' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The variant of the Arrow',
        },
        fill: {
            options: DS_PROGRESS_BAR_FILLS_ARRAY,
            table: { defaultValue: { summary: 'solid' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The variant of the Arrow',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the Progress bar',
        },
        showCounter: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'With the counter indicator',
        },
        value: {
            type: 'number',
            table: { defaultValue: { summary: '50' } },
            control: {
                type: 'range',
                min: 0,
                max: 100,
                step: 1,
            },
        },
    },
    args: {
        variant: 'primary',
        fill: 'solid',
        inverse: false,
        value: 50,
        showCounter: false,
    },
    decorators: [moduleMetadata({ imports: [DsProgressBar] })],
};

export default meta;

type Story = StoryObj<DsProgressBar>;

export const Default: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        template: `
        <div style="width:300px;">
            <ds-progress-bar value="${args.value}" fill="${args.fill}" showCounter="${args.showCounter}" inverse="${args.inverse}" variant="${args.variant}" />
            </div>
        `,
    }),
};

export const WithCounter: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
        showCounter: true,
    },
    render: (args) => ({
        template: `
        <div style="width:300px;">
            <ds-progress-bar value="${args.value}" fill="${args.fill}" showCounter="${args.showCounter}" inverse="${args.inverse}" variant="${args.variant}" />
            </div>
        `,
    }),
};

export const WithPatternFill: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
        showCounter: false,
        fill: 'pattern',
    },
    render: (args) => ({
        template: `
        <div style="width:300px;">
            <ds-progress-bar value="${args.value}" fill="${args.fill}" showCounter="${args.showCounter}" inverse="${args.inverse}" variant="${args.variant}" />
            </div>
        `,
    }),
};

export const WithSubtext: Story = {
    args: {
        ...meta.args,
        showCounter: false,
        fill: 'solid',
    },
    render: (args) => ({
        template: `
        <div style="width:300px;">
            <ds-progress-bar value="${args.value}" fill="${args.fill}" showCounter="${args.showCounter}" inverse="${args.inverse}" variant="${args.variant}">
                <div slot="start">Subtext</div>
                <div slot="end">Subtext</div>
            </ds-progress-bar>
        </div>
        `,
    }),
};
