import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DS_Arrow_VARIANT_ARRAY, DsArrow, Ds_Arrow_Size_ARRAY } from '@frontend/ui/arrow';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsArrow> = {
    title: 'Components/Arrow',
    component: DsArrow,
    parameters: {
        status: generateStatusBadges('UX-2368', ['stable']),
    },
    excludeStories: /.*Data$/,
    argTypes: {
        size: {
            options: Ds_Arrow_Size_ARRAY,
            table: { defaultValue: { summary: 'large' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The size of the Arrow',
        },
        direction: {
            options: ['left', 'right'],
            table: { defaultValue: { summary: 'left' } },
            control: { type: 'select' },
            description: 'The direction of the Arrow',
        },
        variant: {
            options: DS_Arrow_VARIANT_ARRAY,
            table: { defaultValue: { summary: 'strong' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The variant of the Arrow',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the arrow',
        },
    },
    args: {
        size: 'large',
        direction: 'left',
        variant: 'strong',
        inverse: false,
    },
    decorators: [moduleMetadata({ imports: [DsArrow] })],
};

export default meta;

type Story = StoryObj<DsArrow>;

export const Default: Story = {
    args: {
        ...meta.args,
    },
    render: (arrow) => ({
        template: `
            <ds-arrow size="${arrow.size}" direction="${arrow.direction}"
            variant="${arrow.variant}" inverse="${arrow.inverse}" />
        `,
    }),
};

export const WithCustomIcon: Story = {
    args: {
        ...meta.args,
    },
    render: (arrow) => ({
        template: `
            <ds-arrow size="${arrow.size}" direction="${arrow.direction}" variant="${arrow.variant}" inverse="${arrow.inverse}">
                <ng-template #dsArrow>
                    <svg viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.281018 10.3847L9.28102 19.695L10.719 18.305L2.41443 9.71403L10.6946 1.71939L9.30541 0.280582L0.305412 8.97024C0.114541 9.15453 0.00472972 9.40712 0.000154933 9.6724C-0.00441985 9.93768 0.0966153 10.1939 0.281018 10.3847Z" fill="currentColor"/>
                    </svg>
                </ng-template>
            </ds-arrow>
        `,
    }),
};
