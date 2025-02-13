import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DS_BUTTON_VARIANTS_ARRAY } from '@frontend/ui/button';
import { DS_ICON_BUTTON_KIND_ARRAY, DS_ICON_BUTTON_SIZES_ARRAY, DsIconButton } from '@frontend/ui/icon-button';
import { action } from '@storybook/addon-actions';
import { withActions } from '@storybook/addon-actions/decorator';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { expect, fireEvent, fn, userEvent, within } from '@storybook/test';

import { isUnsupportedCombination } from '../utils/button-utils';

export const actionsData = {
    onClick: fn(action('click')),
    onFocus: fn(action('focus')),
};

const meta: Meta<DsIconButton> = {
    title: 'Components/Button/Icon Button',
    component: DsIconButton,
    excludeStories: /.*Data$/,
    parameters: {
        status: generateStatusBadges('UX-2301', ['stable']),
    },
    args: {
        variant: 'filled',
        kind: 'primary',
        size: 'large',
        disabled: false,
        inverse: false,
    },
    argTypes: {
        variant: {
            options: DS_BUTTON_VARIANTS_ARRAY,
            table: {
                defaultValue: { summary: 'filled' },
                category: 'Styling',
                type: { summary: 'filled, outline, flat, flat-reduced' },
            },
            control: { type: 'select' },
            description: 'The variant of the button',
        },
        kind: {
            options: DS_ICON_BUTTON_KIND_ARRAY,
            table: {
                defaultValue: { summary: 'primary' },
                category: 'Styling',
                type: { summary: 'primary, secondary, tertiary, utility' },
            },
            control: { type: 'select' },
            description: 'The kind of the button',
        },
        size: {
            options: DS_ICON_BUTTON_SIZES_ARRAY,
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
        inverse: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The inverse state of the button',
        },
    },

    decorators: [withActions],
};

export default meta;
type Story = StoryObj<DsIconButton>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=2313-117491&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsIconButton] }), withActions],
    render: (button) => {
        const variant = button.variant;
        const kind = button.kind;
        const isUnsupported = isUnsupportedCombination(variant, kind);

        return {
            props: {
                ...button,
                click: actionsData.onClick,
                focus: actionsData.onFocus,
            },
            template: `
                ${
                    isUnsupported
                        ? `
                    <div style="color: red;">Not Supported</div>
                `
                        : `
                    <button
                        ds-icon-button
                        data-testId="activeButton" 
                        ${argsToTemplate(
                            {
                                ...button,
                                click: actionsData.onClick,
                                focus: actionsData.onFocus,
                            },
                            { include: ['size', 'variant', 'kind', 'disabled', 'inverse', 'click', 'focus'] },
                        )}
                    >
                        <ds-demo-icon iconName="placeholder"  />

                    </button>
                `
                }
            `,
        };
    },
    play: async ({ canvasElement, step }) => {
        await step('check Click event is being called', async () => {
            const canvas = within(canvasElement);
            const button = canvas.getByTestId('activeButton');
            await fireEvent.focus(button);
            await expect(actionsData.onFocus).toHaveBeenCalled();
            const user = userEvent.setup();
            await user.click(button);
            await expect(actionsData.onClick).toHaveBeenCalled();
        });
    },
};

export const Disabled: Story = {
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsIconButton] }), withActions],
    args: {
        ...meta.args,
        disabled: true,
    },
    render: (args) => ({
        props: {
            ...args,
            click: actionsData.onClick,
            focus: actionsData.onFocus,
        },
        template: `
            <button
                ds-icon-button 
                data-testId="disabledButton" 
                ${argsToTemplate(
                    {
                        ...args,
                        click: actionsData.onClick,
                        focus: actionsData.onFocus,
                    },
                    { include: ['size', 'variant', 'kind', 'disabled', 'inverse', 'click', 'focus'] },
                )}>
                     <ds-demo-icon iconName="placeholder"  />
           </button>`,
    }),
    play: async ({ canvasElement, step }) => {
        await step('check disabled state', async () => {
            const canvas = within(canvasElement);
            const button = canvas.getByTestId('disabledButton');
            await fireEvent.focus(button);
            await expect(actionsData.onFocus).toHaveBeenCalled();
            await expect(button).toHaveClass('ds-btn-icon-disabled');
            actionsData.onClick.mockClear();
            await expect(actionsData.onClick).not.toHaveBeenCalled();
            const user = userEvent.setup({
                pointerEventsCheck: 0,
            });
            await user.click(button);
            await expect(actionsData.onClick).not.toHaveBeenCalled();
        });
    },
};

