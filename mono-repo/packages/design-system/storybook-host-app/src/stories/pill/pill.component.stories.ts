import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { DS_PILL_SIZE_ARRAY, DS_PILL_VARIANTS_ARRAY, DsPill } from '@frontend/ui/pill';
import { DS_SCROLL, DsComplexityRatingComponent, getVariantInfo } from '@frontend/ui/utils';
import { action } from '@storybook/addon-actions';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { expect, fireEvent, fn, userEvent, within } from '@storybook/test';

import { allThemes } from '../../modes';

export const actionsData = {
    onClick: fn(action('clicked')),
    onFocus: fn(action('focus')),
    onBlur: fn(action('blur')),
};

type DsPillStoryType = DsPill & { label: string };

const meta: Meta<DsPillStoryType> = {
    title: 'Components/Pill',
    parameters: {
        status: generateStatusBadges('UX-2310', ['a11y', 'stable']),
    },
    component: DsPill,
    excludeStories: /.*Data$/,
    argTypes: {
        label: {
            type: 'string',
            table: { defaultValue: { summary: 'Hello world!' } },
            control: 'text',
            description: 'The text of the pill',
        },
        variant: {
            options: DS_PILL_VARIANTS_ARRAY,
            table: {
                defaultValue: { summary: 'current' },
                category: 'Styling',
                type: { summary: 'current, subtle, strong' },
            },
            control: { type: 'select' },
            description: 'The variant of the pill',
        },
        size: {
            options: DS_PILL_SIZE_ARRAY,
            table: {
                defaultValue: { summary: 'medium' },
                category: 'Styling',
                type: { summary: 'small, medium' },
            },
            control: { type: 'select' },
            description: 'The size of the pill',
        },
        selected: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The selected state of the pill',
        },
        disabled: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The disabled state of the pill',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the pill',
        },
    },
    args: {
        selected: false,
        variant: 'current',
        size: 'medium',
        disabled: false,
        label: 'Hello world!',
        inverse: false,
    },
    decorators: [moduleMetadata({ imports: [DsPill, DsNotificationBubble, DemoIconComponent, DS_SCROLL] })],
};

export default meta;

type Story = StoryObj<DsPillStoryType>;

export const Default: Story = {
    args: {
        ...meta.args,
    },
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7669-106323&mode=design&t=uaH2on23RS2xucVk-4',
        },
    },
    render: (args) => ({
        props: {
            ...args,
            click: actionsData.onClick,
            focus: actionsData.onFocus,
            blur: actionsData.onBlur,
        },
        template: `
            <button ds-pill ${argsToTemplate(
                {
                    ...args,
                    click: actionsData.onClick,
                    focus: actionsData.onFocus,
                    blur: actionsData.onBlur,
                },
                { exclude: ['label'] },
            )}>
                ${args.label}
            </button>
        `,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        await fireEvent.focus(button);
        await expect(actionsData.onFocus).toHaveBeenCalled();
        await userEvent.click(button);
        await expect(actionsData.onClick).toHaveBeenCalled();
    },
};

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

export const DefaultWithChevron: Story = {
    args: {
        ...meta.args,
    },
    parameters: {
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7669-106330&mode=design&t=oFzZ6cIEOqVsjbTJ-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DsPill, DsNotificationBubble] })],
    render: (args) => ({
        props: {
            ...args,
            click: actionsData.onClick,
            focus: actionsData.onFocus,
            blur: actionsData.onBlur,
        },
        template: `
            <button ds-pill ${argsToTemplate(
                {
                    ...args,
                    click: actionsData.onClick,
                    focus: actionsData.onFocus,
                    blur: actionsData.onBlur,
                },
                { exclude: ['label'] },
            )}>
                ${args.label}
                <ds-demo-icon iconName="chevron" slot="end"/>
            </button>
        `,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        await fireEvent.focus(button);
        await expect(actionsData.onFocus).toHaveBeenCalled();
        await userEvent.click(button);
        await expect(actionsData.onClick).toHaveBeenCalled();
    },
};

export const WithIcon: Story = {
    args: meta.args,
    parameters: {
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7669-106336&mode=design&t=1rek13jE3LNgnnQJ-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DsPill] })],
    render: (args) => ({
        template: `
            <button ds-pill [selected]="${args.selected}" [variant]="'${args.variant}'" [size]="'${args.size}'" [disabled]="${args.disabled}" [inverse]="${args.inverse}">
              ${args.label}
              <ds-demo-icon slot="start"/>
            </button>
        `,
    }),
};

