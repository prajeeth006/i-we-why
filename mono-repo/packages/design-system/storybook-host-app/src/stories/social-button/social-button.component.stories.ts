import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DS_SOCIAL_BUTTON_APP_ARRAY, DS_SOCIAL_BUTTON_SIZES_ARRAY, DS_SOCIAL_BUTTON_VARIANT_ARRAY, DsSocialButton } from '@frontend/ui/social-button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type DsSocialButtonStoryType = DsSocialButton & { label: string };

const meta: Meta<DsSocialButtonStoryType> = {
    title: 'Components/Button/Social',
    component: DsSocialButton,
    parameters: {
        status: generateStatusBadges('UX-2301', ['integration ready']),
    },
    excludeStories: /.*Data$/,
    args: {
        socialApp: 'apple',
        variant: 'filled',
        size: 'large',
        disabled: false,
        label: 'Sign In With Entain',
    },
    argTypes: {
        socialApp: {
            options: DS_SOCIAL_BUTTON_APP_ARRAY,
            table: {
                category: 'Styling',
                type: { summary: `yahoo, paypal, mlife, entain, facebook, apple, google` },
            },
            control: { type: 'select' },
            description: 'The social app of the button',
        },
        variant: {
            options: DS_SOCIAL_BUTTON_VARIANT_ARRAY,
            table: {
                defaultValue: { summary: 'filled' },
                category: 'Styling',
                type: { summary: `filled, outline` },
            },
            control: { type: 'select' },
            description: 'The variant of the button',
        },
        size: {
            options: DS_SOCIAL_BUTTON_SIZES_ARRAY,
            table: {
                defaultValue: { summary: 'large' },
                category: 'Styling',
                type: { summary: 'small, medium, large' },
            },
            control: { type: 'select' },
            description: 'The size of the button',
        },
        disabled: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The disabled state of the button',
        },
        label: {
            type: 'string',
            control: {
                type: 'text',
            },
            table: {
                defaultValue: { summary: 'Button' },
            },
            description: 'The label of the button',
        },
    },
};

export default meta;
type Story = StoryObj<DsSocialButtonStoryType>;

export const LeftIcon: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=2562-76134&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: (button) => ({
        template: `
            <button ds-social-button variant="${button.variant}" socialApp="${button.socialApp}" size="${button.size}" [disabled]="${button.disabled}">
                ${button.label}
                <ds-demo-icon slot="start" iconName="${button.socialApp}"/>
            </button>
        `,
    }),
};

export const allVariants: Story = {
    tags: ['docs-template'],
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    parameters: {
        docs: {
            source: {
                code: null,
            },
        },
    },
    render: () => ({
        template: `
            <div style="display: grid; grid-gap: 10px; grid-template-columns: repeat(8, 1fr); justify-items: center; align-items: center;">
                ${generateHeader()}
                ${generateRows()}
            </div>
        `,
    }),
};

function generateHeader() {
    const socialApps = ['Apple', 'Google', 'Paypal', 'Facebook', 'Entain', 'Mlife', 'Yahoo'];
    return `
        <strong>Type</strong>
        ${socialApps.map((app) => `<strong style="grid-column: span 1">${app}</strong>`).join('')}
    `;
}

function generateRows() {
    const variants = ['Filled', 'Outline'];
    const socialApps = ['apple', 'google', 'paypal', 'facebook', 'entain', 'mlife', 'yahoo'];

    return (
        variants
            .map(
                (variant) => `
        <div style="display: contents;">
            <strong>${variant}</strong>
            ${socialApps.map((app) => generateButton({ variant, socialApp: app, size: 'large', label: capitalizeFirstLetter(app), disabled: false })).join('')}
        </div>
    `,
            )
            .join('') +
        `
        <div style="display: contents;">
            <strong>Disabled</strong>
            ${socialApps.map((app) => generateButton({ variant: 'filled', socialApp: app, size: 'large', label: capitalizeFirstLetter(app), disabled: true })).join('')}
        </div>
    `
    );
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
function generateButton(button: any) {
    return `
        <button ds-social-button variant="${button.variant.toLowerCase()}" socialApp="${button.socialApp}" size="${button.size}" ${button.disabled ? 'disabled="true"' : ''}>
            ${button.label}
            <ds-demo-icon slot="start" iconName="${button.socialApp}"/>
        </button>
    `;
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
