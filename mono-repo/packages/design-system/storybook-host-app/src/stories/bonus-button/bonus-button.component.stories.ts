import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DsBonusButton } from '@frontend/ui/bonus-button';
import { action } from '@storybook/addon-actions';
import { withActions } from '@storybook/addon-actions/decorator';
import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { expect, fireEvent, fn, userEvent, within } from '@storybook/test';

export const actionsData = {
    onClick: fn(action('clicked')),
    onFocus: fn(action('focus')),
};

type DsBonusButtonStoryType = DsBonusButton & { label: string; valueText: string };

const meta: Meta<DsBonusButtonStoryType> = {
    title: 'Components/Button/Bonus Button',
    parameters: {
        status: generateStatusBadges('UX-2301', ['stable']),
    },
    component: DsBonusButton,
    excludeStories: /.*Data$/,
    args: {
        disabled: false,
        valueText: '$00.00',
        label: 'Bonus',
        inverse: false,
    },
    argTypes: {
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
        valueText: {
            type: 'string',
            control: {
                type: 'text',
            },

            description: 'The value text of the button',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the button',
        },
    },
    decorators: [withActions],
};

export default meta;
type Story = StoryObj<DsBonusButtonStoryType>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=1819-19768&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    render: (args) => ({
        props: {
            ...args,
            click: actionsData.onClick,
            focus: actionsData.onFocus,
        },
        template: `
        <div style="display:flex; padding: 20px; gap: 20px;" >
            <button ds-bonus-button ${argsToTemplate(
                {
                    ...args,
                    click: actionsData.onClick,
                    focus: actionsData.onFocus,
                },
                { include: ['disabled', 'inverse', 'click', 'focus'] },
            )}>
                ${args.label}
                <span slot="value">${args.valueText}</span>
            </button>

            <button ds-bonus-button [disabled]="true" ${argsToTemplate(
                {
                    ...args,
                    click: actionsData.onClick,
                    focus: actionsData.onFocus,
                },
                { include: ['inverse', 'click', 'focus'] },
            )}>
               Disabled
               <span slot="value">${args.valueText}</span>
            </button>
        <div>
        `,
    }),
    play: async ({ canvasElement, step }) => {
        await step('check Click event is being called', async () => {
            const canvas = within(canvasElement);
            const button = canvas.getAllByRole('button')[0];
            await fireEvent.focus(button);
            await expect(actionsData.onFocus).toHaveBeenCalled();
            const user = userEvent.setup();
            await user.click(button);
            await expect(actionsData.onClick).toHaveBeenCalled();
        });
        await step('check disabled state', async () => {
            const canvas = within(canvasElement);
            const button = canvas.getAllByRole('button')[1];
            await fireEvent.focus(button);
            await expect(actionsData.onFocus).toHaveBeenCalled();
            await expect(button).toHaveClass('ds-btn-bonus-disabled');
            await fireEvent.click(button);
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

export const Inverse: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: args,
        template: `
        <div style="background-color: rgba(174,172,156,0.56);padding: 20px;">
            <button ds-bonus-button inverse>
               Inversed Button
               <span slot="value">${args.valueText}</span>
            </button>
        </div>
    `,
    }),
};