export const WithIconAndChevron: Story = {
    args: meta.args,
    parameters: {
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7669-106343&mode=design&t=1rek13jE3LNgnnQJ-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DsPill] })],
    render: (args) => ({
        template: `
            <button ds-pill [selected]="${args.selected}" [variant]="'${args.variant}'" [size]="'${args.size}'" [disabled]="${args.disabled}" [inverse]="${args.inverse}">
              ${args.label}
              <ds-demo-icon slot="start"/>
              <ds-demo-icon iconName="chevron" slot="end"/>
            </button>
        `,
    }),
};

export const WithLargeNotificationBubbleAndRoundedPadding: Story = {
    args: meta.args,
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7669-106350&mode=design&t=1rek13jE3LNgnnQJ-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DsPill, DsNotificationBubble] })],
    render: (args) => ({
        template: `
            <button ds-pill [selected]="${args.selected}" [variant]="'${args.variant}'" [size]="'${args.size}'" [disabled]="${args.disabled}" [inverse]="${args.inverse}">
                ${args.label}
                <ds-notification-bubble slot="end" variant="neutral" size="${args.size === 'medium' ? 'large' : 'medium'}">60</ds-notification-bubble>
            </button>
        `,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        await expect(button).toHaveClass('ds-pill ds-pill-current ds-pill-medium ds-pill-rounded-padding');
    },
};

export const WithIconAndNotificationBubble: Story = {
    args: meta.args,
    parameters: {
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7669-106370&mode=design&t=1rek13jE3LNgnnQJ-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DsPill, DsNotificationBubble] })],
    render: (args) => ({
        template: `
            <button ds-pill [selected]="${args.selected}" [variant]="'${args.variant}'" [size]="'${args.size}'" [disabled]="${args.disabled}" [inverse]="${args.inverse}">
                ${args.label}
                <ds-demo-icon slot="start"/>  
                <ds-notification-bubble slot="end" size="${args.size === 'medium' ? 'large' : 'medium'}" variant="neutral">10</ds-notification-bubble>
            </button>
        `,
    }),
};

export const SmallExamples: Story = {
    tags: ['docs-template'],
    parameters: {
        docs: {
            source: {
                code: null,
            },
        },
    },
    render: (args) => ({
        props: args,
        template: `
        ${(['current', 'subtle', 'strong'] as Array<'current' | 'subtle' | 'strong'>)
            .map(
                (variant) => `
            <h3 style="text-align: center;">${variant.charAt(0).toUpperCase() + variant.slice(1)} Variant</h3>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); grid-row-gap: 1em; grid-column-gap: 1em; align-items: center; justify-items: center;">
                ${renderHeaderRow()}
                ${renderRow('No slots', variant, 'small', {})}
                ${renderRow('No slots, Chevron', variant, 'small', { showChevron: true })}
                ${renderRow('Icon', variant, 'small', { showIcon: true })}
                ${renderRow('Icon, Chevron', variant, 'small', { showIcon: true, showChevron: true })}
                ${renderRow('Right slot', variant, 'small', { showCounter: true })}
                ${renderRow('Icon, Right slot', variant, 'small', { showIcon: true, showCounter: true })}
                ${renderRow('Icon, Right slot, Chevron', variant, 'small', { showIcon: true, showCounter: true, showChevron: true })}
            </div>
        `,
            )
            .join('')}
        `,
    }),
};

export const MediumExamples: Story = {
    tags: ['docs-template'],
    parameters: {
        docs: {
            source: {
                code: null,
            },
        },
    },
    render: (args) => ({
        props: args,
        template: `
            ${(['current', 'subtle', 'strong'] as Array<'current' | 'subtle' | 'strong'>)
                .map(
                    (variant) => `
                <h3 style="text-align: center;">${variant.charAt(0).toUpperCase() + variant.slice(1)} Variant</h3>
                <div style="display: grid; grid-template-columns: repeat(6, 1fr); grid-row-gap: 1em; grid-column-gap: 1em; align-items: center; justify-items: center;">
                    ${renderHeaderRow()}
                    ${renderRow('No slots', variant, 'medium', {})}
                    ${renderRow('No slots, Chevron', variant, 'medium', { showChevron: true })}
                    ${renderRow('Icon', variant, 'medium', { showIcon: true })}
                    ${renderRow('Icon, Chevron', variant, 'medium', { showIcon: true, showChevron: true })}
                    ${renderRow('Right slot', variant, 'medium', { showCounter: true })}
                    ${renderRow('Icon, Right slot', variant, 'medium', { showIcon: true, showCounter: true })}
                    ${renderRow('Icon, Right slot, Chevron', variant, 'medium', { showIcon: true, showCounter: true, showChevron: true })}
                </div>
            `,
                )
                .join('')}
        `,
    }),
};