export const allVariants: StoryObj<DsIconButton> = {
    tags: ['docs-template'],
    parameters: {
        a11y: { disable: true },
    },
    decorators: [moduleMetadata({ imports: [DsIconButton, DemoIconComponent] })],
    render: (args) => getRenderedTemplate(args),
};

function getRenderedTemplate(args: any) {
    return {
        props: args,
        template: `
            <div style="font-family: sans-serif;">
                <h2>All Icon Button components</h2>
                <div style="display: grid; grid-template-columns: auto repeat(4, 1fr); gap: 16px; align-items: center; margin-bottom: 24px;">
                    ${generateFilledOutlineHeader()}
                    ${generateButtons('Filled')}
                    ${generateButtons('Outline')}
                </div>
                <div style="display: grid; grid-template-columns: auto repeat(3, 1fr); gap: 25px; align-items: center; justify-items:center;">
                    ${generateFlatHeader()}
                    ${generateFlatButtons()}
                    ${generateFlatReducedButtons()}
                </div>
            </div>
        `,
    };
}

function generateFilledOutlineHeader() {
    return `
        <div style="font-weight: bold;">Type</div>
        <div style="font-weight: bold;">Primary</div>
        <div style="font-weight: bold;">Secondary</div>
        <div style="font-weight: bold;">Tertiary</div>
        <div style="font-weight: bold;">Disabled</div>
    `;
}

function generateFlatHeader() {
    return `
        <div style="font-weight: bold;">Type</div>
        <div style="font-weight: bold;">Tertiary</div>
        <div style="font-weight: bold;">Utility</div>
        <div style="font-weight: bold;">Disabled</div>
    `;
}

function generateButtons(variant: string) {
    const kinds = ['primary', 'secondary', 'tertiary'];
    const buttons = kinds
        .map(
            (kind) => `
        <button 
            ds-icon-button 
            variant="${variant.toLowerCase()}" 
            kind="${kind}"
        >
             <ds-demo-icon iconName="placeholder"  />
        </button>
    `,
        )
        .join('');

    const disabledButton = `
        <button 
            ds-icon-button 
            variant="${variant.toLowerCase()}" 
            kind="primary"
            disabled="true"
        >
             <ds-demo-icon iconName="placeholder"  />
        </button>
    `;

    return `
        <div style="font-weight: bold;">${variant}</div>
        ${buttons}
        ${disabledButton}
    `;
}

function generateFlatButtons() {
    return `
        <div style="font-weight: bold;">Flat</div>
        <button ds-icon-button variant="flat" kind="tertiary">
             <ds-demo-icon iconName="placeholder"  />
        </button>
        <button ds-icon-button variant="flat" kind="utility">
             <ds-demo-icon iconName="placeholder"  />
        </button>
        <button ds-icon-button variant="flat" kind="tertiary" disabled="true">
             <ds-demo-icon iconName="placeholder"  />
        </button>
    `;
}

function generateFlatReducedButtons() {
    return `
        <div style="font-weight: bold;">Flat-Reduced</div>
        <button ds-icon-button variant="flat-reduced" kind="tertiary">
             <ds-demo-icon iconName="placeholder"  />
        </button>
        <button ds-icon-button variant="flat-reduced" kind="utility">
             <ds-demo-icon iconName="placeholder"  />
        </button>
        <button ds-icon-button variant="flat-reduced" kind="tertiary" disabled="true">
             <ds-demo-icon iconName="placeholder"  />
        </button>
    `;
}
