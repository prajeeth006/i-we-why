import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DS_NOTIFICATION_BUBBLE_SIZE_ARRAY, DS_NOTIFICATION_BUBBLE_VARIANT_ARRAY, DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { DsComplexityRatingComponent, getVariantInfo } from '@frontend/ui/utils';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { allThemes } from '../../modes';

type DsNotificationBubbleNgContentControls = {
    value?: number;
};

const meta: Meta<DsNotificationBubble & DsNotificationBubbleNgContentControls> = {
    title: 'Components/Notification Bubble',
    component: DsNotificationBubble,
    parameters: {
        status: generateStatusBadges('UX-2831', ['stable']),
    },
    excludeStories: /.*Data$/,

    argTypes: {
        value: {
            type: 'number',
            table: { defaultValue: { summary: '0' } },
            control: {
                type: 'number',
                min: 0,
                max: 999,
                step: 1,
            },
            description: 'The number of the notification bubble',
            if: { arg: 'variant', neq: 'live-dot' },
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the notification bubble',
        },

        size: {
            options: DS_NOTIFICATION_BUBBLE_SIZE_ARRAY,
            table: { defaultValue: { summary: 'medium' }, category: 'Styling', type: { summary: 'small, medium, large' } },
            control: { type: 'select' },
            description: 'The size of the notification bubble',
        },
        variant: {
            options: DS_NOTIFICATION_BUBBLE_VARIANT_ARRAY,
            table: {
                defaultValue: { summary: 'primary' },
                category: 'Styling',
                type: { summary: 'primary, utility, live, neutral,live-dot,utility-dot' },
            },
            control: { type: 'select' },
            description: 'The type of the notification bubble',
        },
        disabled: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The disabled state of the notification bubble',
        },
    },
    args: {
        // default args
        variant: 'primary',
        size: 'medium',
        value: 0,
        disabled: false,
        inverse: false,
    },
    decorators: [moduleMetadata({ imports: [DsNotificationBubble] })],
};
export default meta;
type Story = StoryObj<DsNotificationBubble & DsNotificationBubbleNgContentControls>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=16260-361335&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
    },
    render: ({ ...args }) => ({
        template: ['live-dot', 'utility-dot'].includes(args.variant as string) ? renderTwo(args) : renderOne(args),
    }),
};

const renderOne = (args: any) => `
        <ds-notification-bubble variant="${args.variant}" disabled="${args.disabled}" size="${args.size}" [inverse]="${args.inverse}" >
        ${args.value}
        </ds-notification-bubble>
    `;
const renderTwo = (args: any) => `
    <ds-notification-bubble variant="${args.variant}" disabled="${args.disabled}" size="${args.size}" [inverse]="${args.inverse}" >
    </ds-notification-bubble>
`;

export const variantInfo = {
    ...getVariantInfo(meta),
    tags: ['docs-template'],
};

export const ComplexityLevel: Story = {
    tags: ['docs-template'],

    render: () => ({
        moduleMetadata: {
            imports: [DsComplexityRatingComponent],
        },
        template: `
            <ds-complexity-rating 
                [totalVariants]="variantInfo.totalCombinations"
                [variantOptions]="variantInfo.variantOptions"
                [sizeOptions]="variantInfo.sizeOptions"
            ></ds-complexity-rating>
        `,
        props: {
            variantInfo,
        },
    }),
};
export const AllNotificationBubbleDocs: Story = {
    tags: ['docs-template'],
    parameters: {
        chromatic: {
            modes: allThemes,
            disableSnapshot: false,
        },
        a11y: {
            disable: true,
        },
    },
    decorators: [moduleMetadata({ imports: [DsNotificationBubble] })],
    render: (args) => getRenderedTemplate(args),
};

function getRenderedTemplate(args: any) {
    return {
        props: args,
        template: `
            <div style="display: grid; grid-gap: 10px; grid-template-columns: repeat(15, 1fr); justify-items: center; align-items: center;">
                ${generateHeader()}
                ${generateCounters('Large')}
                ${generateCounters('Medium')}
                ${generateCounters('Small')}
            </div>
        `,
    };
}

function generateHeader() {
    return `
        <strong>Type</strong>
        <strong style="grid-column: span 2">Primary</strong>
        <strong style="grid-column: span 2">Utility</strong>
        <strong style="grid-column: span 2">Live</strong>
        <strong style="grid-column: span 2">Neutral</strong>
        <strong style="grid-column: span 2">Live Dot</strong>
        <strong style="grid-column: span 2">Utility Dot</strong>
        <strong style="grid-column: span 2">Disabled</strong>
    `;
}

function generateCounters(size: string) {
    const variants = ['primary', 'utility', 'live', 'neutral', 'live-dot', 'utility-dot'];
    const disabledCounters = `<ds-notification-bubble size="${size.toLowerCase()}" disabled="true">0</ds-notification-bubble>
    <ds-notification-bubble size="${size.toLowerCase()}" disabled="true">888</ds-notification-bubble>`;

    return `
        <div style="display: contents;">
            <strong>${size}</strong>
            ${variants
                .map(
                    (variant) => `
                <ds-notification-bubble size="${size.toLowerCase()}" variant="${variant}" disabled="false">${variant.includes('dot') ? '' : '0'}</ds-notification-bubble>
                <ds-notification-bubble size="${size.toLowerCase()}" variant="${variant}" disabled="false">${variant.includes('dot') ? '' : '888'}</ds-notification-bubble>
            `,
                )
                .join('')}
            ${disabledCounters}
        </div>
    `;
}