function renderRow(
    name: string,
    variant: 'current' | 'subtle' | 'strong',
    size: 'small' | 'medium',
    { showIcon = false, showCounter = false, showChevron = false } = {},
) {
    const notificationBubbleSize = size === 'medium' ? 'large' : 'medium';
    const notificationBubbleElement = `<ds-notification-bubble slot="end" variant="neutral" size="${notificationBubbleSize}">0</ds-notification-bubble>`;
    const notificationBubbleOrChevron =
        showChevron || showCounter
            ? `
                ${showCounter ? notificationBubbleElement : ''}
                ${showChevron ? '<ds-demo-icon iconName="chevron" slot="end" />' : ''}
            `
            : '';

    return `
        <span style="justify-self: start;">${name}</span>
        <div>
            <button ds-pill variant="${variant}" size="${size}" [selected]="false" [disabled]="false">
                Label
                ${showIcon ? '<ds-demo-icon slot="start"/>' : ''}
                ${notificationBubbleOrChevron}
            </button>
        </div>
        <div>
            <button ds-pill variant="${variant}" size="${size}" [selected]="true" [disabled]="false">
                Label
                ${showIcon ? '<ds-demo-icon slot="start"/>' : ''}
                ${notificationBubbleOrChevron}
            </button>
        </div>
        <div>
            <button ds-pill variant="${variant}" size="${size}" [selected]="false" [disabled]="true">
                Label
                ${showIcon ? '<ds-demo-icon slot="start"/>' : ''}
                ${notificationBubbleOrChevron}
            </button>
        </div>
        <div class="pseudo-hover-all">
            <button ds-pill variant="${variant}" size="${size}" [selected]="false" [disabled]="false">
                Label
                ${showIcon ? '<ds-demo-icon slot="start"/>' : ''}
                ${notificationBubbleOrChevron}
            </button>
        </div>
        <div class="pseudo-active-all">
            <button ds-pill variant="${variant}" size="${size}" [selected]="false" [disabled]="false">
                Label
                ${showIcon ? '<ds-demo-icon slot="start"/>' : ''}
                ${notificationBubbleOrChevron}
            </button>
        </div>
    `;
}

function renderHeaderRow() {
    return `
    <strong style="justify-self: start;">Type</strong>
    <strong>Default</strong>
    <strong>Selected</strong>
    <strong>Disabled</strong>
    <strong>Hover</strong>
    <strong>Pressed</strong>
    `;
}

export const ChromaticTestStory: Story = {
    tags: ['docs-template'],
    parameters: {
        chromatic: {
            modes: allThemes,
            disableSnapshot: false,
        },
    },
    render: (args) => ({
        props: args,
        template: `
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); grid-row-gap: 1em; grid-column-gap: 1em; align-items: center; justify-items: center;">
               ${renderHeaderRow()}
               
               <div style="grid-column: span 6"></div>
               <div style="grid-column: span 6; justify-self: start;"><strong>Small</strong></div>
               
               ${renderRow('No slots', 'current', 'small', {})}
               ${renderRow('No slots, Chevron', 'current', 'small', { showChevron: true })}
               ${renderRow('Icon', 'current', 'small', { showIcon: true })}
               ${renderRow('Icon, Chevron', 'current', 'small', { showIcon: true, showChevron: true })}
               ${renderRow('Right slot', 'current', 'small', { showCounter: true })}
               ${renderRow('Right slot, Chevron', 'current', 'small', { showCounter: true, showChevron: true })}
               ${renderRow('Icon, Right slot', 'current', 'small', { showIcon: true, showCounter: true })}
               ${renderRow('Icon, Right slot, Chevron', 'current', 'small', { showIcon: true, showCounter: true, showChevron: true })}
               
               <div style="grid-column: span 6"></div>
               <div style="grid-column: span 6; justify-self: start;"><strong>Medium</strong></div>
               ${renderRow('No slots', 'current', 'medium', {})}
               ${renderRow('No slots, Chevron', 'current', 'medium', { showChevron: true })}
               ${renderRow('Icon', 'current', 'medium', { showIcon: true })}
               ${renderRow('Icon, Chevron', 'current', 'medium', { showIcon: true, showChevron: true })}
               ${renderRow('Right slot', 'current', 'medium', { showCounter: true })}
               ${renderRow('Right slot, Chevron', 'current', 'medium', { showCounter: true, showChevron: true })}
               ${renderRow('Icon, Right slot', 'current', 'medium', { showIcon: true, showCounter: true })}
               ${renderRow('Icon, Right slot, Chevron', 'current', 'medium', { showIcon: true, showCounter: true, showChevron: true })}
        
        </div>
        `,
    }),
};
